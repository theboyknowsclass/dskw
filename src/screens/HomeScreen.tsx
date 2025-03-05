import React from "react";
import { View, StyleSheet, Image, ImageBackground } from "react-native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useTheme } from "../contexts/ThemeContext";
import { Header } from "../components/Header";
import { useImagePicker } from "../hooks/useImagePicker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useWindowDimensions } from "react-native";
import { ImagePreview } from "../components/ImagePreview";
import { ImageControls } from "../components/ImageControls";
import { ZoomPreview } from "../components/ZoomPreview";
import { useOverlayStore } from "../stores/useOverlayStore";
import { useImageStore } from "../stores/useImageStore";

// Define the navigation props type
type HomeScreenProps = {
  navigation: DrawerNavigationProp<any, any>;
};

/**
 * Home screen component
 * Follows the Interface Segregation Principle by only accepting the props it needs
 */
export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  // Use our custom hooks for theme and image picker
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();
  const { pickImage } = useImagePicker({ width, height });
  const insets = useSafeAreaInsets();
  const { isDragging } = useOverlayStore();
  const { uri, isLoading, error, scaledDimensions } = useImageStore();

  // Determine if the screen is in landscape orientation
  const contentStyle =
    width > height ? styles.landscapeContent : styles.portraitContent;

  // Decide whether to show the preview section based image selection
  const shouldShowPreview = uri !== null;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {/* Header with hamburger menu */}
      <Header navigation={navigation} />

      {/* Main content container with conditional direction */}
      <View style={[styles.content, contentStyle]}>
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
          {isDragging && uri ? (
            <ZoomPreview />
          ) : (
            <ImageControls
              onSelectImage={pickImage}
              isLoading={isLoading}
              error={error}
              textColor={colors.text}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  portraitContent: {
    flexDirection: "column",
  },
  landscapeContent: {
    flexDirection: "row",
  },
  section: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    flex: 1,
    height: "100%",
    width: "100%",
  },
});
