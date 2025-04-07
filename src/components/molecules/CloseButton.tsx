import React from 'react';
import { router } from 'expo-router';
import { IconButton } from '@atoms';

interface CloseButtonProps {
  size?: 'small' | 'large';
  showBorder?: boolean;
}

/**
 * A button component that allows users to go back to the previous screen.
 * Uses the Button component with an icon variant for consistent styling.
 */
export const CloseButton: React.FC<CloseButtonProps> = ({ ...props }) => {
  const close = () => {
    router.dismiss();
  };

  const showBackButton = router.canGoBack();

  return showBackButton ? (
    <IconButton
      {...props}
      icon="close"
      onPress={close}
      accessibilityLabel="Close"
      title=""
    />
  ) : null;
};
