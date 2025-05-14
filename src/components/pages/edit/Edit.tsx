import { TransformImageButton, ZoomButton } from '@molecules';
import {
  View,
  Image,
  StyleSheet,
  PanResponder,
  Platform,
  ImageBackground,
  DimensionValue,
} from 'react-native';
import { PageTemplate } from '@templates';
import { Overlay } from '@organisms';
import { useScreenDimensions, useContentMeasurements } from '@hooks';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { useSourceImageStore } from '@stores';

interface Transform {
  translateX: number;
  translateY: number;
  scale: number;
}

// Import the checkerboard pattern
// eslint-disable-next-line @typescript-eslint/no-require-imports
const checkerboardPattern = require('@assets/checkerboard.png');

const BORDER_PERCENTAGE = 0.2;
const MAX_SCALE = 1;

const EditContent: React.FC = () => {
  const { uri, originalDimensions } = useSourceImageStore();
  const { dimensions: contentDimensions } = useContentMeasurements();

  const transform = useSharedValue<Transform>({
    translateX: 0,
    translateY: 0,
    scale: 1,
  });
  const savedTransform = useSharedValue<Transform>(transform.value);

  const imageContainerWidth = useSharedValue<DimensionValue>('100%');
  const imageContainerHeight = useSharedValue<DimensionValue>('100%');
  const xOffset = useSharedValue(0);
  const yOffset = useSharedValue(0);

  const imageWidth = originalDimensions.width;
  const imageHeight = originalDimensions.height;
  const checkerboardWidth = imageWidth * (1 + BORDER_PERCENTAGE * 2);
  const checkerboardHeight = imageHeight * (1 + BORDER_PERCENTAGE * 2);

  useEffect(() => {
    // Calculate scaled dimensions to fit the screen while maintaining aspect ratio
    const widthScale = contentDimensions.width / imageWidth;
    const heightScale = contentDimensions.height / imageHeight;
    const scaleFactor = Math.min(widthScale, heightScale);
    imageContainerWidth.value = imageWidth * scaleFactor;
    imageContainerHeight.value = imageHeight * scaleFactor;

    const borderWidth = imageWidth * BORDER_PERCENTAGE;
    const borderHeight = imageHeight * BORDER_PERCENTAGE;

    xOffset.value = borderWidth;
    yOffset.value = borderHeight;

    transform.value = {
      ...transform.value,
      translateX: -borderWidth,
      translateY: -borderHeight,
      scale: scaleFactor,
    };
  }, [
    contentDimensions,
    imageWidth,
    imageHeight,
    imageContainerWidth,
    imageContainerHeight,
    xOffset,
    yOffset,
    transform,
  ]);

  const panGesture = Gesture.Pan()
    .enabled(true)
    .minDistance(0)
    .onStart(() => {
      'worklet';
      savedTransform.value = transform.value;
    })
    .onUpdate((e) => {
      'worklet';
      const { translateX, translateY, scale } = savedTransform.value;
      const newX = translateX + e.translationX / scale;
      const newY = translateY + e.translationY / scale;

      transform.value = {
        scale,
        translateX: Math.min(0, Math.max(newX, -xOffset.value * 2)),
        translateY: Math.min(0, Math.max(newY, -yOffset.value * 2)),
      };
    })
    .onEnd(() => {
      'worklet';
    });

  const pinchGesture = Gesture.Pinch()
    .enabled(true)
    .onStart(() => {
      'worklet';
      savedTransform.value = transform.value;
    })
    .onUpdate((e) => {
      'worklet';
      const { scale, translateX, translateY } = savedTransform.value;
      const newScale = scale * e.scale;

      // Get the focal point scaled to the original image
      const focalX = e.focalX / scale;
      const focalY = e.focalY / scale;
    })
    .onEnd(() => {
      'worklet';
    });

  // Combine both gestures
  const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture);

  const generatedStyles = StyleSheet.create({
    checkerBoard: {
      width: checkerboardWidth,
      height: checkerboardHeight,
      transformOrigin: 'top left',
      borderWidth: 10,
      borderColor: 'blue',
    },
    image: {
      width: originalDimensions.width,
      height: originalDimensions.height,
    },
  });

  const imageContainerStyle = useAnimatedStyle(
    () => ({
      width: imageContainerWidth.value,
      height: imageContainerHeight.value,
    }),
    [contentDimensions]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: transform.value.scale },
      { translateX: transform.value.translateX },
      { translateY: transform.value.translateY },
    ],
  }));

  return (
    <View style={styles.container}>
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[styles.imageContainer, imageContainerStyle]}>
          <Animated.View style={[generatedStyles.checkerBoard, animatedStyle]}>
            <ImageBackground
              source={checkerboardPattern}
              resizeMode="repeat"
              style={styles.checkerboard}
            >
              <Image
                source={{ uri: uri ?? undefined }}
                style={[generatedStyles.image]}
              />
            </ImageBackground>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export const Edit: React.FC = () => {
  return (
    <PageTemplate>
      <PageTemplate.ActionItems>
        <TransformImageButton />
      </PageTemplate.ActionItems>
      <EditContent />
    </PageTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'blue',
    display: 'flex',
  },
  imageContainer: {
    transformOrigin: 'top left',
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderColor: 'red',
    overflow: 'hidden',
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  checkerboard: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
