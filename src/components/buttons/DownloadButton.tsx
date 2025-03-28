import React from 'react';
import { IconButton } from '@components';

/**
 * A button component that allows users to download an image.
 * Uses the Button component with an icon variant for consistent styling.
 */
export const DownloadButton: React.FC = () => {
  const downloadImage = () => {
    console.log('downloadImage');
  };

  return (
    <IconButton
      icon="file-download"
      onPress={downloadImage}
      accessibilityLabel="Download image"
      title=""
    />
  );
};
