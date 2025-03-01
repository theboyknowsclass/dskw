import { create } from "zustand";
// import { createJSONStorage, persist } from "zustand/middleware";
// import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeType = "light" | "dark" | "system";

interface ThemeState {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

// Create a basic theme store without persistence for now
export const useThemeStore = create<ThemeState>((set) => ({
  theme: "system", // Default theme
  setTheme: (theme: ThemeType) => set({ theme }),
}));

/*
// This is the persistent version that we'll enable once AsyncStorage is working
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "system", // Default theme
      setTheme: (theme: ThemeType) => set({ theme }),
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => {
        return {
          getItem: async (name) => {
            const value = await AsyncStorage.getItem(name);
            return value ?? null;
          },
          setItem: async (name, value) => {
            await AsyncStorage.setItem(name, value);
          },
          removeItem: async (name) => {
            await AsyncStorage.removeItem(name);
          },
        };
      }),
    }
  )
);
*/
