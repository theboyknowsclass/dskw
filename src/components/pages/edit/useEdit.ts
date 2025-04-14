import { useScreenDimensions } from '@hooks';
import { useSourceImageStore } from '@stores';
import { Dimensions } from '@types';
import { useContentMeasurements } from 'contexts/ContentMeasurementsContext';
import { DeviceType } from 'expo-device';

/**
 * Interface defining the return type of the useEdit hook
 */
interface EditLayout {
  uri: string | null;
  isLandscape: boolean;
  zoomWindowSize: number;
  scaledWidth: number;
  scaledHeight: number;
}

/**
 * Constants for zoom window configuration
 */
const MAX_ZOOM_WINDOW_SIZE = 400; // Maximum size of the zoom window in pixels
const MAX_ZOOM_WINDOW_RATIO = 0.5; // Maximum ratio of content width/height that the zoom window can occupy
export const ZOOM_WINDOW_PADDING = 40; // Padding between the zoom window and the main content

/**
 * Custom hook for managing image editing layout and dimensions
 *
 * This hook calculates the optimal layout and dimensions for displaying an image
 * in an editing interface, taking into account:
 * - Screen orientation (landscape/portrait)
 * - Available content space
 * - Original image dimensions
 * - Zoom window requirements
 *
 * @returns {EditLayout} An object containing layout and dimension information
 */
export const useEdit = (): EditLayout => {
  // Get source image data and screen dimensions
  const { uri, originalDimensions } = useSourceImageStore();
  const { isLandscape, deviceType } = useScreenDimensions();
  const { dimensions: contentContainerSize } = useContentMeasurements();

  // Initialize dimension variables
  const { maxImageWidth, maxImageHeight, zoomWindowSize } = getComponentSizes(
    deviceType,
    isLandscape,
    contentContainerSize
  );

  // Calculate scaling factors to maintain aspect ratio
  const { width: imageWidth, height: imageHeight } = originalDimensions;
  const widthScale = maxImageWidth / imageWidth;
  const heightScale = maxImageHeight / imageHeight;

  // Use the smaller scale factor to ensure the image fits within bounds
  const scaleFactor = Math.min(widthScale, heightScale);

  // Calculate final scaled dimensions
  const scaledWidth = imageWidth * scaleFactor;
  const scaledHeight = imageHeight * scaleFactor;

  return {
    uri,
    isLandscape,
    zoomWindowSize,
    scaledWidth,
    scaledHeight,
  };
};

/**
 * Calculates the sizes of the zoom window and image based on the screen orientation
 * and content dimensions.
 *
 * @param isLandscape - Whether the screen is in landscape orientation
 * @param contentWidth - The width of the content container
 * @param contentHeight - The height of the content container
 * @returns {Object} An object containing:
 *   - zoomWindowSize: The size of the zoom window
 *   - maxImageWidth: The maximum allowed width for the image
 *   - maxImageHeight: The maximum allowed height for the image
 */
function getComponentSizes(
  deviceType: DeviceType | null,
  isLandscape: boolean,
  contentContainerSize: Dimensions
) {
  // Extract content dimensions
  const { width: contentWidth, height: contentHeight } = contentContainerSize;

  if (deviceType === DeviceType.PHONE) {
    return {
      zoomWindowSize: 0,
      maxImageWidth: contentWidth,
      maxImageHeight: contentHeight,
    };
  }

  // Calculate layout based on screen orientation
  if (isLandscape) {
    // In landscape mode:
    // - Zoom window takes up to 50% of content width or 400px, whichever is smaller
    // - Image takes remaining width minus padding
    // - Image can use full height

    const zoomWindowSize = Math.min(
      contentWidth * MAX_ZOOM_WINDOW_RATIO,
      MAX_ZOOM_WINDOW_SIZE
    );

    return {
      zoomWindowSize,
      maxImageWidth: contentWidth - zoomWindowSize - ZOOM_WINDOW_PADDING,
      maxImageHeight: contentHeight,
    };
  }

  // In portrait mode:
  // - Zoom window takes up to 50% of content height or 400px, whichever is smaller
  // - Image takes full width
  // - Image takes remaining height minus padding
  const zoomWindowSize = Math.min(
    contentHeight * MAX_ZOOM_WINDOW_RATIO,
    MAX_ZOOM_WINDOW_SIZE
  );

  return {
    zoomWindowSize,
    maxImageWidth: contentWidth,
    maxImageHeight: contentHeight - zoomWindowSize - ZOOM_WINDOW_PADDING,
  };
}
