import { useEffect } from 'react';
import { useThemeStore } from '../stores/useThemeStore';
import { useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { AsyncStorageService } from '../services/AsyncStorageService';

/**
 * Custom hook for managing the application theme following the Single Responsibility Principle.
 * This hook:
 * 1. Retrieves the stored theme from the theme store
 * 2. Determines the initial theme based on the device's color scheme
 * 3. Loads the stored theme or sets the default theme
 */
export const useTheme = () => {
  const colorScheme = useColorScheme();
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    const loadInitialData = async () => {
      const storedTheme = await AsyncStorageService.getStoredTheme();
      if (storedTheme) {
        setTheme(storedTheme);
        return;
      }

      if (colorScheme === 'dark') {
        setTheme(DarkTheme);
      } else {
        setTheme(DefaultTheme);
      }
    };

    loadInitialData();

    // disable reacting to colorScheme changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setTheme]);

  return theme;
};
