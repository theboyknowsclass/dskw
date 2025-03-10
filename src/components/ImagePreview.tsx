import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { QuadrilateralOverlay } from './QuadrilateralOverlay';

type ImagePreviewProps = {
  imageUri: string;
  displayWidth: number; // width of the image in the preview
  displayHeight: number; // height of the image in the preview
};

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageUri,
  displayWidth,
  displayHeight,
}) => {
  if (!imageUri) return null;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: imageUri }}
        style={[styles.image, { width: displayWidth, height: displayHeight }]}
        resizeMode="contain"
      >
        <QuadrilateralOverlay
          imageWidth={displayWidth}
          imageHeight={displayHeight}
        />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {},
});
