import { create } from 'zustand';

export type ThemeType = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

// Create a basic theme store without persistence for now
export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'system', // Default theme
  setTheme: (theme: ThemeType) => set({ theme }),
}));
