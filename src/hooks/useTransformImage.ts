import {
  useSourceImageStore,
  useTransformedImageStore,
  useOverlayStore,
} from '@stores';
import {
  getAbsolutePoints,
  getLargestRectangle,
  getPoints,
  orderPointsByCorner,
} from '@utils/overlayUtils';
import { router } from 'expo-router';
import { TransformService } from '@services';
export const useTransformImage = () => {
  const { uri, originalDimensions: dimensions } = useSourceImageStore();
  const { setDestinationUri, setLoading, setError, isLoading, error } =
    useTransformedImageStore();
  const { points: selectedOverlay } = useOverlayStore();

  const handleProcess = async () => {
    if (!uri) return;

    try {
      setLoading(true);
      setError(null);

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
        dimensions.width,
        dimensions.height
      );

      // Order points to ensure proper perspective transformation
      const srcPoints = orderPointsByCorner(absolutePoints);

      // Find the largest rectangle within the selected points
      const largestRect = getLargestRectangle(srcPoints);
      const dstPoints = getPoints(largestRect);

      // Perform the actual image transformation
      const transformedUri = await TransformService.transformImage(
        { uri, dimensions },
        srcPoints,
        dstPoints,
        false
      );

      setDestinationUri(transformedUri);
      router.push('export');
    } catch (err) {
      setError(
        `Error processing image: ${err instanceof Error ? err.message : String(err)}`
      );
    } finally {
      setLoading(false);
    }
  };

  return { handleProcess, isLoading, error };
};
