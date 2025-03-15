import { DataTypes, ObjectType, OpenCV } from 'react-native-fast-opencv';
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
  // Order the points according to the Corner enum
  const orderedPoints = orderPointsByCorner(selectedOverlay);

  // Get the largest rectangle that fits within the quadrilateral
  const largestRect = getLargestRectangle(orderedPoints);

  console.log('transformImage Native', uri, selectedOverlay, cropToRectangle);

  const src = OpenCV.base64ToMat(uri);

  console.log('src', src);

  const { cols, rows } = OpenCV.toJSValue(src, 'png');

  console.log('cols', cols);

  const srcData = [];

  srcData[0] = orderedPoints[0].x * cols; // Top-left x
  srcData[1] = orderedPoints[0].y * rows; // Top-left y
  srcData[2] = orderedPoints[1].x * cols; // Top-right x
  srcData[3] = orderedPoints[1].y * rows; // Top-right y
  srcData[4] = orderedPoints[2].x * cols; // Bottom-right x
  srcData[5] = orderedPoints[2].y * rows; // Bottom-right y
  srcData[6] = orderedPoints[3].x * cols; // Bottom-left x
  srcData[7] = orderedPoints[3].y * rows; // Bottom-left y

  const srcPoints = OpenCV.createObject(
    ObjectType.Mat,
    4,
    1,
    DataTypes.CV_32FC2,
    srcData
  );

  // Calculate the actual coordinates of the largest rectangle
  const topLeftX = largestRect.topLeft.x * cols;
  const topLeftY = largestRect.topLeft.y * rows;
  const bottomRightX = largestRect.bottomRight.x * cols;
  const bottomRightY = largestRect.bottomRight.y * rows;

  // Calculate width and height of the rectangle
  const rectWidth = Math.round(bottomRightX - topLeftX);
  const rectHeight = Math.round(bottomRightY - topLeftY);

  const dstData = [];
  dstData[0] = topLeftX; // Top-left x
  dstData[1] = topLeftY; // Top-left y
  dstData[2] = bottomRightX; // Top-right x
  dstData[3] = topLeftY; // Top-right y
  dstData[4] = bottomRightX; // Bottom-right x
  dstData[5] = bottomRightY; // Bottom-right y
  dstData[6] = topLeftX; // Bottom-left x
  dstData[7] = bottomRightY; // Bottom-left y

  const dstPoints = OpenCV.createObject(
    ObjectType.Mat,
    4,
    1,
    DataTypes.CV_32FC2,
    dstData
  );

  const perspectiveMatrix = OpenCV.createObject(
    ObjectType.Mat,
    3,
    3,
    DataTypes.CV_32FC2
  );

  console.log('perspectiveMatrix', perspectiveMatrix);

  OpenCV.invoke(
    'perspectiveTransform',
    srcPoints,
    dstPoints,
    perspectiveMatrix
  );

  const dst = OpenCV.createObject(
    ObjectType.Mat,
    rows,
    cols,
    DataTypes.CV_8UC3
  );

  const size = OpenCV.createObject(ObjectType.Size, cols, rows);

  OpenCV.invoke('warpPerspective', src, dst, perspectiveMatrix, size);
  return '';
};
