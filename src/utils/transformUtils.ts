import cv, { EmscriptenEmbindInstance } from '@techstark/opencv-js';
import { Point, ImageSource, Corner } from '../types';

/**
 * Transforms an image using OpenCV's perspective transformation.
 * This function:
 * 1. Loads the image into OpenCV format
 * 2. Creates source and destination point matrices
 * 3. Calculates the perspective transformation matrix
 * 4. Applies the transformation
 * 5. Optionally crops to the transformed rectangle
 * 6. Converts the result back to base64 format
 *
 * @param image - The source image with its URI and dimensions
 * @param srcPoints - Array of 4 points representing the source corners
 * @param dstPoints - Array of 4 points representing the destination corners
 * @param cropToRectangle - Whether to crop the result to the transformed rectangle
 * @returns Promise resolving to the transformed image as a base64 string
 */
export const transformImage = async (
  image: ImageSource,
  srcPoints: Point[],
  dstPoints: Point[],
  cropToRectangle: boolean = false
): Promise<string> => {
  // Ensure OpenCV is loaded
  if (!cv || !cv.Mat) {
    throw new Error('OpenCV is not loaded');
  }

  // Check if image URI exists before proceeding with transformation
  if (!image.uri) {
    throw new Error('Image URI is null');
  }

  const {
    uri,
    dimensions: { width, height },
  } = image;

  // Track OpenCV objects for proper cleanup
  const itemsToDelete: EmscriptenEmbindInstance[] = [];

  try {
    // Load image into OpenCV format
    const src = cv.imread(await getHTMLImageElement(uri));
    itemsToDelete.push(src);

    // Convert points to OpenCV matrix format
    const srcCVPoints = getCVPoints(srcPoints);
    itemsToDelete.push(srcCVPoints);
    const dstCVPoints = getCVPoints(dstPoints);
    itemsToDelete.push(dstCVPoints);

    // Calculate perspective transformation matrix
    const perspectiveMatrix = cv.getPerspectiveTransform(
      srcCVPoints,
      dstCVPoints
    );
    itemsToDelete.push(perspectiveMatrix);

    // Create destination matrix for transformed image
    const dst = new cv.Mat();
    itemsToDelete.push(dst);

    // Apply perspective transformation
    cv.warpPerspective(src, dst, perspectiveMatrix, new cv.Size(width, height));

    // Handle cropping if requested
    if (cropToRectangle) {
      const { canvasWidth, canvasHeight, canvasSrc } = getCropParameters(
        dstPoints,
        dst
      );
      return getBase64Image(canvasSrc, canvasWidth, canvasHeight);
    }

    return getBase64Image(dst, width, height);
  } catch (error) {
    console.error('Error transforming image:', error);
    throw error;
  } finally {
    // Clean up OpenCV objects to prevent memory leaks
    itemsToDelete.forEach((item) => item.delete());
  }
};

/**
 * Loads an image from a URI into an HTMLImageElement.
 * Used as an intermediate step to load images into OpenCV format.
 *
 * @param uri - The URI of the image to load
 * @returns Promise resolving to an HTMLImageElement
 * @throws Error if image loading fails
 */
const getHTMLImageElement = async (uri: string): Promise<HTMLImageElement> => {
  const img = new Image();
  img.src = uri;
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = () => reject(new Error('Failed to load image'));
  });
  return img;
};

/**
 * Converts an array of points into an OpenCV matrix format.
 * Creates a 4x1 matrix of 32-bit floating-point values representing the points.
 * Points are ordered as: top-left, top-right, bottom-right, bottom-left.
 *
 * @param points - Array of 4 points to convert
 * @returns OpenCV matrix containing the points
 */
const getCVPoints = (points: Point[]): cv.Mat => {
  const cvPoints = new cv.Mat(4, 1, cv.CV_32FC2);
  cvPoints.data32F[0] = points[0].x; // Top-left x
  cvPoints.data32F[1] = points[0].y; // Top-left y
  cvPoints.data32F[2] = points[1].x; // Top-right x
  cvPoints.data32F[3] = points[1].y; // Top-right y
  cvPoints.data32F[4] = points[2].x; // Bottom-right x
  cvPoints.data32F[5] = points[2].y; // Bottom-right y
  cvPoints.data32F[6] = points[3].x; // Bottom-left x
  cvPoints.data32F[7] = points[3].y; // Bottom-left y;
  return cvPoints;
};

/**
 * Calculates the parameters needed for cropping the transformed image.
 * Determines the dimensions and region of interest based on the destination points.
 *
 * @param dstPoints - Array of 4 points representing the destination corners
 * @param dst - The transformed OpenCV matrix
 * @returns Object containing the crop dimensions and source matrix
 */
const getCropParameters = (
  dstPoints: Point[],
  dst: cv.Mat
): {
  canvasWidth: number;
  canvasHeight: number;
  canvasSrc: cv.Mat;
} => {
  let canvasWidth = dst.cols;
  let canvasHeight = dst.rows;
  let canvasSrc = dst; // holds the transformed image

  const topLeft = dstPoints[Corner.Top_Left];
  const bottomRight = dstPoints[Corner.Bottom_Right];

  // Calculate the dimensions of the rectangle to crop
  const rectWidth = Math.round(bottomRight.x - topLeft.x);
  const rectHeight = Math.round(bottomRight.y - topLeft.y);

  // Create a region of interest rectangle
  const rect = new cv.Rect(
    Math.round(topLeft.x),
    Math.round(topLeft.y),
    rectWidth,
    rectHeight
  );
  canvasSrc = dst.roi(rect);
  canvasWidth = rectWidth;
  canvasHeight = rectHeight;

  return { canvasWidth, canvasHeight, canvasSrc };
};

/**
 * Converts an OpenCV matrix to a base64-encoded PNG image.
 * Uses an HTML canvas as an intermediate step for the conversion.
 *
 * @param src - The OpenCV matrix to convert
 * @param width - Width of the output image
 * @param height - Height of the output image
 * @returns Base64-encoded PNG image string
 */
function getBase64Image(src: cv.Mat, width: number, height: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  // Draw the transformed image to canvas and convert to base64
  cv.imshow(canvas, src);
  const resultUri = canvas.toDataURL('image/png');
  return resultUri;
}
