import * as ImagePicker from "expo-image-picker";

// Interface for image selection result
export interface ImageSelectionResult {
  uri: string | null;
  success: boolean;
  error?: string;
}

/**
 * Image picker service following the Single Responsibility Principle
 * This service is only responsible for handling image selection functionality
 */
export class ImagePickerService {
  /**
   * Request permissions for accessing the image library
   * @returns Promise resolving to a boolean indicating if permission was granted
   */
  static async requestPermissions(): Promise<boolean> {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === "granted";
  }

  /**
   * Open the device image library and select an image
   * @returns Promise resolving to ImageSelectionResult
   */
  static async selectImage(): Promise<ImageSelectionResult> {
    try {
      // Check for permissions first
      const permissionGranted = await this.requestPermissions();

      if (!permissionGranted) {
        return {
          uri: null,
          success: false,
          error: "Permission to access media library was denied",
        };
      }

      // Launch image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      // Handle user cancellation
      if (result.canceled) {
        return {
          uri: null,
          success: false,
          error: "Image selection was cancelled",
        };
      }

      // Return the selected image URI
      return {
        uri: result.assets[0].uri,
        success: true,
      };
    } catch (error) {
      return {
        uri: null,
        success: false,
        error: `Failed to select image: ${
          error instanceof Error ? error.message : String(error)
        }`,
      };
    }
  }
}
