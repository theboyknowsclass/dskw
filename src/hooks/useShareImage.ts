import { useTransformedImageStore, useSharingImageStore } from '@stores';
import * as Sharing from 'expo-sharing';
import { FileSystemService } from '@services';
import { useEffect } from 'react';

/**
 * Hook for handling image sharing functionality.
 * @returns Object containing:
 * - canShare: boolean indicating if sharing is possible
 * - isSharing: boolean indicating if sharing in progress
 * - shareImage: function to share the current transformed image
 */
export const useShareImage = () => {
  const { destinationUri } = useTransformedImageStore();
  const {
    canShare,
    isSharing,
    setCanShare,
    setIsSharing,
    setTemporaryFileUri,
  } = useSharingImageStore();

  // Check if sharing is possible when destinationUri changes
  useEffect(() => {
    const checkSharingAvailability = async () => {
      if (!destinationUri) {
        setCanShare(false);
        return;
      }

      const isAvailable = await Sharing.isAvailableAsync();
      setCanShare(isAvailable);
    };

    checkSharingAvailability();
  }, [destinationUri, setCanShare]);

  const shareImage = async () => {
    if (!destinationUri || isSharing) {
      return;
    }

    try {
      setIsSharing(true);

      const fileName = `shared-image-${Date.now()}.jpg`;
      // Create a temporary file path
      const tempFilePath = `${FileSystemService.getCacheDirectory()}${fileName}`;

      // Write the base64 image to the temporary file
      await FileSystemService.writeBase64ToFile(tempFilePath, destinationUri);

      // Set the temporary file URI
      setTemporaryFileUri(tempFilePath);

      // Share the temporary file
      await Sharing.shareAsync(tempFilePath, {
        mimeType: 'image/jpeg',
      });

      // Clean up the temporary file after sharing
      await FileSystemService.deleteFile(tempFilePath);
      setTemporaryFileUri(null);
    } catch (error) {
      console.error('Error in share process:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
        });
      }
    } finally {
      setIsSharing(false);
    }
  };

  return {
    canShare,
    isSharing,
    shareImage,
  };
};
