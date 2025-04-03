import React from 'react';
import { View, StyleSheet, ImageBackground, Image } from 'react-native';
import { useOverlayStore, useSourceImageStore } from '@stores';
import { useTheme } from '@react-navigation/native';
import { getZoomTransform } from '@utils/zoomUtils';

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
  const { points, activePointIndex } = useOverlayStore();
  const { uri, originalDimensions } = useSourceImageStore();
  const { colors } = useTheme();

  const zoomWindowSize = size;

  // Early return for missing data - pure logic, no state updates
  if (activePointIndex === null || points.length < 4 || !uri) {
    return null;
  }
  // Get active point directly from store
  const activePoint = points[activePointIndex];

  const transform = getZoomTransform(
    zoomWindowSize,
    activePoint,
    originalDimensions
  );

  return (
    <View
      style={styles.container}
      testID="zoom-preview-container"
      pointerEvents="none"
    >
      <View
        style={[
          styles.previewContainer,
          { width: zoomWindowSize, height: zoomWindowSize },
        ]}
        testID="zoom-preview-background"
      >
        <ImageBackground
          source={checkerboardPattern}
          resizeMode="repeat"
          style={styles.checkerboard}
        >
          <Image
            source={{ uri }}
            style={[
              styles.previewImage,
              {
                width: originalDimensions.width,
                height: originalDimensions.height,
                transform,
              },
            ]}
            resizeMode="contain"
            testID="zoom-preview-image"
          />
        </ImageBackground>

        <View style={styles.crosshair} testID="zoom-preview-crosshair">
          <View
            style={[
              styles.crosshairLine,
              { backgroundColor: `${colors.primary}` },
            ]}
          />
          <View
            style={[
              styles.crosshairLine,
              {
                backgroundColor: `${colors.primary}`,
                transform: [{ rotate: '90deg' }],
              },
            ]}
          />
        </View>
      </View>
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
    position: 'relative',
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
  crosshair: {
    position: 'absolute',
    width: 48,
    height: 48,
    top: '50%',
    left: '50%',
    marginLeft: -24,
    marginTop: -24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crosshairLine: {
    position: 'absolute',
    width: 2,
    height: 48,
    backgroundColor: 'transparent',
  },
});
