import { create } from 'zustand';
import { Dimensions } from '../types';

/**
 * Represents the state of the image store.
 * @property uri - The URI of the selected image
 * @property destinationUri - The URI of the transformed image
 * @property originalDimensions - The original dimensions of the image
 * @property scaledDimensions - The scaled dimensions of the image
 * @property isLoading - Whether the image is loading
 * @property error - The error message if the image fails to load
 * @property setUri - Function to set the URI of the selected image
 * @property setDestinationUri - Function to set the URI of the transformed image
 * @property setDimensions - Function to set the original and scaled dimensions of the image
 * @property setLoading - Function to set the loading state
 * @property setError - Function to set the error message
 * @property clearImage - Function to clear the image state
 */
type ImageState = {
  uri: string | null;
  destinationUri: string | null;
  originalDimensions: Dimensions;
  scaledDimensions: Dimensions;
  isLoading: boolean;
  error: string | null;
  setUri: (uri: string | null) => void;
  setDestinationUri: (uri: string | null) => void;
  setDimensions: (original: Dimensions, scaled: Dimensions) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearImage: () => void;
};

/**
 * Creates the image store using the Zustand library.
 * @param set - The set function from Zustand
 * @returns The image store
 */
export const useImageStore = create<ImageState>()((set) => ({
  uri: null,
  destinationUri: null,
  originalDimensions: { width: 0, height: 0 },
  scaledDimensions: { width: 0, height: 0 },
  isLoading: false,
  error: null,
  setUri: (uri: string | null) => set({ uri }),
  setDestinationUri: (destinationUri: string | null) => set({ destinationUri }),
  setDimensions: (original: Dimensions, scaled: Dimensions) =>
    set({ originalDimensions: original, scaledDimensions: scaled }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
  clearImage: () =>
    set({
      uri: null,
      destinationUri: null,
      originalDimensions: { width: 0, height: 0 },
      scaledDimensions: { width: 0, height: 0 },
      error: null,
    }),
}));
