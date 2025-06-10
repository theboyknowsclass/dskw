import { create } from 'zustand';
import { DefaultSourceImage, ImageSource } from '@types';

/**
 * Represents the state of the source image store.
 * @property uri - The URI of the selected image
 * @property originalDimensions - The original dimensions of the image
 * @property isLoading - Whether the image is loading
 * @property error - The error message if the image fails to load
 * @property setUri - Function to set the URI of the selected image
 * @property setOriginalDimensions - Function to set the original dimensions of the image
 * @property setLoading - Function to set the loading state
 * @property setError - Function to set the error message
 * @property clearImage - Function to clear the image state
 */
type SourceImageState = {
  sourceImage: ImageSource;
  isLoading: boolean;
  error: string | null;
  setSourceImage: (sourceImage: ImageSource) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearImage: () => void;
};

/**
 * Creates the source image store using the Zustand library.
 * @param set - The set function from Zustand
 * @returns The source image store
 */
export const useSourceImageStore = create<SourceImageState>()((set) => ({
  sourceImage: DefaultSourceImage,
  isLoading: false,
  error: null,
  setSourceImage: (sourceImage: ImageSource) => set({ sourceImage }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
  clearImage: () =>
    set({
      sourceImage: DefaultSourceImage,
      error: null,
    }),
}));
