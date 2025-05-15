import { useContentMeasurements, useScreenDimensions } from '@hooks';
import { StyleSheet, View, LayoutChangeEvent, ViewStyle } from 'react-native';
import { LoadingContainer } from '@molecules';
import React, { ReactNode } from 'react';
import { ContentMeasurementsProvider } from '@contexts';
import { NavigationBar } from '@organisms';

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
    { flexDirection: isLandscape ? 'row' : 'column' } as ViewStyle,
  ];

  const actionBarStyles = [
    styles.actionBarBase,
    { flexDirection: isLandscape ? 'column' : 'row' } as ViewStyle,
  ];

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setDimensions({ width, height });
    setIsReady(true);
  };

  return (
    <View style={rootContainerStyles}>
      <NavigationBar />
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
  mainContent: {
    flex: 1,
    margin: 16,
    position: 'relative',
  },
  actionBarBase: {
    display: 'flex',
    flexGrow: 0,
    justifyContent: 'space-evenly',
    padding: 16,
  },
});

// Separate children into action items and other children
const separateChildren = (
  children: React.ReactNode
): { actionItems: ReactNode[]; otherChildren: ReactNode[] } => {
  const actionItems: ReactNode[] = [];
  const otherChildren: ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (!child || !React.isValidElement(child)) {
      otherChildren.push(child);
      return;
    }

    const actionItem = getActionItem(child);

    if (actionItem) {
      actionItems.push(...React.Children.toArray(actionItem));
    } else {
      otherChildren.push(child);
    }
  });

  return { otherChildren, actionItems };
};

const getActionItem = (
  child:
    | React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>
    | React.ReactPortal
) => {
  const isActionItem =
    child.type === ActionItems ||
    (typeof child.type === 'function' && child.type.name === 'ActionItems');

  if (isActionItem) {
    const element = child as React.ReactElement<{
      children?: React.ReactNode;
    }>;
    return element.props.children;
  }
  return null;
};
