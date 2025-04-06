import React from 'react';
import { View, StyleSheet, ImageBackground, Image } from 'react-native';
import { useOverlayStore, useSourceImageStore } from '@stores';
import { getZoomTransform } from '@utils/zoomUtils';
import { Logo } from '@molecules';
import { Crosshair } from '@atoms';

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
  const activePoint = useOverlayStore(
    (state) => activePointIndex && state.points[activePointIndex]
  );
  const { uri, originalDimensions } = useSourceImageStore();

  const zoomWindowSize = size;

  if (!activePoint || !uri) {
    return <Logo size={zoomWindowSize} />;
  }

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

        <Crosshair testID="zoom-preview-crosshair" />
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
});
