import React, { useMemo, useCallback, useRef, useState } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Svg, { Polygon, Circle } from 'react-native-svg';
import { useOverlayStore } from '@stores';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useTheme } from '@react-navigation/native';
import { throttle } from '@utils/throttleUtil';

type OverlayProps = {
  imageWidth: number;
  imageHeight: number;
  style?: StyleProp<ViewStyle>;
};

export const Overlay: React.FC<OverlayProps> = ({
  imageWidth,
  imageHeight,
  style,
}) => {
  const { points, activePointIndex, setActivePointIndex, updatePoint } =
    useOverlayStore();
  const { colors } = useTheme();
  const [containerSize, setContainerSize] = useState({ pageX: 0, pageY: 0 });
  const containerRef = useRef<View>(null); // Ref to track the container's position

  // Convert relative coordinates to screen coordinates
  const screenPoints = useMemo(() => {
    return points.map((point) => ({
      x: point.x * imageWidth,
      y: point.y * imageHeight,
    }));
  }, [points, imageWidth, imageHeight]);

  // Create a throttled update function
  const throttledUpdate = throttle(
    (index: number, absoluteX: number, absoluteY: number) => {
      // Get the container's position
      const { pageX, pageY } = containerSize;
      // Calculate coordinates relative to the container
      const relativeX = (absoluteX - pageX) / imageWidth;
      const relativeY = (absoluteY - pageY) / imageHeight;

      const clampedPoint = {
        x: Math.max(0, Math.min(1, relativeX)),
        y: Math.max(0, Math.min(1, relativeY)),
      };
      updatePoint(index, clampedPoint);
    },
    18 // ~60fps
  );
  // Create a pan gesture for a point
  const createPanGesture = useCallback(
    (index: number) => {
      return Gesture.Pan()
        .onStart(() => {
          setActivePointIndex(index);
        })
        .onUpdate((e) => {
          // Use the throttled update
          throttledUpdate(index, e.absoluteX, e.absoluteY);
        })
        .onEnd(() => {
          setActivePointIndex(null);
        })
        .runOnJS(true);
    },
    [setActivePointIndex, throttledUpdate]
  );

  const polygonPoints = useMemo(() => {
    return screenPoints.map((point) => `${point.x},${point.y}`).join(' ');
  }, [screenPoints]);

  const isDragging = activePointIndex != null;

  const onContainerLayout = () => {
    containerRef.current?.measure((_, __, ___, ____, pageX, pageY) => {
      setContainerSize({ pageX, pageY });
    });
  };

  return (
    <View
      ref={containerRef}
      style={[
        StyleSheet.absoluteFill,
        { width: imageWidth, height: imageHeight },
        style ?? null,
      ]}
      onLayout={onContainerLayout}
    >
      {/* SVG Layer (visual only) */}
      <Svg width={imageWidth} height={imageHeight}>
        <Polygon
          points={polygonPoints}
          fill="none"
          stroke={isDragging ? colors.primary : `${colors.primary}`}
          strokeWidth={isDragging ? '3' : '2'}
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
