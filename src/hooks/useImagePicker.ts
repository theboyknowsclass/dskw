import { Image } from 'react-native';
import {
  ImagePickerService,
  ImageSelectionResult,
} from '../services/ImagePickerService';
import { useImageStore } from '../stores/useImageStore';

type ScreenDimensions = {
  width: number;
  height: number;
};

/**
 * Custom hook for image selection following the Dependency Inversion Principle
 * The hook depends on abstractions (interfaces) rather than concrete implementations
 */
export const useImagePicker = (screenDimensions: ScreenDimensions) => {
  const {
    uri: selectedImage,
    isLoading,
    error,
    setUri,
    setBase64,
    setDimensions,
    setLoading,
    setError,
    clearImage,
  } = useImageStore();

  /**
   * Function to handle image selection
   */
  const pickImage = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Use the ImagePickerService to select an image
      const result: ImageSelectionResult =
        await ImagePickerService.selectImage();

      if (result.success && result.uri) {
        // Get image dimensions when it loads
        Image.getSize(result.uri, (width, height) => {
          // Calculate dimensions that maintain aspect ratio and fit the screen
          const isScreenLandscape =
            screenDimensions.width > screenDimensions.height;

          // Determine the maximum allowed dimensions based on screen orientation
          const maxWidth = isScreenLandscape
            ? screenDimensions.width * 0.4 // In landscape, use 40% of screen width
            : screenDimensions.width * 0.8; // In portrait, use 80% of screen width

          const maxHeight = isScreenLandscape
            ? screenDimensions.height * 0.8 // In landscape, use 80% of screen height
            : screenDimensions.height * 0.4; // In portrait, use 40% of screen height

          // Calculate scale factors for both dimensions
          const widthScale = maxWidth / width;
          const heightScale = maxHeight / height;

          // Use the smaller scale factor to ensure the image fits in both dimensions
          const scaleFactor = Math.min(widthScale, heightScale);

          setDimensions(
            { width, height }, // Original dimensions
            {
              width: width * scaleFactor,
              height: height * scaleFactor,
            } // Scaled dimensions
          );
          setUri(result.uri);
          setBase64(result.base64);
        });
      } else if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError(
        `Unexpected error: ${err instanceof Error ? err.message : String(err)}`
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    selectedImage,
    isLoading,
    error,
    pickImage,
    clearImage,
  };
};
