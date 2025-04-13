import { useTheme } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, ActivityIndicatorProps } from 'react-native';

interface LoadingSpinnerProps extends Omit<ActivityIndicatorProps, 'size'> {
  size?: number;
  animating?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  animating = true,
  ...props
}) => {
  const { colors } = useTheme();

  return (
    <ActivityIndicator
      size={size}
      animating={animating}
      hidesWhenStopped={false}
      color={`${colors.primary}90`}
      {...props}
    />
  );
};
