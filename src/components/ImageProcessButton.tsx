import React from 'react';
import { Button } from './Button';
import { useImageStore } from '../stores/useImageStore';
import { useOverlayStore } from '../stores/useOverlayStore';
import { transformImage } from '../utils/transformUtils';
import { router } from 'expo-router';

type ImageProcessButtonProps = {
  style?: any;
};

export const ImageProcessButton: React.FC<ImageProcessButtonProps> = ({
  style,
}) => {
  const { uri, setDestinationUri, setLoading, setError } = useImageStore();
  const { points } = useOverlayStore();
  const hasSelectedImage = uri !== null;

  const handleProcess = async () => {
    if (!uri) return;

    try {
      setLoading(true);
      setError(null);

      const transformedUri = await transformImage(uri, points);
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

  return (
    <Button
      variant={hasSelectedImage ? 'primary' : 'outline'}
      title="Next"
      onPress={handleProcess}
      disabled={!hasSelectedImage}
      size="large"
      buttonStyle={style}
    />
  );
};
