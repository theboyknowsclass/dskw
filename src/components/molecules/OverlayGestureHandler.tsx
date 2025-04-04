import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useOverlayStore } from '@stores';
import { throttle } from '@utils/throttleUtil';
import { Corner, Point } from '@types';

type OverlayGestureHandlerProps = {
  imageWidth: number;
  imageHeight: number;
  containerSize: { pageX: number; pageY: number };
};

export const OverlayGestureHandler: React.FC<OverlayGestureHandlerProps> = ({
  imageWidth,
  imageHeight,
  containerSize,
}) => {
  // Use selectors from the store for better performance
  const setActivePointIndex = useOverlayStore(
    (state) => state.setActivePointIndex
  );
  const updatePoint = useOverlayStore((state) => state.updatePoint);
  const points = useOverlayStore((state) => state.points);

  // Convert relative coordinates to screen coordinates
  const screenPoints = useMemo(() => {
    return points.map(({ x, y }) => ({
      x: x * imageWidth,
      y: y * imageHeight,
    }));
  }, [points, imageWidth, imageHeight]);

  // Create a throttled update function
  const throttledUpdate = throttle(
    (index: Corner, absoluteX: number, absoluteY: number) => {
      // Get the container's position
      const { pageX, pageY } = containerSize;
      // Calculate coordinates relative to the container
      const relativeX = (absoluteX - pageX) / imageWidth;
      const relativeY = (absoluteY - pageY) / imageHeight;

      const clampedPoint: Point = {
        x: Math.max(0, Math.min(1, relativeX)),
        y: Math.max(0, Math.min(1, relativeY)),
      };

      updatePoint(index, clampedPoint);
    },
    18 // ~60fps
  );

  // Create a pan gesture for a point
  const createPanGesture = useCallback(
    (index: Corner) => {
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

  return (
    <>
      {screenPoints.map((point, index) => (
        <GestureDetector
          key={`gesture-${index}`}
          gesture={createPanGesture(index as Corner)}
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
      ))}
    </>
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
