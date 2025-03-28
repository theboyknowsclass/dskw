import { TransformService } from '@services/TransformService';
import { useImageStore } from '@stores/useImageStore';
import { useOverlayStore } from '@stores/useOverlayStore';
import { router } from 'expo-router';
import { useState } from 'react';

export const useTransformImage = () => {
  const { uri, setDestinationUri, originalDimensions } = useImageStore();
  const { points } = useOverlayStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async () => {
    if (!uri) return;

    try {
      setLoading(true);
      setError(null);

      const image = {
        uri,
        dimensions: originalDimensions,
      };

      const transformedUri = await TransformService.transformImage(
        image,
        points
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

  return { handleProcess, loading, error };
};
