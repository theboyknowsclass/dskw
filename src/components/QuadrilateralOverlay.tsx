import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Polygon, Circle } from 'react-native-svg';
import { useOverlayStore } from '../stores/useOverlayStore';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useTheme } from '@react-navigation/native';

type QuadrilateralOverlayProps = {
  imageWidth: number;
  imageHeight: number;
};

/**
 * QuadrilateralOverlay Component
 *
 * Provides interactive corner points that users can drag to define a quadrilateral.
 * Completely redesigned with minimal state updates for maximum stability.
 */
export const QuadrilateralOverlay: React.FC<QuadrilateralOverlayProps> = ({
  imageWidth,
  imageHeight,
}) => {
  // Direct store access with no intermediate state
  const { points, activePointIndex, setActivePointIndex, batchUpdatePoint } =
    useOverlayStore();
  const { colors } = useTheme();

  // Simple references for tracking container position and gesture state
  const containerRef = useRef<View>(null);

  // Convert relative coordinates to screen coordinates - pure calculation
  const screenPoints = points.map((point) => ({
    x: point.x * imageWidth,
    y: point.y * imageHeight,
  }));

  // Simplified point update with direct container measurement
  const handlePointUpdate = (
    index: number,
    absoluteX: number,
    absoluteY: number
  ) => {
    if (index >= points.length) return;

    if (containerRef.current) {
      containerRef.current.measure((_, __, ___, ____, pageX, pageY) => {
        // Calculate relative coordinates with bounds checking
        const relativeX = Math.max(
          0,
          Math.min(1, (absoluteX - pageX) / imageWidth)
        );
        const relativeY = Math.max(
          0,
          Math.min(1, (absoluteY - pageY) / imageHeight)
        );

        // Use the optimized batch update function instead
        batchUpdatePoint(index, { x: relativeX, y: relativeY });
      });
    }
  };

  // Create a pan gesture for each corner point
  const createPanGesture = (index: number) => {
    return Gesture.Pan()
      .onStart(() => {
        setActivePointIndex(index);
      })
      .onUpdate((e) => {
        handlePointUpdate(index, e.absoluteX, e.absoluteY);
      })
      .onEnd(() => {
        setActivePointIndex(null);
      })
      .minDistance(5)
      .runOnJS(true);
  };

  // Create polygon points string for SVG
  const polygonPoints = screenPoints
    .map((point) => `${point.x},${point.y}`)
    .join(' ');

  // Pure render with minimal calculation
  return (
    <View
      ref={containerRef}
      style={StyleSheet.absoluteFill}
      testID="quadrilateral-overlay"
      onLayout={() => {
        // Initial measurement after layout
        if (containerRef.current) {
          containerRef.current.measure(() => {});
        }
      }}
    >
      {/* SVG Layer (visual only) */}
      <Svg width={imageWidth} height={imageHeight}>
        <Polygon
          points={polygonPoints}
          fill="none"
          stroke={
            activePointIndex !== null ? colors.primary : `${colors.primary}`
          }
          strokeWidth={activePointIndex !== null ? '3' : '2'}
        />

        {screenPoints.map((point, index) => (
          <Circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="15"
            fill={
              activePointIndex === index ? colors.primary : `${colors.primary}`
            }
          />
        ))}
      </Svg>

      {/* Touch targets for gestures */}
      {screenPoints.map((point, index) => (
        <GestureDetector
          key={`gesture-${index}`}
          gesture={createPanGesture(index)}
        >
          <View
            style={[
              styles.touchPoint,
              {
                left: point.x - 25,
                top: point.y - 25,
              },
            ]}
            testID={`corner-handle-${index}`}
          />
        </GestureDetector>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  touchPoint: {
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: 'transparent',
    // Add a small border to make touch targets more visible in development
    ...(process.env.NODE_ENV === 'development'
      ? {
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.2)',
          borderRadius: 25,
        }
      : {}),
  },
});
