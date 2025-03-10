import React, { useMemo } from 'react';
import { View, StyleSheet, Text, Image, ImageBackground } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useOverlayStore } from '../stores/useOverlayStore';
import { useImageStore } from '../stores/useImageStore';

type ZoomPreviewProps = {
  width: number;
  height: number;
};

export const ZoomPreview: React.FC<ZoomPreviewProps> = ({ width, height }) => {
  const { points, activePointIndex } = useOverlayStore();
  const { uri, originalDimensions } = useImageStore();
  const { colors } = useTheme();

  const previewSize = Math.max(width, height) * 0.4;

  // Get the active point coordinates
  const activePoint =
    activePointIndex != null ? points[activePointIndex] : null;

  // Calculate the transform to center and zoom on the active point
  const transform = useMemo(() => {
    if (!activePoint) {
      return [];
    }

    const startX = previewSize / 2;
    const startY = previewSize / 2;

    return [
      { translateX: startX - activePoint.x * originalDimensions.width },
      { translateY: startY - activePoint.y * originalDimensions.height },
    ];
  }, [activePoint, originalDimensions, previewSize]);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.previewContainer,
          { width: previewSize, height: previewSize },
        ]}
      >
        <Image
          source={{ uri: uri! }}
          style={[
            styles.previewImage,
            {
              width: originalDimensions.width,
              height: originalDimensions.height,
              position: 'absolute',
              transform,
            },
          ]}
        />
        {/* Crosshair indicator */}
        <View style={[styles.crosshair]}>
          <View
            style={[
              styles.crosshairLine,
              { backgroundColor: `${colors.accent}bf` },
            ]}
          />
          <View
            style={[
              styles.crosshairLine,
              {
                backgroundColor: `${colors.accent}bf`,
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
  },
  previewContainer: {
    overflow: 'hidden',
    position: 'relative',
    borderRadius: '50%',
    // backgroundImage:
    //   'linear-gradient(45deg, lightgrey 25%, transparent 25%), linear-gradient(135deg, lightgrey 25%, transparent 25%), linear-gradient(45deg, transparent 75%, lightgrey 75%), linear-gradient(135deg, transparent 75%, lightgrey 75%)',
    // backgroundSize: '20px 20px',
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
