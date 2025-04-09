import { useScreenDimensions } from '@hooks';
import { StyleSheet, View, LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import { BackButton, SettingsButton, ThemeToggle } from '@molecules';
import React, { ReactNode, useEffect } from 'react';
import {
  ContentMeasurementsProvider,
  useContentMeasurements,
} from '../../contexts/ContentMeasurementsContext';
import { LoadingSpinner } from '@atoms';

interface AppShellLayoutProps {
  children?: React.ReactNode | React.ReactNode[];
  isLoading?: boolean;
  loadingText?: string;
}

interface ActionItemsProps {
  children?: React.ReactNode | React.ReactNode[];
}

// ActionItems component that will be used as a compound component
const ActionItems: React.FC<ActionItemsProps> = () => null;

// Define the type for the AppShellLayout component with its static properties
interface AppShellLayoutComponent extends React.FC<AppShellLayoutProps> {
  ActionItems: React.FC<ActionItemsProps>;
}

// Create the AppShellLayout component
const AppShell: AppShellLayoutComponent = ({ children }) => {
  const { isLandscape, width, height } = useScreenDimensions();
  const { setIsReady, setDimensions, isReady } = useContentMeasurements();

  // Create shared values for opacity
  const contentOpacity = useSharedValue(0);
  const loadingOpacity = useSharedValue(1);

  // Create animated styles
  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const loadingAnimatedStyle = useAnimatedStyle(() => ({
    opacity: loadingOpacity.value,
  }));

  // Update animations when isReady changes
  useEffect(() => {
    contentOpacity.value = withTiming(isReady ? 1 : 0, {
      duration: 800,
      easing: Easing.inOut(Easing.ease),
    });

    loadingOpacity.value = withTiming(isReady ? 0 : 1, {
      duration: 800,
      easing: Easing.inOut(Easing.ease),
    });
  }, [isReady, contentOpacity, loadingOpacity]);

  const loadingAnimationSize = (isLandscape ? width : height) * 0.3;

  // Extract action items from children
  const { otherChildren, actionItems } = seperateChildren(children);

  // responsive styles for orientation
  const rootContainerStyles = [
    styles.rootContainer,
    isLandscape ? styles.landscapeContainer : styles.portraitContainer,
  ];

  const navigationBarStyles = [
    styles.navigationBarBase,
    isLandscape ? styles.barLandscape : styles.barPortrait,
  ];

  const navigationBarPrimaryStyles = [
    styles.navigationBarPrimary,
    isLandscape ? styles.barLandscape : styles.barPortrait,
  ];

  const navigationBarSecondaryStyles = [
    styles.navigationBarSecondary,
    isLandscape ? styles.barLandscape : styles.barPortrait,
  ];

  const actionBarStyles = [
    styles.actionBarBase,
    isLandscape ? styles.barLandscape : styles.barPortrait,
  ];

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setDimensions({ width, height });
    setIsReady(true);
  };

  return (
    <View style={rootContainerStyles}>
      <View style={navigationBarStyles}>
        <View style={navigationBarPrimaryStyles}>
          <BackButton />
        </View>
        <View style={navigationBarSecondaryStyles}>
          <ThemeToggle />
          <SettingsButton />
        </View>
      </View>
      <View style={styles.mainContent} onLayout={onLayout}>
        <View style={styles.animatedContainer}>
          <Animated.View style={[styles.loading, loadingAnimatedStyle]}>
            <LoadingSpinner size={loadingAnimationSize} animating={!isReady} />
          </Animated.View>
          <Animated.View style={[styles.content, contentAnimatedStyle]}>
            {otherChildren}
          </Animated.View>
        </View>
      </View>
      <View style={actionBarStyles}>{actionItems}</View>
    </View>
  );
};

AppShell.ActionItems = ActionItems;

// Export a wrapped version of AppShellLayout with ContentMeasurementsProvider
export const AppShellLayout: AppShellLayoutComponent = (props) => {
  return (
    <ContentMeasurementsProvider>
      <AppShell {...props} />
    </ContentMeasurementsProvider>
  );
};

// Attach ActionItems to the wrapped component
AppShellLayout.ActionItems = ActionItems;

const styles = StyleSheet.create({
  rootContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
  },
  portraitContainer: {
    flexDirection: 'column',
  },
  landscapeContainer: {
    flexDirection: 'row',
  },
  mainContent: {
    flex: 1,
    margin: 10,
    position: 'relative',
  },
  animatedContainer: {
    flex: 1,
    position: 'relative',
  },
  navigationBarBase: {
    display: 'flex',
    flexGrow: 0,
    padding: 10,
    gap: 10,
  },
  navigationBarPrimary: {
    flexGrow: 1,
    gap: 10,
  },
  navigationBarSecondary: {
    display: 'flex',
    flexGrow: 0,
    gap: 10,
  },
  actionBarBase: {
    display: 'flex',
    flexGrow: 0,
    justifyContent: 'space-evenly',
    padding: 10,
  },
  barPortrait: {
    flexDirection: 'row',
  },
  barLandscape: {
    flexDirection: 'column',
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
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
});

const seperateChildren = (
  children:
    | string
    | number
    | boolean
    | React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>
    | Iterable<React.ReactNode>
    | React.ReactPortal
    | React.ReactNode[]
    | null
    | undefined
): { actionItems: ReactNode[]; otherChildren: ReactNode[] } => {
  const actionItems: ReactNode[] = [];
  const otherChildren: ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === ActionItems) {
      // Collect action items
      if (child.props.children) {
        const items = React.Children.toArray(child.props.children);
        actionItems.push(...items);
      }
    } else {
      // Collect other children
      otherChildren.push(child);
    }
  });
  return { otherChildren, actionItems };
};
