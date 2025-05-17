import { useEffect, useMemo } from 'react';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import {
  Canvas,
  Group,
  Path,
  Skia,
  Transforms3d,
} from '@shopify/react-native-skia';
import { useTheme } from '@react-navigation/native';

interface ProgressWheelProps {
  size: number;
  progress: SharedValue<number> | undefined;
  animating: boolean;
}

const duration = 3000;
const easing = Easing.linear;

export const ProgressWheel: React.FC<ProgressWheelProps> = ({
  size,
  progress = undefined,
  animating = true,
}) => {
  const { colors } = useTheme();
  const rotation = useSharedValue(0);

  const strokeWidth = size / 8;

  useEffect(() => {
    if (!animating) {
      cancelAnimation(rotation);
      rotation.value = 0;
      return;
    }

    rotation.value = withRepeat(
      withTiming(Math.PI * 2, { duration, easing }),
      -1,
      false
    );
    return () => {
      cancelAnimation(rotation);
      rotation.value = 0;
    };
  }, [rotation, animating]);

  const radius = size / 2 - strokeWidth / 2;

  const style = {
    width: size,
    height: size,
  };

  const origin = {
    x: size / 2,
    y: size / 2,
  };

  const path = useMemo(() => {
    const skPath = Skia.Path.Make();
    skPath.addCircle(size / 2, size / 2, radius);
    return skPath;
  }, [radius, size]);

  const transform = useDerivedValue(() => {
    return [{ rotate: rotation.value }] as Transforms3d;
  }, [rotation]);

  return (
    <Animated.View>
      <Canvas style={style}>
        <Group origin={origin} transform={transform}>
          <Path
            end={1}
            start={0}
            path={path}
            style={'stroke'}
            strokeCap={'round'}
            color={colors.primary + '90'}
            strokeWidth={strokeWidth}
          />
          <Path
            start={0}
            path={path}
            end={progress !== undefined ? progress.value : 0.15}
            style={'stroke'}
            strokeCap={'round'}
            color={colors.primary}
            strokeWidth={strokeWidth}
          />
        </Group>
      </Canvas>
    </Animated.View>
  );
};
