import cv from '@techstark/opencv-js';
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
  selectedOverlay: Point[],
  cropToRectangle: boolean = false
): Promise<string> => {
  // Ensure OpenCV is loaded
  if (!cv || !cv.Mat) {
    throw new Error('OpenCV is not loaded');
  }

  // Order the points according to the Corner enum
  const orderedPoints = orderPointsByCorner(selectedOverlay);

  // Get the largest rectangle that fits within the quadrilateral
  const largestRect = getLargestRectangle(orderedPoints);

  try {
    // Load the image directly using an Image element
    const img = new Image();
    img.src = uri;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => reject(new Error('Failed to load image'));
    });

    // Convert the image to a cv.Mat
    const src = cv.imread(img);

    // Define source points (the quadrilateral)
    const srcPoints = new cv.Mat(4, 1, cv.CV_32FC2);
    srcPoints.data32F[0] = orderedPoints[0].x * src.cols; // Top-left x
    srcPoints.data32F[1] = orderedPoints[0].y * src.rows; // Top-left y
    srcPoints.data32F[2] = orderedPoints[1].x * src.cols; // Top-right x
    srcPoints.data32F[3] = orderedPoints[1].y * src.rows; // Top-right y
    srcPoints.data32F[4] = orderedPoints[2].x * src.cols; // Bottom-right x
    srcPoints.data32F[5] = orderedPoints[2].y * src.rows; // Bottom-right y
    srcPoints.data32F[6] = orderedPoints[3].x * src.cols; // Bottom-left x
    srcPoints.data32F[7] = orderedPoints[3].y * src.rows; // Bottom-left y

    // Calculate the actual coordinates of the largest rectangle
    const topLeftX = largestRect.topLeft.x * src.cols;
    const topLeftY = largestRect.topLeft.y * src.rows;
    const bottomRightX = largestRect.bottomRight.x * src.cols;
    const bottomRightY = largestRect.bottomRight.y * src.rows;

    // Calculate width and height of the rectangle
    const rectWidth = Math.round(bottomRightX - topLeftX);
    const rectHeight = Math.round(bottomRightY - topLeftY);

    // Always use the same perspective transformation
    // Define destination points using the actual rectangle coordinates
    const dstPoints = new cv.Mat(4, 1, cv.CV_32FC2);
    dstPoints.data32F[0] = topLeftX; // Top-left x
    dstPoints.data32F[1] = topLeftY; // Top-left y
    dstPoints.data32F[2] = bottomRightX; // Top-right x
    dstPoints.data32F[3] = topLeftY; // Top-right y
    dstPoints.data32F[4] = bottomRightX; // Bottom-right x
    dstPoints.data32F[5] = bottomRightY; // Bottom-right y
    dstPoints.data32F[6] = topLeftX; // Bottom-left x
    dstPoints.data32F[7] = bottomRightY; // Bottom-left y

    // Calculate perspective transform matrix
    const perspectiveMatrix = cv.getPerspectiveTransform(srcPoints, dstPoints);

    // Create destination matrix
    const dst = new cv.Mat();

    // Apply perspective transformation (same for both cases)
    cv.warpPerspective(
      src,
      dst,
      perspectiveMatrix,
      new cv.Size(src.cols, src.rows)
    );

    console.log('cols, rows', src.cols, src.rows);

    // Create a canvas sized to the cropped area
    let resultUri;
    let canvasWidth;
    let canvasHeight;
    let canvasSrc; // holds the transformed image

    if (cropToRectangle) {
      // If cropping, extract just the rectangle region
      const rect = new cv.Rect(
        Math.round(topLeftX),
        Math.round(topLeftY),
        rectWidth,
        rectHeight
      );
      canvasSrc = dst.roi(rect);
      canvasWidth = rectWidth;
      canvasHeight = rectHeight;
    } else {
      // If not cropping, use the full image
      canvasSrc = dst;
      canvasWidth = src.cols;
      canvasHeight = src.rows;
    }

    // Create a canvas
    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Draw the full transformed image
    cv.imshow(canvas, canvasSrc);
    resultUri = canvas.toDataURL('image/jpeg');

    // Clean up OpenCV resources
    src.delete();
    dst.delete();
    srcPoints.delete();
    dstPoints.delete();
    perspectiveMatrix.delete();

    return resultUri;
  } catch (error) {
    console.error('Error transforming image:', error);
    throw error;
  }
};
