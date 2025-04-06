import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useOverlayStore, useSourceImageStore } from '@stores';
import { throttle } from '@utils/throttleUtil';
import { Corner, Point } from '@types';

type OverlayGestureHandlerProps = {
  containerSize: { pageX: number; pageY: number };
};

export const OverlayGestureHandler: React.FC<OverlayGestureHandlerProps> = ({
  containerSize,
}) => {
  // Use selectors from the store for better performance
  const setActivePointIndex = useOverlayStore(
    (state) => state.setActivePointIndex
  );
  const updatePoint = useOverlayStore((state) => state.updatePoint);
  const points = useOverlayStore((state) => state.points);
  const { width: imageWidth, height: imageHeight } = useSourceImageStore(
    (state) => state.scaledDimensions
  );

  // Convert relative coordinates to screen coordinates
  const screenPoints = useMemo(() => {
    return points.map(({ x, y }) => ({
      x: x * imageWidth,
      y: y * imageHeight,
    }));
  }, [points, imageWidth, imageHeight]);

  // Create a throttled update function
  const throttledUpdate = useCallback(
    throttle(
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
    ),
    [containerSize, imageWidth, imageHeight, updatePoint]
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

  if (imageWidth === 0 || imageHeight === 0) {
    return null;
  }

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
                left: point.x - 25,
                top: point.y - 25,
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
    width: 50,
    height: 50,
    backgroundColor: 'transparent',
    borderRadius: 25,
    borderWidth: 10,
    borderColor: `rgba(255, 255, 255, 0.5)`,
  },
});
