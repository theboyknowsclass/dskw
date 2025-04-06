import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useOverlayStore, useSourceImageStore } from '@stores';
import { throttle } from '@utils/throttleUtil';
import { Corner } from '@types';

type TouchPointProps = {
  index: Corner;
  containerSize: { pageX: number; pageY: number };
};

export const TouchPoint: React.FC<TouchPointProps> = ({
  index,
  containerSize,
}) => {
  // Get data from stores
  const setActivePointIndex = useOverlayStore(
    (state) => state.setActivePointIndex
  );
  const updatePoint = useOverlayStore((state) => state.updatePoint);
  const point = useOverlayStore((state) => state.points[index]);

  const { width: imageWidth, height: imageHeight } = useSourceImageStore(
    (state) => state.scaledDimensions
  );

  // Convert relative point to screen coordinates
  const screenPoint = {
    x: point.x * imageWidth,
    y: point.y * imageHeight,
  };

  // Create a throttled update function
  const throttledUpdate = useCallback(
    throttle(
      (cornerIndex: Corner, absoluteX: number, absoluteY: number) => {
        // Get the container's position
        const { pageX, pageY } = containerSize;
        // Calculate coordinates relative to the container
        const relativeX = (absoluteX - pageX) / imageWidth;
        const relativeY = (absoluteY - pageY) / imageHeight;

        const clampedPoint = {
          x: Math.max(0, Math.min(1, relativeX)),
          y: Math.max(0, Math.min(1, relativeY)),
        };

        updatePoint(cornerIndex, clampedPoint);
      },
      18 // ~60fps
    ),
    [containerSize, imageWidth, imageHeight, updatePoint]
  );

  // Create a pan gesture for a point
  const panGesture = Gesture.Pan()
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

  return (
    <GestureDetector gesture={panGesture}>
      <View
        style={[
          styles.touchPoint,
          {
            left: screenPoint.x - 25,
            top: screenPoint.y - 25,
          },
        ]}
      />
    </GestureDetector>
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
