import React from "react";
import { View, Text, StyleSheet, Image, Platform } from "react-native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { useImagePicker } from "../hooks/useImagePicker";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const { selectedImage, isLoading, error, pickImage, clearImage } =
    useImagePicker();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          // Apply safe area insets to the container
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {/* Header with hamburger menu */}
      <Header title="Home" navigation={navigation} />

      <View style={styles.content}>
        {/* Show selected image if available */}
        {selectedImage ? (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={[styles.imageText, { color: colors.text }]}>
              Image selected!
            </Text>
            <Button
              title="Clear Image"
              onPress={clearImage}
              variant="secondary"
              buttonStyle={styles.clearButton}
            />
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <Text style={[styles.heading, { color: colors.text }]}>
              Welcome to the Image Picker App
            </Text>
            <Text style={[styles.subheading, { color: colors.text }]}>
              Select an image from your device
            </Text>
            <Button
              title="Select Image"
              onPress={pickImage}
              loading={isLoading}
              size="large"
            />
            {/* Show error if any */}
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
        )}
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subheading: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
  },
  errorText: {
    color: "red",
    marginTop: 20,
    textAlign: "center",
  },
  imageContainer: {
    alignItems: "center",
    width: "100%",
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    ...Platform.select({
      web: {
        maxWidth: 500,
      },
    }),
  },
  imageText: {
    fontSize: 18,
    marginVertical: 20,
  },
  clearButton: {
    marginTop: 20,
  },
});
