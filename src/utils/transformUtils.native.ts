import { Point } from '../stores/useOverlayStore';

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
  console.log('transformImage Native', uri, selectedOverlay, cropToRectangle);
  return '';
};
