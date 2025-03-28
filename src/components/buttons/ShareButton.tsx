import React from 'react';
import { IconButton } from '@components';

/**
 * A button component that allows users to share the image.
 * Uses the IconButton component with an icon variant for consistent styling.
 */
export const ShareButton: React.FC = () => {
  const share = () => {};

  return (
    <IconButton
      icon="share"
      onPress={share}
      accessibilityLabel="Share"
      title=""
      loading={false}
    />
  );
};
