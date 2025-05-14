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
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { useSourceImageStore } from '@stores';
import { Point, Vector } from '@types';

import checkerboardPattern from '@assets/checkerboard.png';

const BORDER_PERCENTAGE = 0.2;
const MAX_SCALE = 1;

interface AnimatableSize {
  width: DimensionValue;
  height: DimensionValue;
}

const EditContent: React.FC = () => {
  const { uri, originalDimensions } = useSourceImageStore();
  const { dimensions: contentDimensions } = useContentMeasurements();

  const imageWidth = originalDimensions.width;
  const imageHeight = originalDimensions.height;
  const checkerboardWidth = imageWidth * (1 + BORDER_PERCENTAGE * 2);
  const checkerboardHeight = imageHeight * (1 + BORDER_PERCENTAGE * 2);
  const borderWidth = imageWidth * BORDER_PERCENTAGE;
  const borderHeight = imageHeight * BORDER_PERCENTAGE;

  const transform = useSharedValue<Vector>({
    x: -borderWidth,
    y: -borderHeight,
  });
  const savedTransform = useSharedValue<Vector>(transform.value);
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const savedFocalPoint = useSharedValue<Point>({
    x: 0,
    y: 0,
  });
  const imageContainerSize = useSharedValue<AnimatableSize>({
    width: '100%',
    height: '100%',
  });

  const minScale = useSharedValue(1);

  // derived values

  // width calculations
  const imageContainerWidth = useDerivedValue(() => {
    return imageContainerSize.value.width as number;
  });
  const windowWidth = useDerivedValue(() => {
    return imageContainerWidth.value / scale.value;
  });
  const maxX = useDerivedValue(() => {
    return -checkerboardWidth + windowWidth.value;
  });

  // height calculations
  const imageContainerHeight = useDerivedValue(() => {
    return imageContainerSize.value.height as number;
  });
  const windowHeight = useDerivedValue(() => {
    return imageContainerHeight.value / scale.value;
  });

  const maxY = useDerivedValue(() => {
    return -checkerboardHeight + windowHeight.value;
  });

  useEffect(() => {
    // Calculate scaled dimensions to fit the screen while maintaining aspect ratio
    const widthScale = contentDimensions.width / imageWidth;
    const heightScale = contentDimensions.height / imageHeight;
    const scaleFactor = Math.min(widthScale, heightScale);

    // update shared values
    minScale.value = scaleFactor / (1 + BORDER_PERCENTAGE * 2);
    imageContainerSize.value = {
      width: imageWidth * scaleFactor,
      height: imageHeight * scaleFactor,
    };
    scale.value = scaleFactor;
    savedScale.value = scaleFactor;
  }, [
    contentDimensions,
    imageContainerSize,
    imageWidth,
    imageHeight,
    minScale,
    scale,
    savedScale,
  ]);

  const updateTransform = (x: number, y: number) => {
    'worklet';
    transform.value = {
      x: Math.min(0, Math.max(x, maxX.value)),
      y: Math.min(0, Math.max(y, maxY.value)),
    };
  };

  const panGesture = Gesture.Pan()
    .enabled(true)
    .maxPointers(1)
    .minDistance(0)
    .onStart(() => {
      'worklet';
      savedTransform.value = transform.value;
    })
    .onUpdate((e) => {
      'worklet';
      const { x, y } = savedTransform.value;
      const newX = x + e.translationX / scale.value;
      const newY = y + e.translationY / scale.value;
      updateTransform(newX, newY);
    })
    .onEnd(() => {
      'worklet';
    });

  const pinchGesture = Gesture.Pinch()
    .enabled(true)
    .onStart((e) => {
      'worklet';
      savedTransform.value = transform.value;
      savedScale.value = scale.value;
      const absoluteFocalX = e.focalX / savedScale.value - transform.value.x;
      const absoluteFocalY = e.focalY / savedScale.value - transform.value.y;

      savedFocalPoint.value = {
        x: absoluteFocalX,
        y: absoluteFocalY,
      };
    })
    .onUpdate((e) => {
      'worklet';
      const { scale: eventScale } = e;
      const { x: focalX, y: focalY } = savedFocalPoint.value;

      const newScale = Math.max(
        Math.min(MAX_SCALE, savedScale.value * eventScale),
        minScale.value
      );

      const newWindowWidth = imageContainerWidth.value / newScale;
      const newWindowHeight = imageContainerHeight.value / newScale;

      const newX = -focalX + newWindowWidth / 2;
      const newY = -focalY + newWindowHeight / 2;

      scale.value = newScale;
      updateTransform(newX, newY);
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

  const imageContainerStyle = useAnimatedStyle(() => ({
    width: imageContainerSize.value.width,
    height: imageContainerSize.value.height,
  }));

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: transform.value.x },
      { translateY: transform.value.y },
    ],
  }));

  return (
    <View style={styles.container}>
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[styles.imageContainer, imageContainerStyle]}>
          <Animated.View style={[generatedStyles.checkerBoard, animatedStyle]}>
            <ImageBackground
              source={require('../assets/checkerboard.png')}
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
