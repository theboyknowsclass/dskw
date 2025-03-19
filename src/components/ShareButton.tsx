import React from 'react';
import { IconButton } from './IconButton';

/**
 * A button component that allows users to go back to the previous screen.
 * Uses the Button component with an icon variant for consistent styling.
 */
export const ShareButton: React.FC = () => {
  const share = () => {};

  return (
    <IconButton
      icon="share"
      onPress={share}
      accessibilityLabel="Share"
      title=""
    />
  );
};
