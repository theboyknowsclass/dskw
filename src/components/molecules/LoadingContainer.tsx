import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';

interface LoadingContainerProps {
  children: React.ReactNode;
  isReady: boolean;
}

export const LoadingContainer: React.FC<LoadingContainerProps> = ({
  children,
  isReady,
}) => {
  // Create shared values for opacity
  const contentOpacity = useSharedValue(isReady ? 1 : 0);

  // Update animations when isReady changes
  useEffect(() => {
    contentOpacity.value = withTiming(isReady ? 1 : 0, {
      duration: 800,
      easing: Easing.inOut(Easing.ease),
    });
  }, [isReady, contentOpacity]);

  // Create animated styles
  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  return (
    <View style={styles.animatedContainer}>
      <Animated.View style={[styles.content, contentAnimatedStyle]}>
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  animatedContainer: {
    flex: 1,
    position: 'relative',
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
});
