import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from './Button';
import { useImagePicker } from '../hooks/useImagePicker';
import { useImageStore } from '../stores/useImageStore';
import { useOverlayStore } from '../stores/useOverlayStore';
import { transformImage } from '../utils/transformUtils';
import { router } from 'expo-router';

type ImageControlsProps = {
  width: number;
  height: number;
};

export const ImageControls: React.FC<ImageControlsProps> = ({
  width,
  height,
}) => {
  // Use image picker hook
  const { pickImage } = useImagePicker({ width, height });

  // Use stores
  const { uri, isLoading, error, setDestinationUri, setLoading, setError } =
    useImageStore();
  const { points } = useOverlayStore();

  // Check if an image is selected
  const hasSelectedImage = uri !== null;

  // Handle next button press
  const handleNext = async () => {
    if (!uri) return;

    try {
      // Show loading state
      setLoading(true);
      setError(null);

      // Process the image
      const transformedUri = await transformImage(uri, points);

      // Save the processed image URI
      setDestinationUri(transformedUri);

      // Navigate to the process image screen
      router.push('export');
    } catch (err) {
      setError(
        `Error processing image: ${err instanceof Error ? err.message : String(err)}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.buttonContainer}>
      {/* Stack buttons in a column */}
      <View style={styles.buttonsColumn}>
        <Button
          title="Select Image"
          onPress={pickImage}
          loading={isLoading}
          size="large"
          buttonStyle={styles.button}
        />

        <Button
          title="Next"
          onPress={handleNext}
          disabled={!hasSelectedImage}
          size="large"
          buttonStyle={styles.button}
        />
      </View>

      {/* Error message */}
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
