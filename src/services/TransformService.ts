import { ImageSource, Point } from '@types';
import {
  getAbsolutePoints,
  getLargestRectangle,
  orderPointsByCorner,
  getPoints,
} from '@utils/overlayUtils';
import { transformImage } from '@utils/transformUtils';

/**
 * TransformService handles the image transformation process following the Single Responsibility Principle.
 * This service is responsible for:
 * 1. Validating input image data
 * 2. Converting relative overlay points to absolute coordinates
 * 3. Ordering points for proper perspective transformation
 * 4. Finding the largest rectangle within the selected points
 * 5. Coordinating the actual image transformation process
 */
export class TransformService {
  /**
   * Transforms an image based on selected overlay points.
   *
   * @param image - The source image with its URI and dimensions
   * @param selectedOverlay - Array of 4 points representing the selected corners (in relative coordinates)
   * @param cropToRectangle - Whether to crop the result to the transformed rectangle
   * @returns Promise resolving to the transformed image as a base64 string
   * @throws Error if image source or dimensions are missing/invalid
   */
  static async transformImage(
    image: ImageSource,
    selectedOverlay: Point[],
    cropToRectangle: boolean = false
  ) {
    const { uri, dimensions } = image;

    // Validate input image data
    if (!uri || !dimensions) {
      throw new Error('Image source or dimensions are missing');
    }

    const { width, height } = dimensions;

    if (width === 0 || height === 0) {
      throw new Error('Image dimensions are invalid');
    }

    // Convert relative points to absolute coordinates
    const absolutePoints = getAbsolutePoints(
      selectedOverlay,
      image.dimensions.width,
      image.dimensions.height
    );

    // Order points to ensure proper perspective transformation
    const srcPoints = orderPointsByCorner(absolutePoints);

    // Find the largest rectangle within the selected points
    const largestRect = getLargestRectangle(srcPoints);
    const dstPoints = getPoints(largestRect);

    // Perform the actual image transformation
    return transformImage(image, srcPoints, dstPoints, cropToRectangle);
  }
}
