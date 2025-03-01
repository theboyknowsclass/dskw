import { useState } from "react";
import {
  ImagePickerService,
  ImageSelectionResult,
} from "../services/ImagePickerService";

/**
 * Custom hook for image selection following the Dependency Inversion Principle
 * The hook depends on abstractions (interfaces) rather than concrete implementations
 */
export const useImagePicker = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Function to handle image selection
   */
  const pickImage = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Use the ImagePickerService to select an image
      const result: ImageSelectionResult =
        await ImagePickerService.selectImage();

      if (result.success && result.uri) {
        setSelectedImage(result.uri);
      } else if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError(
        `Unexpected error: ${err instanceof Error ? err.message : String(err)}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Function to clear the selected image and any errors
   */
  const clearImage = (): void => {
    setSelectedImage(null);
    setError(null);
  };

  return {
    selectedImage,
    isLoading,
    error,
    pickImage,
    clearImage,
  };
};
