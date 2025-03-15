import {
  DataTypes,
  ObjectType,
  OpenCV,
  InterpolationFlags,
  BorderTypes,
  DecompTypes,
} from 'react-native-fast-opencv';
import { Point } from '../stores/useOverlayStore';
import { getLargestRectangle, orderPointsByCorner } from './overlayUtils';

/**
 * Transforms an image using perspective correction based on the selected overlay points.
 * This function:
 * 1. Orders the overlay points correctly
 * 2. Calculates the largest rectangle that fits in the quadrilateral
 * 3. Performs perspective transformation to "unwarp" the image
 *
 * @param uri - URI of the source image
 * @param selectedOverlay - Array of 4 points defining the quadrilateral region to unwarp
 * @param cropToRectangle - If true, crops the result to just the rectangle; if false, keeps the whole image (default: true)
 * @returns Promise resolving to the URI of the transformed image
 */
export const transformImage = async (
  uri: string,
  imageHeight: number,
  imageWidth: number,
  selectedOverlay: Point[],
  cropToRectangle: boolean = false
): Promise<string> => {
  // Order the points according to the Corner enum
  const orderedPoints = orderPointsByCorner(selectedOverlay);

  // Get the largest rectangle that fits within the quadrilateral
  const largestRect = getLargestRectangle(orderedPoints);

  const src = OpenCV.base64ToMat(uri);

  const cols = imageWidth;
  const rows = imageHeight;

  const srcTopLeft = OpenCV.createObject(
    ObjectType.Point2f,
    orderedPoints[0].x * cols,
    orderedPoints[0].y * rows
  );

  const srcTopRight = OpenCV.createObject(
    ObjectType.Point2f,
    orderedPoints[1].x * cols,
    orderedPoints[1].y * rows
  );

  const srcBottomRight = OpenCV.createObject(
    ObjectType.Point2f,
    orderedPoints[2].x * cols,
    orderedPoints[2].y * rows
  );

  const srcBottomLeft = OpenCV.createObject(
    ObjectType.Point2f,
    orderedPoints[3].x * cols,
    orderedPoints[3].y * rows
  );

  const srcPoints = OpenCV.createObject(ObjectType.Point2fVector, [
    srcTopLeft,
    srcTopRight,
    srcBottomRight,
    srcBottomLeft,
  ]);

  // Calculate the actual coordinates of the largest rectangle
  const topLeftX = largestRect.topLeft.x * cols;
  const topLeftY = largestRect.topLeft.y * rows;
  const bottomRightX = largestRect.bottomRight.x * cols;
  const bottomRightY = largestRect.bottomRight.y * rows;

  const dstTopLeft = OpenCV.createObject(
    ObjectType.Point2f,
    topLeftX,
    topLeftY
  );

  const dstTopRight = OpenCV.createObject(
    ObjectType.Point2f,
    bottomRightX,
    topLeftY
  );

  const dstBottomRight = OpenCV.createObject(
    ObjectType.Point2f,
    bottomRightX,
    bottomRightY
  );

  const dstBottomLeft = OpenCV.createObject(
    ObjectType.Point2f,
    topLeftX,
    bottomRightY
  );

  const dstPoints = OpenCV.createObject(ObjectType.Point2fVector, [
    dstTopLeft,
    dstTopRight,
    dstBottomRight,
    dstBottomLeft,
  ]);

  const perspectiveMatrix = OpenCV.invoke(
    'getPerspectiveTransform',
    srcPoints,
    dstPoints,
    DecompTypes.DECOMP_LU
  );

  const dst = OpenCV.createObject(
    ObjectType.Mat,
    rows,
    cols,
    DataTypes.CV_8UC3
  );

  const size = OpenCV.createObject(ObjectType.Size, cols, rows);

  const scalar = OpenCV.createObject(ObjectType.Scalar, 0, 0, 0);

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

  const data2 = OpenCV.toJSValue(dst);
  return data2.base64;
};
