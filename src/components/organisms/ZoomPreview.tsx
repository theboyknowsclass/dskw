import React, { useEffect } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  Easing,
} from 'react-native-reanimated';
import { useOverlayStore, useSourceImageStore } from '@stores';
import { getZoomTransform } from '@utils/zoomUtils';
import { Logo } from '@molecules';
import { Crosshair } from '@atoms';
import { Redirect } from 'expo-router';

// Import the checkerboard pattern
// eslint-disable-next-line @typescript-eslint/no-require-imports
const checkerboardPattern = require('@assets/checkerboard.png');

type ZoomPreviewProps = {
  size: number;
};
/**
 * ZoomPreview Component
 *
 * Shows a magnified view of the image around the currently active corner point.
 * Completely redesigned with minimal state updates for maximum stability.
 */
export const ZoomPreview: React.FC<ZoomPreviewProps> = ({ size }) => {
  // Direct store access - no intermediate state
  const activePointIndex = useOverlayStore((state) => state.activePointIndex);
  const activePoint = useOverlayStore((state) =>
    state.activePointIndex != null ? state.points[state.activePointIndex] : null
  );
  const { uri, originalDimensions } = useSourceImageStore();

  const zoomWindowSize = size;
  const logoOpacity = useSharedValue(1);
  const previewOpacity = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Handle opacity transitions
  useEffect(() => {
    const hasActivePoint = activePointIndex != null;
    logoOpacity.value = withTiming(hasActivePoint ? 0 : 1, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });
    previewOpacity.value = withTiming(hasActivePoint ? 1 : 0, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });
  }, [activePointIndex, logoOpacity, previewOpacity]);

  // Handle translations
  useEffect(() => {
    const transform = getZoomTransform(
      zoomWindowSize,
      activePoint,
      originalDimensions
    );

    const targetX = transform[0]?.translateX ?? 0;
    const targetY = transform[1]?.translateY ?? 0;

    translateX.value = targetX;
    translateY.value = targetY;
  }, [activePoint, originalDimensions, zoomWindowSize, translateX, translateY]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
  }));

  const previewStyle = useAnimatedStyle(() => ({
    opacity: previewOpacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  if (!uri) return <Redirect href="/" />;

  return (
    <View
      style={styles.container}
      testID="zoom-preview-container"
      pointerEvents="none"
    >
      <Animated.View style={logoStyle}>
        <Logo size={zoomWindowSize} />
      </Animated.View>
      <Animated.View
        style={[
          styles.previewContainer,
          {
            width: zoomWindowSize,
            height: zoomWindowSize,
          },
          { opacity: previewOpacity },
        ]}
        testID="zoom-preview-background"
      >
        <ImageBackground
          source={checkerboardPattern}
          resizeMode="repeat"
          style={styles.checkerboard}
        >
          <Animated.Image
            source={{ uri }}
            style={[
              styles.previewImage,
              {
                width: originalDimensions.width,
                height: originalDimensions.height,
              },
              previewStyle,
            ]}
            resizeMode="contain"
            testID="zoom-preview-image"
          />
        </ImageBackground>

        <Crosshair testID="zoom-preview-crosshair" />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  previewContainer: {
    overflow: 'hidden',
    position: 'absolute',
    borderRadius: '50%',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  checkerboard: {
    width: '100%',
    height: '100%',
  },
  previewImage: {
    position: 'absolute',
  },
});
