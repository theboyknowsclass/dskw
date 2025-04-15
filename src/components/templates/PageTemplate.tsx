import { useContentMeasurements, useScreenDimensions } from '@hooks';
import { StyleSheet, View, LayoutChangeEvent } from 'react-native';
import {
  BackButton,
  LoadingContainer,
  SettingsButton,
  ThemeToggle,
} from '@molecules';
import React, { ReactNode } from 'react';
import { ContentMeasurementsProvider } from '../../contexts/ContentMeasurementsContext';

interface PageTemplateProps {
  children?: React.ReactNode | React.ReactNode[];
  isLoading?: boolean;
  loadingText?: string;
}

interface ActionItemsProps {
  children?: React.ReactNode | React.ReactNode[];
}

// ActionItems component that will be used as a compound component
const ActionItems: React.FC<ActionItemsProps> = () => null;

// Define the type for the PageTemplate component with its static properties
interface PageTemplateComponent extends React.FC<PageTemplateProps> {
  ActionItems: React.FC<ActionItemsProps>;
}

// Create the Page component
const Page: React.FC<PageTemplateProps> = ({ children }) => {
  const { isLandscape, width, height } = useScreenDimensions();
  const { setIsReady, setDimensions, isReady } = useContentMeasurements();

  const loadingAnimationSize = (isLandscape ? width : height) * 0.3;

  // Extract action items from children
  const { otherChildren, actionItems } = separateChildren(children);

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
        <LoadingContainer
          isReady={isReady}
          loadingAnimationSize={loadingAnimationSize}
        >
          {otherChildren}
        </LoadingContainer>
      </View>
      <View style={actionBarStyles}>{actionItems}</View>
    </View>
  );
};

// Export a wrapped version of AppShellLayout with ContentMeasurementsProvider
export const PageTemplate: PageTemplateComponent = (props) => {
  return (
    <ContentMeasurementsProvider>
      <Page {...props} />
    </ContentMeasurementsProvider>
  );
};

// Attach ActionItems to the wrapped component
PageTemplate.ActionItems = ActionItems;

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
    margin: 16,
    position: 'relative',
  },
  navigationBarBase: {
    display: 'flex',
    flexGrow: 0,
    padding: 16,
    gap: 16,
  },
  navigationBarPrimary: {
    flexGrow: 1,
    gap: 16,
  },
  navigationBarSecondary: {
    display: 'flex',
    flexGrow: 0,
    gap: 16,
  },
  actionBarBase: {
    display: 'flex',
    flexGrow: 0,
    justifyContent: 'space-evenly',
    padding: 16,
  },
  barPortrait: {
    flexDirection: 'row',
  },
  barLandscape: {
    flexDirection: 'column',
  },
});

// Separate children into action items and other children
const separateChildren = (
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
