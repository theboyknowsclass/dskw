import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

type CrosshairProps = {
  testID?: string;
};

/**
 * Crosshair Component
 *
 * Displays a crosshair overlay that can be used for targeting or marking positions.
 * The crosshair is centered at its container's center point and uses the theme's
 * primary color by default.
 *
 * Component is memoized to prevent unnecessary re-renders.
 */
const CrosshairComponent: React.FC<CrosshairProps> = ({
  testID = 'crosshair',
}) => {
  const { colors } = useTheme();
  const SIZE = 50;
  const LINE_WIDTH = 2;

  // Calculate negative half of size for proper centering
  const offset = SIZE / 2;

  return (
    <View
      style={[
        styles.crosshair,
        {
          width: SIZE,
          height: SIZE,
          marginLeft: -offset,
          marginTop: -offset,
        },
      ]}
      testID={testID}
    >
      <View
        style={[
          styles.crosshairLine,
          {
            backgroundColor: colors.primary,
            width: LINE_WIDTH,
          },
        ]}
      />
      <View
        style={[
          styles.crosshairLine,
          {
            backgroundColor: colors.primary,
            width: LINE_WIDTH,
            transform: [{ rotate: '90deg' }],
          },
        ]}
      />
    </View>
  );
};

// Export a memoized version of the component
export const Crosshair = memo(CrosshairComponent);

const styles = StyleSheet.create({
  crosshair: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: '50%',
    left: '50%',
  },
  crosshairLine: {
    position: 'absolute',
    height: '100%',
    backgroundColor: 'transparent',
  },
});
