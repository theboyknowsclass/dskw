import { create } from 'zustand';
import { Dimensions } from '@types';

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
  uri: string | null;
  originalDimensions: Dimensions;
  isLoading: boolean;
  error: string | null;
  setUri: (uri: string | null) => void;
  setOriginalDimensions: (dimensions: Dimensions) => void;
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
  uri: null,
  originalDimensions: { width: 0, height: 0 },
  isLoading: false,
  error: null,
  setUri: (uri: string | null) => set({ uri }),
  setOriginalDimensions: (dimensions: Dimensions) =>
    set({ originalDimensions: dimensions }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
  clearImage: () =>
    set({
      uri: null,
      originalDimensions: { width: 0, height: 0 },
      error: null,
    }),
}));
