import {
  ObjectType,
  OpenCV,
  InterpolationFlags,
  BorderTypes,
  DecompTypes,
  Mat,
  DataTypes,
  RotateFlags,
} from 'react-native-fast-opencv';
import { Point, ImageSource, Corner } from '@types';
import { toBase64 } from '@utils/imageUtils';
import { FileSystemService } from './FileSystemService';

export class TransformService {
  /**
   * Transforms an image using OpenCV's perspective transformation in React Native.
   * This function:
   * 1. Loads the image from the file system as base64
   * 2. Converts the image to OpenCV matrix format
   * 3. Creates source and destination point vectors
   * 4. Calculates the perspective transformation matrix
   * 5. Applies the transformation with specified interpolation and border handling
   * 6. Converts the result back to base64 format
   *
   * @param image - The source image with its URI and dimensions
   * @param srcPoints - Array of 4 points representing the source corners
   * @param dstPoints - Array of 4 points representing the destination corners
   * @param cropToRectangle - Whether to crop the result to the transformed rectangle
   * @param signal - Optional AbortSignal for cancellation
   * @returns Promise resolving to the transformed image as a base64 string
   */
  static transformImage = async (
    image: ImageSource,
    srcPoints: Point[],
    dstPoints: Point[],
    cropToRectangle: boolean = false,
    signal?: AbortSignal
  ) => {
    // Clear any existing OpenCV buffers to prevent memory leaks
    OpenCV.clearBuffers();

    try {
      // Check for cancellation before starting
      if (signal?.aborted) {
        throw new Error('AbortError');
      }

      const {
        uri,
        dimensions: { width, height },
        tags,
      } = image;

      // Validate input image URI
      if (!uri) {
        throw new Error('Image URI is null');
      }

      // Load image as base64 from file system
      const base64 = await FileSystemService.getImageAsBase64(uri);

      if (!base64) {
        throw new Error('Image base64 is null');
      }

      // Check for cancellation after loading image
      if (signal?.aborted) {
        throw new Error('AbortError');
      }

      // Convert base64 image to OpenCV matrix
      let src: Mat;

      const rotation = this.getRotation(tags?.Orientation);
      if (rotation !== null) {
        const originalOrientation = OpenCV.base64ToMat(base64);
        src = OpenCV.createObject(
          ObjectType.Mat,
          height,
          width,
          DataTypes.CV_8UC4
        );
        OpenCV.invoke('rotate', originalOrientation, src, rotation);
      } else {
        src = OpenCV.base64ToMat(base64);
      }

      // Convert points to OpenCV vector format
      const srcCVPoints = this.getVector(srcPoints);
      const dstCVPoints = this.getVector(dstPoints);

      // Check for cancellation after converting points
      if (signal?.aborted) {
        throw new Error('AbortError');
      }

      // Calculate perspective transformation matrix using LU decomposition
      const perspectiveMatrix = OpenCV.invoke(
        'getPerspectiveTransform',
        srcCVPoints,
        dstCVPoints,
        DecompTypes.DECOMP_LU
      );

      // Create destination matrix for transformed image
      const dst = OpenCV.createObject(
        ObjectType.Mat,
        height,
        width,
        DataTypes.CV_8UC4
      );

      // Create size object for output dimensions
      const size = OpenCV.createObject(ObjectType.Size, width, height);

      // Create scalar for border color (black)
      const scalar = OpenCV.createObject(ObjectType.Scalar, 0);

      // Check for cancellation before transformation
      if (signal?.aborted) {
        throw new Error('AbortError');
      }

      // Apply perspective transformation with linear interpolation and constant border
      OpenCV.invoke(
        'warpPerspective',
        src,
        dst,
        perspectiveMatrix,
        size,
        InterpolationFlags.INTER_LINEAR,
        BorderTypes.BORDER_CONSTANT,
        scalar
      );

      // Check for cancellation after transformation
      if (signal?.aborted) {
        throw new Error('AbortError');
      }

      // Convert result back to base64 format
      const data2 = OpenCV.toJSValue(
        this.getCroppedImage(dst, cropToRectangle ? dstPoints : null)
      );
      return toBase64(data2.base64);
    } catch (error) {
      console.error('Error transforming image', error);
      throw error;
    } finally {
      // Clean up OpenCV buffers
      OpenCV.clearBuffers();
    }
  };

  /**
   * Converts an array of points into OpenCV vector format.
   * Creates a vector of Point2f objects representing the corners.
   * Points are ordered as: top-left, top-right, bottom-right, bottom-left.
   *
   * @param points - Array of 4 points to convert
   * @returns OpenCV vector containing the points
   */
  static getVector = (points: Point[]) => {
    return OpenCV.createObject(
      ObjectType.Point2fVector,
      points.map((p) => OpenCV.createObject(ObjectType.Point2f, p.x, p.y))
    );
  };

  static getCroppedImage = (dst: Mat, dstPoints: Point[] | null) => {
    if (!dstPoints) {
      return dst;
    }

    const topLeft = dstPoints[Corner.Top_Left];
    const bottomRight = dstPoints[Corner.Bottom_Right];

    const width = bottomRight.x - topLeft.x;
    const height = bottomRight.y - topLeft.y;

    const roi = OpenCV.createObject(
      ObjectType.Rect,
      topLeft.x,
      topLeft.y,
      width,
      height
    );

    const cropped = OpenCV.createObject(
      ObjectType.Mat,
      width,
      height,
      DataTypes.CV_8UC4
    );

    OpenCV.invoke('crop', dst, cropped, roi);

    return cropped;
  };

  static getRotation(Orientation: number | undefined) {
    switch (Orientation) {
      case 5:
      case 6:
        return RotateFlags.ROTATE_90_CLOCKWISE;
      case 7:
      case 8:
        return RotateFlags.ROTATE_90_COUNTERCLOCKWISE;
      case 3:
      case 4:
        return RotateFlags.ROTATE_180;
      default:
        return null;
    }
  }
}
