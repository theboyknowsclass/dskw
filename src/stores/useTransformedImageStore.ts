import { create } from 'zustand';

/**
 * Represents the state of the transformed image store.
 * @property destinationUri - The URI of the transformed image
 * @property isLoading - Whether the image transformation is in progress
 * @property error - The error message if the transformation fails
 * @property setDestinationUri - Function to set the URI of the transformed image
 * @property setLoading - Function to set the loading state
 * @property setError - Function to set the error message
 * @property clearTransformedImage - Function to clear the transformed image state
 */
type TransformedImageState = {
  destinationUri: string | null;
  isLoading: boolean;
  error: string | null;
  setDestinationUri: (uri: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearTransformedImage: () => void;
};

/**
 * Creates the transformed image store using the Zustand library.
 * @param set - The set function from Zustand
 * @returns The transformed image store
 */
export const useTransformedImageStore = create<TransformedImageState>()(
  (set) => ({
    destinationUri: null,
    isLoading: false,
    error: null,
    setDestinationUri: (destinationUri: string | null) =>
      set({ destinationUri }),
    setLoading: (isLoading: boolean) => set({ isLoading }),
    setError: (error: string | null) => set({ error }),
    clearTransformedImage: () =>
      set({
        destinationUri: null,
        isLoading: false,
        error: null,
      }),
  })
);
