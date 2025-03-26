import React from 'react';
import { router } from 'expo-router';
import { IconButton } from './IconButton';

interface BackButtonProps {
  size?: 'small' | 'large';
  showBorder?: boolean;
}

/**
 * A button component that allows users to go back to the previous screen.
 * Uses the Button component with an icon variant for consistent styling.
 */
export const BackButton: React.FC<BackButtonProps> = ({ ...props }) => {
  const back = () => {
    router.back();
  };

  return (
    <IconButton
      {...props}
      icon="arrow-back"
      onPress={back}
      accessibilityLabel="Go Back"
      title=""
    />
  );
};
