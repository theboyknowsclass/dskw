import React from "react";
import { View, StyleSheet } from "react-native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useTheme } from "../contexts/ThemeContext";
import { Header } from "../components/Header";
import { useImagePicker } from "../hooks/useImagePicker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useWindowDimensions } from "react-native";
import { ImagePreview } from "../components/ImagePreview";
import { ImageControls } from "../components/ImageControls";

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
  const { selectedImage, isLoading, error, pickImage } = useImagePicker();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  // Determine if the screen is in landscape orientation
  const isLandscape = width > height;

  // Decide whether to show the preview section based on orientation and image selection
  const shouldShowPreview = isLandscape || selectedImage !== null;

  // Function to render the preview section
  const renderPreviewSection = () => (
    <View
      style={[
        isLandscape ? styles.landscapeHalf : styles.portraitFull,
        styles.previewSection,
      ]}
    >
      <ImagePreview imageUri={selectedImage} />
    </View>
  );

  // Function to render the controls section
  const renderControlsSection = () => (
    <View
      style={[
        isLandscape ? styles.landscapeHalf : styles.portraitFull,
        styles.controlsSection,
      ]}
    >
      <ImageControls
        onSelectImage={pickImage}
        isLoading={isLoading}
        error={error}
        textColor={colors.text}
      />
    </View>
  );

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
      <View
        style={[
          styles.content,
          isLandscape ? styles.landscapeContent : styles.portraitContent,
        ]}
      >
        {/* In portrait mode, only show preview if there's a selected image */}
        {shouldShowPreview && renderPreviewSection()}
        {renderControlsSection()}
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
  portraitFull: {
    flex: 1,
    width: "100%",
  },
  landscapeHalf: {
    flex: 1,
    height: "100%",
  },
  previewSection: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  controlsSection: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
