import { create } from 'zustand';

/**
 * Represents the state of the image sharing store.
 * @property canShare - Whether the image can be shared
 * @property isSharing - Whether the image is currently being shared
 * @property temporaryFileUri - The URI of the temporary file being shared
 * @property setCanShare - Function to set whether the image can be shared
 * @property setIsSharing - Function to set whether the image is being shared
 * @property setTemporaryFileUri - Function to set the temporary file URI
 * @property clearSharingState - Function to clear all sharing state
 */
type SharingImageState = {
  canShare: boolean;
  isSharing: boolean;
  temporaryFileUri: string | null;
  setCanShare: (canShare: boolean) => void;
  setIsSharing: (isSharing: boolean) => void;
  setTemporaryFileUri: (uri: string | null) => void;
  clearSharingState: () => void;
};

/**
 * Creates the sharing image store using the Zustand library.
 * @param set - The set function from Zustand
 * @returns The sharing image store
 */
export const useSharingImageStore = create<SharingImageState>()((set) => ({
  canShare: false,
  isSharing: false,
  temporaryFileUri: null,
  setCanShare: (canShare: boolean) => set({ canShare }),
  setIsSharing: (isSharing: boolean) => set({ isSharing }),
  setTemporaryFileUri: (temporaryFileUri: string | null) =>
    set({ temporaryFileUri }),
  clearSharingState: () =>
    set({
      canShare: false,
      isSharing: false,
      temporaryFileUri: null,
    }),
}));
