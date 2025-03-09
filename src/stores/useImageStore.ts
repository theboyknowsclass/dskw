import { create } from "zustand";

type ImageDimensions = {
  width: number;
  height: number;
};

type ImageState = {
  uri: string | null;
  destinationUri: string | null;
  originalDimensions: ImageDimensions;
  scaledDimensions: ImageDimensions;
  isLoading: boolean;
  error: string | null;
  setUri: (uri: string | null) => void;
  setDestinationUri: (uri: string | null) => void;
  setDimensions: (original: ImageDimensions, scaled: ImageDimensions) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearImage: () => void;
};

export const useImageStore = create<ImageState>()((set) => ({
  uri: null,
  destinationUri: null,
  originalDimensions: { width: 0, height: 0 },
  scaledDimensions: { width: 0, height: 0 },
  isLoading: false,
  error: null,
  setUri: (uri: string | null) => set({ uri }),
  setDestinationUri: (destinationUri: string | null) => set({ destinationUri }),
  setDimensions: (original: ImageDimensions, scaled: ImageDimensions) =>
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
