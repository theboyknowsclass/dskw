import { Dimensions } from '@types';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

interface PanZoomControlProps {
  children?: React.ReactNode | React.ReactNode[];
  dimensions: Dimensions;
  parentDimensions: Dimensions;
  initialScale?: number;
  maxScale?: number;
  minScale?: number;
  initialTranslate?: { x: number; y: number };
}

export const PanZoomControl: React.FC<PanZoomControlProps> = ({
  children,
  dimensions,
  parentDimensions,
  initialScale = 1,
  maxScale = 1,
  minScale = 0.1,
  initialTranslate = { x: 0, y: 0 },
}) => {
  const scale = useSharedValue(initialScale);
  const savedScale = useSharedValue(initialScale);
  const translate = useSharedValue(initialTranslate);
  const savedTranslate = useSharedValue(initialTranslate);
  const savedFocalPoint = useSharedValue({ x: 0, y: 0 });

  const windowWidth = useDerivedValue(() => {
    return parentDimensions.width / scale.value;
  });
  const maxX = useDerivedValue(() => {
    return -dimensions.width + windowWidth.value;
  });

  const windowHeight = useDerivedValue(() => {
    return parentDimensions.height / scale.value;
  });
  const maxY = useDerivedValue(() => {
    return -dimensions.height + windowHeight.value;
  });

  const updateTranslate = (x: number, y: number) => {
    'worklet';
    translate.value = {
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
      savedTranslate.value = translate.value;
    })
    .onUpdate((e) => {
      'worklet';
      const { x, y } = savedTranslate.value;
      const newX = x + e.translationX / scale.value;
      const newY = y + e.translationY / scale.value;
      updateTranslate(newX, newY);
    })
    .onEnd(() => {
      'worklet';
    });

  const pinchGesture = Gesture.Pinch()
    .enabled(true)
    .onStart((e) => {
      'worklet';
      savedTranslate.value = translate.value;
      savedScale.value = scale.value;
      const absoluteFocalX = e.focalX / savedScale.value - translate.value.x;
      const absoluteFocalY = e.focalY / savedScale.value - translate.value.y;

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
        Math.min(maxScale, savedScale.value * eventScale),
        minScale
      );

      const newWindowWidth = parentDimensions.width / newScale;
      const newWindowHeight = parentDimensions.height / newScale;

      const newX = -focalX + newWindowWidth / 2;
      const newY = -focalY + newWindowHeight / 2;

      scale.value = newScale;
      updateTranslate(newX, newY);
    })
    .onEnd(() => {
      'worklet';
    });

  // Combine both gestures
  const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture);

  const layoutStyle = {
    width: dimensions.width,
    height: dimensions.height,
    transformOrigin: 'top left',
  };

  const transformStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translate.value.x },
      { translateY: translate.value.y },
    ],
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View style={[layoutStyle, transformStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};
