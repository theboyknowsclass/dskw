import { useEffect } from 'react';
import { getStoredTheme, useThemeStore } from '../stores/useThemeStore';
import { useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';

export const useTheme = () => {
  const colorScheme = useColorScheme();
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    const loadInitialData = async () => {
      const storedTheme = await getStoredTheme();
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setTheme]);

  return theme;
};
