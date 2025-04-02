import { create } from 'zustand';

/**
 * Represents the state of the settings store.
 * @property cropToOverlay - Whether to crop the image to the overlay bounds
 * @property setCropToOverlay - Function to set the cropToOverlay setting
 */
type SettingsState = {
  cropToOverlay: boolean;
  setCropToOverlay: (cropToOverlay: boolean) => void;
};

/**
 * Creates the settings store using the Zustand library.
 * @param set - The set function from Zustand
 * @returns The settings store
 */
export const useSettingsStore = create<SettingsState>()((set) => ({
  cropToOverlay: true,
  setCropToOverlay: (cropToOverlay: boolean) => set({ cropToOverlay }),
}));
