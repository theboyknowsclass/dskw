import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

type CrosshairProps = {
  size?: number;
  color?: string;
  lineWidth?: number;
  testID?: string;
};

/**
 * Crosshair Component
 *
 * Displays a crosshair overlay that can be used for targeting or marking positions.
 * The crosshair is centered at its container's center point.
 * Uses theme's primary color by default or accepts custom color.
 */
export const Crosshair: React.FC<CrosshairProps> = ({
  size = 48,
  color,
  lineWidth = 2,
  testID = 'crosshair',
}) => {
  const { colors } = useTheme();
  const crosshairColor = color || colors.primary;

  // Calculate negative half of size for proper centering
  const offset = size / 2;

  return (
    <View
      style={[
        styles.crosshair,
        {
          width: size,
          height: size,
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
            backgroundColor: crosshairColor,
            width: lineWidth,
          },
        ]}
      />
      <View
        style={[
          styles.crosshairLine,
          {
            backgroundColor: crosshairColor,
            width: lineWidth,
            transform: [{ rotate: '90deg' }],
          },
        ]}
      />
    </View>
  );
};

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
