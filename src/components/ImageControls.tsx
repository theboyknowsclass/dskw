import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useImageStore } from '../stores/useImageStore';
import { ImagePickerButton } from './ImagePickerButton';
import { ImageProcessButton } from './ImageProcessButton';

type ImageControlsProps = {
  width: number;
  height: number;
};

export const ImageControls: React.FC<ImageControlsProps> = ({
  width,
  height,
}) => {
  const { error } = useImageStore();

  return (
    <View style={styles.buttonContainer}>
      <View style={styles.buttonsColumn}>
        <ImagePickerButton
          width={width}
          height={height}
          style={styles.button}
        />
        <ImageProcessButton style={styles.button} />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    maxWidth: 500, // Limit overall container width
    alignSelf: 'center',
  },
  buttonsColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 300, // Limit the width of the button column
  },
  button: {
    width: '100%',
    marginBottom: 15,
    maxWidth: 300, // Limit individual button width
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});
