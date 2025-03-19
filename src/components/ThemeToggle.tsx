import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore } from '../stores/useThemeStore';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Button } from './Button';

/**
 * A toggle button component that switches between light and dark themes.
 * Uses the Button component with an icon variant for consistent styling.
 */
export const ThemeToggle: React.FC = () => {
  const {
    setTheme,
    theme: { colors, dark },
  } = useThemeStore();

  const toggleTheme = () => {
    setTheme(dark ? DefaultTheme : DarkTheme);
  };

  return (
    <Button
      variant="iconButton"
      icon={
        <MaterialIcons
          name={dark ? 'light-mode' : 'dark-mode'}
          size={24}
          color={colors.primary}
        />
      }
      onPress={toggleTheme}
      accessibilityLabel={`Switch to ${dark ? 'light' : 'dark'} mode`}
      title=""
    />
  );
};
