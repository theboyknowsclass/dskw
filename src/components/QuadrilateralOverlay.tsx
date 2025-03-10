import React, { useMemo, useCallback, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Polygon, Circle } from 'react-native-svg';
import { useOverlayStore } from '../stores/useOverlayStore';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useTheme } from '../contexts/ThemeContext';

type QuadrilateralOverlayProps = {
  imageWidth: number;
  imageHeight: number;
};

export const QuadrilateralOverlay: React.FC<QuadrilateralOverlayProps> = ({
  imageWidth,
  imageHeight,
}) => {
  const { points, activePointIndex, setActivePointIndex, updatePoint } =
    useOverlayStore();
  const { colors } = useTheme();

  // Ref to track the container's position
  const containerRef = useRef<View>(null);

  // Convert relative coordinates to screen coordinates
  const screenPoints = useMemo(() => {
    return points.map((point) => ({
      x: point.x * imageWidth,
      y: point.y * imageHeight,
    }));
  }, [points, imageWidth, imageHeight]);

  // Create a pan gesture for a point
  const createPanGesture = useCallback(
    (index: number) => {
      return Gesture.Pan()
        .onStart(() => {
          setActivePointIndex(index);
        })
        .onUpdate((e) => {
          // Get the container's position
          containerRef.current?.measure((x, y, width, height, pageX, pageY) => {
            // Calculate coordinates relative to the container
            const relativeX = (e.absoluteX - pageX) / imageWidth;
            const relativeY = (e.absoluteY - pageY) / imageHeight;

            // Clamp values between 0 and 1
            const clampedPoint = {
              x: Math.max(0, Math.min(1, relativeX)),
              y: Math.max(0, Math.min(1, relativeY)),
            };

            updatePoint(index, clampedPoint);
          });
        })
        .onEnd(() => {
          setActivePointIndex(null);
        });
    },
    [imageWidth, imageHeight, setActivePointIndex, updatePoint]
  );

  const polygonPoints = useMemo(() => {
    return screenPoints.map((point) => `${point.x},${point.y}`).join(' ');
  }, [screenPoints]);

  const isDragging = activePointIndex != null;

  return (
    <View ref={containerRef} style={StyleSheet.absoluteFill}>
      {/* SVG Layer (visual only) */}
      <Svg width={imageWidth} height={imageHeight}>
        <Polygon
          points={polygonPoints}
          fill="none"
          stroke={isDragging ? colors.accent : `${colors.accent}cc`}
          strokeWidth={isDragging ? '3' : '2'}
        />

        {screenPoints.map((point, index) => (
          <Circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="15"
            fill={
              activePointIndex === index ? colors.accent : `${colors.accent}80`
            }
          />
        ))}
      </Svg>

      {/* Separate interaction layer */}
      {screenPoints.map((point, index) => {
        // Memoize the gesture for each point

        return (
          <GestureDetector
            key={`gesture-${index}`}
            gesture={createPanGesture(index)}
          >
            <View
              style={[
                styles.touchPoint,
                {
                  left: point.x - 20,
                  top: point.y - 20,
                },
              ]}
            />
          </GestureDetector>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  touchPoint: {
    position: 'absolute',
    width: 40,
    height: 40,
    backgroundColor: 'transparent',
  },
});
