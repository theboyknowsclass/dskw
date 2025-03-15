import React from 'react';
import { Button } from './Button';
import { useImageStore } from '../stores/useImageStore';
import { useOverlayStore } from '../stores/useOverlayStore';
import { transformImage } from '../utils/transformUtils';
import { router } from 'expo-router';
import { runOnJS } from 'react-native-reanimated';

type ImageProcessButtonProps = {
  style?: any;
};

export const ImageProcessButton: React.FC<ImageProcessButtonProps> = ({
  style,
}) => {
  const {
    uri,
    base64,
    setDestinationUri,
    setLoading,
    setError,
    originalDimensions,
  } = useImageStore();
  const { points } = useOverlayStore();
  const hasSelectedImage = uri !== null;

  const handleProcess = async () => {
    if (!uri) return;

    try {
      setLoading(true);
      setError(null);

      const transformedUri = await transformImage(
        base64 ?? uri,
        originalDimensions.height,
        originalDimensions.width,
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

  return (
    <Button
      variant={hasSelectedImage ? 'primary' : 'outline'}
      title="Next"
      onPress={runOnJS(handleProcess)}
      disabled={!hasSelectedImage}
      size="large"
      buttonStyle={style}
    />
  );
};
