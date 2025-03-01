import React from "react";
import { View, StyleSheet, Image, Platform, Dimensions } from "react-native";

type ImagePreviewProps = {
  imageUri: string | null;
};

export const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUri }) => {
  if (!imageUri) {
    return null;
  }

  // Get screen dimensions to calculate appropriate image size
  const { width, height } = Dimensions.get("window");
  const isLandscape = width > height;

  // Calculate image dimensions based on orientation
  const imageWidth = isLandscape ? "90%" : "100%";
  const imageHeight = isLandscape ? height * 0.7 : height * 0.5;

  return (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: imageUri }}
        style={[
          styles.image,
          {
            width: imageWidth,
            height: imageHeight,
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  image: {
    borderRadius: 8,
    ...Platform.select({
      web: {
        maxWidth: 800,
        maxHeight: 600,
      },
    }),
  },
});
