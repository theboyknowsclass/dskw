import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useTheme } from '../contexts/ThemeContext';
import { Header } from '../components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWindowDimensions } from 'react-native';
import { ImagePreview } from '../components/ImagePreview';
import { ImageControls } from '../components/ImageControls';
import { ZoomPreview } from '../components/ZoomPreview';
import { useOverlayStore } from '../stores/useOverlayStore';
import { useImageStore } from '../stores/useImageStore';

// Define the navigation props type
type HomeScreenProps = {
  navigation: DrawerNavigationProp<any, any>;
};

/**
 * Home screen component
 * Follows the Interface Segregation Principle by only accepting the props it needs
 */
export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  // Use our custom hooks for theme
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { activePointIndex } = useOverlayStore();
  const { uri, scaledDimensions } = useImageStore();

  const isDragging = activePointIndex != null;

  // Determine if the screen is in landscape orientation
  const isLandscape = width > height;

  // Calculate content style based on orientation and screen size
  const contentStyle = [
    styles.content,
    isLandscape ? styles.landscapeContent : styles.portraitContent,
  ];

  // Decide whether to show the preview section based image selection
  const shouldShowPreview = uri !== null;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingBottom: insets.bottom,
          borderWidth: 0,
        },
      ]}
    >
      {/* Header with hamburger menu */}
      <Header navigation={navigation} title="Image Scanner" />

      {/* Main content with no top border/margin */}
      <View style={[contentStyle, { marginTop: 0, borderTopWidth: 0 }]}>
        {/* only show preview if there's a selected image */}
        {shouldShowPreview && (
          <View style={[styles.section]}>
            <ImagePreview
              imageUri={uri}
              displayWidth={scaledDimensions.width}
              displayHeight={scaledDimensions.height}
            />
          </View>
        )}
        <View style={[styles.section]}>
          {isDragging ? (
            <ZoomPreview />
          ) : (
            <ImageControls width={width} height={height} />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 0,
  },
  content: {
    flex: 1,
    padding: 20,
    borderWidth: 0,
    borderTopWidth: 0,
  },
  landscapeContent: {
    flexDirection: 'row',
  },
  portraitContent: {
    flexDirection: 'column',
  },
  section: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    margin: 10,
    borderWidth: 0,
  },
});
