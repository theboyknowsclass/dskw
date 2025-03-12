import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../stores/useThemeStore';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';

export const ThemeToggle: React.FC = () => {
  const {
    setTheme,
    theme: { colors, dark },
  } = useThemeStore();

  const toggleTheme = () => {
    setTheme(dark ? DefaultTheme : DarkTheme);
  };

  return (
    <TouchableOpacity
      style={styles.themeButton}
      onPress={toggleTheme}
      accessibilityLabel={`Switch to ${dark ? 'light' : 'dark'} mode`}
    >
      <Ionicons name={dark ? 'sunny' : 'moon'} size={24} color={colors.text} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  themeButton: {
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
