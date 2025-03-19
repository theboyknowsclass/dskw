import { ImagePickerService } from '../services/ImagePickerService';
import { useImageStore } from '../stores/useImageStore';
import { useLayout } from './useLayout';

/**
 * Custom hook for image selection following the Dependency Inversion Principle
 * The hook depends on abstractions (interfaces) rather than concrete implementations
 */
export const useImagePicker = () => {
  const {
    uri: selectedImage,
    isLoading,
    error,
    setUri,
    setDimensions,
    setLoading,
    setError,
    clearImage,
  } = useImageStore();

  const {
    imageMax: { width: maxWidth, height: maxHeight },
  } = useLayout();

  /**
   * Function to handle image selection
   */
  const pickImage = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Use the ImagePickerService to select an image
      const { success, error, data } = await ImagePickerService.selectImage();

      if (success && data) {
        const {
          uri,
          dimensions: { width, height },
        } = data;

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
        setUri(uri);
      } else if (error) {
        setError(error);
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
