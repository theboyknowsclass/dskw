import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Animated,
  Easing,
} from 'react-native';
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
  const logoOpacity = useRef(new Animated.Value(1)).current;
  const previewOpacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  // Handle opacity transitions
  useEffect(() => {
    const hasActivePoint = activePointIndex != null;
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: hasActivePoint ? 0 : 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(previewOpacity, {
        toValue: hasActivePoint ? 1 : 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [activePointIndex, logoOpacity, previewOpacity]);

  // Handle translations
  useEffect(() => {
    const transform = getZoomTransform(
      zoomWindowSize,
      activePoint,
      originalDimensions
    );

    console.log('transform', transform);

    const targetX = transform[0]?.translateX ?? 0;
    const targetY = transform[1]?.translateY ?? 0;

    translateX.setValue(targetX);
    translateY.setValue(targetY);
  }, [translateX, translateY, activePoint, originalDimensions, zoomWindowSize]);

  if (!uri) return <Redirect href="/" />;

  return (
    <View
      style={styles.container}
      testID="zoom-preview-container"
      pointerEvents="none"
    >
      <Animated.View style={[{ opacity: logoOpacity }]}>
        <Logo size={zoomWindowSize} />
      </Animated.View>
      <Animated.View
        style={[
          styles.previewContainer,
          {
            width: zoomWindowSize,
            height: zoomWindowSize,
            opacity: previewOpacity,
          },
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
                transform: [{ translateX }, { translateY }],
              },
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
