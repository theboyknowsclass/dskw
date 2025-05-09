import React, { useCallback, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import { useOverlayStore } from '@stores';
import { Corner, Point, Dimensions } from '@types';
import { useTheme } from '@react-navigation/native';

type TouchPointProps = {
  index: Corner;
  parentOffset: { xOffset: number; yOffset: number }; // used to calculate the relative position of the point
  parentDimensions: Dimensions; // used to calculate the relative position of the point
};

export const TouchPoint: React.FC<TouchPointProps> = ({
  index,
  parentOffset: offset,
  parentDimensions: dimensions,
}) => {
  const updatePoint = useOverlayStore((state) => state.updatePoint);
  const setActivePointIndex = useOverlayStore(
    (state) => state.setActivePointIndex
  );
  const theme = useTheme();
  const point = useOverlayStore((state) => state.points[index]);
  const { xOffset, yOffset } = offset;

  const { width: imageWidth, height: imageHeight } = dimensions;

  // Create shared values for position in relative coordinates (0-1)
  const relativeX = useSharedValue(point.x);
  const relativeY = useSharedValue(point.y);
  const scale = useSharedValue(1); // allows for animating the point to be larger when active
  const isActive = useSharedValue(false);
  const needsStoreUpdate = useSharedValue(false);

  // Use derived values to convert to screen coordinates
  const screenX = useDerivedValue(() => relativeX.value * imageWidth);
  const screenY = useDerivedValue(() => relativeY.value * imageHeight);

  // Update shared values when points change from outside
  useEffect(() => {
    relativeX.value = point.x;
    relativeY.value = point.y;
  }, [point.x, point.y, relativeX, relativeY]);

  const convertToRelative = useCallback(
    (absoluteX: number, absoluteY: number): Point => {
      'worklet';
      return {
        x: Math.max(0, Math.min(1, (absoluteX - xOffset) / imageWidth)),
        y: Math.max(0, Math.min(1, (absoluteY - yOffset) / imageHeight)),
      };
    },
    [xOffset, yOffset, imageWidth, imageHeight]
  );

  const updateStore = useCallback(
    (x: number, y: number) => {
      setActivePointIndex(isActive.value ? index : null);
      updatePoint(index, { x, y });
    },
    [index, updatePoint, setActivePointIndex, isActive]
  );

  // Use effect to batch store updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (needsStoreUpdate.value) {
        updateStore(relativeX.value, relativeY.value);
        needsStoreUpdate.value = false;
      }
    }, 8); // ~60fps

    return () => clearInterval(interval);
  }, [updateStore, relativeX, relativeY, needsStoreUpdate]);

  // Create a pan gesture for a point
  const panGesture = Gesture.Pan()
    .maxPointers(1)
    .runOnJS(false)
    .onStart(() => {
      'worklet';
      isActive.value = true;
      scale.value = withTiming(1.2, { duration: 100 });
    })
    .onUpdate((e) => {
      'worklet';
      // Calculate and update relative position directly on UI thread
      const newPoint = convertToRelative(e.absoluteX, e.absoluteY);
      relativeX.value = newPoint.x;
      relativeY.value = newPoint.y;

      // Mark for store update instead of calling immediately
      needsStoreUpdate.value = true;
    })
    .onEnd(() => {
      'worklet';
      isActive.value = false;
      scale.value = withTiming(1, { duration: 100 });
      needsStoreUpdate.value = true;
    });

  // Animated styles for the point
  const animatedStyles = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ scale: scale.value }],
      left: screenX.value - 24,
      top: screenY.value - 24,
      borderColor: isActive.value
        ? `${theme.colors.primary}90`
        : 'rgba(255, 255, 255, 0.5)',
    };
  }, [screenX, screenY, isActive, theme.colors.primary]);

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.touchPoint, animatedStyles]} />
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  touchPoint: {
    position: 'absolute',
    width: 48,
    height: 48,
    backgroundColor: 'transparent',
    borderRadius: 24,
    borderWidth: 8,
  },
});
