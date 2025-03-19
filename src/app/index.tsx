import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ImagePreview } from '../components/ImagePreview';
import { ImageControls } from '../components/ImageControls';
import { ZoomPreview } from '../components/ZoomPreview';
import { useOverlayStore } from '../stores/useOverlayStore';
import { useImageStore } from '../stores/useImageStore';
import { useTheme } from '@react-navigation/native';
import { useScreenDimensions } from '../hooks/useScreenDimensions';

/**
 * Home component
 * Follows the Interface Segregation Principle by only accepting the props it needs
 */
export const Home: React.FC = () => {
  // Use our custom hooks for theme
  const { colors } = useTheme();
  const { isLandscape } = useScreenDimensions();
  const insets = useSafeAreaInsets();
  const { activePointIndex } = useOverlayStore();
  const { uri } = useImageStore();

  const isDragging = activePointIndex != null;

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
      {/* Main content with no top border/margin */}
      <View style={[contentStyle, { marginTop: 0, borderTopWidth: 0 }]}>
        {/* only show preview if there's a selected image */}
        {shouldShowPreview && (
          <View style={[styles.section]}>
            <ImagePreview />
          </View>
        )}
        <View style={[styles.section]}>
          {isDragging ? <ZoomPreview /> : <ImageControls />}
        </View>
      </View>
    </View>
  );
};

export default Home;

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
    borderWidth: 0,
  },
});
