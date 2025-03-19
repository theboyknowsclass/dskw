import * as FileSystem from 'expo-file-system';

/**
 * FileSystemService provides methods for reading and writing images to the file system.
 * This service is responsible for:
 * 1. Reading an image from a URI and returning its base64 representation
 * 2. Saving an image from a base64 string to the file system
 */
export class FileSystemService {
  /**
   * Reads an image from a URI and returns its base64 representation
   * @param uri - The URI of the image to read
   * @returns Promise resolving to the base64 representation of the image
   */
  static async getImageAsBase64(uri: string) {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  }

  /**
   * Saves an image from a base64 string to the file system
   * @param base64 - The base64 representation of the image to save
   * @returns Promise resolving to the filename of the saved image
   */
  static async saveImage(base64: string): Promise<string> {
    const filename = FileSystem.documentDirectory + 'some_unique_file_name.png';
    await FileSystem.writeAsStringAsync(filename, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return filename;
  }
}
