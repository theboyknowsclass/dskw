import { Point } from '@types';

/**
 * Calculates the transform values needed to center the zoom preview on a specific point.
 *
 * @param zoomWindowSize - The size of the zoom preview window (width and height in pixels)
 * @param activePoint - The point to center on, in relative coordinates (0-1)
 * @param originalDimensions - The original dimensions of the source image
 * @returns An array of transform objects with translateX and translateY values
 *
 * @example
 * // For a 200x200 zoom window and a point at (0.5, 0.5) in a 1000x1000 image:
 * const transform = getZoomTransform(200, { x: 0.5, y: 0.5 }, { width: 1000, height: 1000 });
 * // Returns: [{ translateX: -300 }, { translateY: -300 }]
 *
 * @remarks
 * - The function returns an empty array if no active point is provided
 * - Point coordinates are clamped between 0 and 1
 * - The transform centers the point in the zoom window by calculating the offset
 *   needed to position the point at the center of the window
 */
export const getZoomTransform = (
  zoomWindowSize: number,
  activePoint: Point | null,
  originalDimensions: { width: number; height: number }
) => {
  if (!activePoint) {
    return [];
  }

  // Bound checking for the point coordinates
  const pointX = Math.max(0, Math.min(1, activePoint.x));
  const pointY = Math.max(0, Math.min(1, activePoint.y));

  // Calculate transform directly in render method - no state or memo
  const startX = zoomWindowSize / 2;
  const startY = zoomWindowSize / 2;

  const transform = [
    { translateX: startX - pointX * originalDimensions.width },
    { translateY: startY - pointY * originalDimensions.height },
  ];

  return transform;
};

/**
 * Calculates the active point coordinates from transform values.
 * This is the inverse operation of getZoomTransform.
 *
 * @param zoomWindowSize - The size of the zoom preview window (width and height in pixels)
 * @param transform - The transform object containing translateX and translateY values
 * @param originalDimensions - The original dimensions of the source image
 * @returns A Point object with x and y coordinates in relative values (0-1)
 *
 * @example
 * // For a 200x200 zoom window and transform values of -300:
 * const point = getActivePoint(200, { translateX: -300, translateY: -300 }, { width: 1000, height: 1000 });
 * // Returns: { x: 0.5, y: 0.5 }
 */
export const getActivePoint = (
  zoomWindowSize: number,
  transform: { translateX: number; translateY: number },
  originalDimensions: { width: number; height: number }
): Point => {
  const startX = zoomWindowSize / 2;
  const startY = zoomWindowSize / 2;

  // Calculate the point coordinates in relative values (0-1)
  const x = (startX - transform.translateX) / originalDimensions.width;
  const y = (startY - transform.translateY) / originalDimensions.height;

  // Ensure the point coordinates are within bounds
  return {
    x: Math.max(0, Math.min(1, x)),
    y: Math.max(0, Math.min(1, y)),
  };
};
