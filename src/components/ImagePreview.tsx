import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Overlay } from './Overlay';

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
      <Image
        source={{ uri: imageUri }}
        style={[styles.image, { width: displayWidth, height: displayHeight }]}
        resizeMode="contain"
      ></Image>
      <Overlay imageWidth={displayWidth} imageHeight={displayHeight} />
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
