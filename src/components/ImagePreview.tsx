import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Overlay } from './Overlay';
import { useImageStore } from '../stores/useImageStore';

export const ImagePreview: React.FC = () => {
  const {
    scaledDimensions: { width, height },
    uri,
  } = useImageStore();

  if (!uri) return null;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: uri }}
        style={{ width, height }}
        resizeMode="contain"
      ></Image>
      <Overlay imageWidth={width} imageHeight={height} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
