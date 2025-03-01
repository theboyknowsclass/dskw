import React, { useState } from "react";
import { View, Image, StyleSheet, ImageBackground } from "react-native";
import { QuadrilateralOverlay } from "./QuadrilateralOverlay";

type ImagePreviewProps = {
  imageUri: string | null;
};

export const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUri }) => {
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  if (!imageUri) return null;

  // Get image dimensions when it loads
  const onImageLoad = () => {
    Image.getSize(imageUri, (width, height) => {
      // Calculate dimensions that maintain aspect ratio and fit the screen
      const screenWidth = 300; // You might want to make this dynamic
      const scaleFactor = screenWidth / width;
      setImageDimensions({
        width: screenWidth,
        height: height * scaleFactor,
      });
    });
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: imageUri }}
        style={[styles.image, imageDimensions]}
        onLoad={onImageLoad}
        resizeMode="contain"
      >
        {imageDimensions.width > 0 && (
          <QuadrilateralOverlay
            imageWidth={imageDimensions.width}
            imageHeight={imageDimensions.height}
          />
        )}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    backgroundColor: "#000",
  },
});
