import { create } from "zustand";

type ImageDimensions = {
  width: number;
  height: number;
};

type ImageState = {
  uri: string | null;
  originalDimensions: ImageDimensions;
  scaledDimensions: ImageDimensions;
  setUri: (uri: string | null) => void;
  setDimensions: (original: ImageDimensions, scaled: ImageDimensions) => void;
  clearImage: () => void;
};

export const useImageStore = create<ImageState>()((set) => ({
  uri: null,
  originalDimensions: { width: 0, height: 0 },
  scaledDimensions: { width: 0, height: 0 },
  setUri: (uri: string | null) => set({ uri }),
  setDimensions: (original: ImageDimensions, scaled: ImageDimensions) =>
    set({ originalDimensions: original, scaledDimensions: scaled }),
  clearImage: () =>
    set({
      uri: null,
      originalDimensions: { width: 0, height: 0 },
      scaledDimensions: { width: 0, height: 0 },
    }),
}));
