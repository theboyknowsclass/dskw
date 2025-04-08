import { useScreenDimensions } from '@hooks';
import { StyleSheet, View, LayoutChangeEvent } from 'react-native';
import { BackButton, SettingsButton, ThemeToggle } from '@molecules';
import React, { ReactNode } from 'react';
import {
  ContentMeasurementsProvider,
  useContentMeasurements,
} from '../../contexts/ContentMeasurementsContext';

interface AppShellLayoutProps {
  children?: React.ReactNode | React.ReactNode[];
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
  const { isLandscape } = useScreenDimensions();
  const { setIsLoading, setDimensions } = useContentMeasurements();

  // Extract action items from children
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
    setIsLoading(false);
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
      <View style={styles.contentContainer} onLayout={onLayout}>
        {otherChildren}
      </View>
      {actionItems.length > 0 && (
        <View style={actionBarStyles}>{actionItems}</View>
      )}
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
  contentContainer: {
    flex: 1,
    margin: 10,
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
});
