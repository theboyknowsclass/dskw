import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { useThemeStore, ThemeType } from "../store/themeStore";

// Define theme colors
export interface ThemeColors {
  background: string;
  text: string;
  primary: string;
  secondary: string;
  accent: string;
  border: string;
  error: string;
  success: string;
}

// Define light and dark theme colors
export const lightTheme: ThemeColors = {
  background: "#FFFFFF",
  text: "#121212",
  primary: "#3498db",
  secondary: "#2ecc71",
  accent: "#e74c3c",
  border: "#e0e0e0",
  error: "#e74c3c",
  success: "#2ecc71",
};

export const darkTheme: ThemeColors = {
  background: "#121212",
  text: "#FFFFFF",
  primary: "#2980b9",
  secondary: "#27ae60",
  accent: "#c0392b",
  border: "#333333",
  error: "#c0392b",
  success: "#27ae60",
};

// Define the context shape
interface ThemeContextType {
  colors: ThemeColors;
  isDarkTheme: boolean;
  themeType: ThemeType;
  toggleTheme: () => void;
  setThemeType: (theme: ThemeType) => void;
}

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme() as "light" | "dark";
  const { theme, setTheme } = useThemeStore();
  const [colors, setColors] = useState<ThemeColors>(
    systemColorScheme === "dark" ? darkTheme : lightTheme
  );
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(
    systemColorScheme === "dark"
  );
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // On first load, determine the theme based on system preference or saved preference
  useEffect(() => {
    // First-time setup: If theme is 'system', apply the system preference as the actual theme
    if (theme === "system") {
      setIsDarkTheme(systemColorScheme === "dark");
      setColors(systemColorScheme === "dark" ? darkTheme : lightTheme);
    } else {
      // Use saved preference
      setIsDarkTheme(theme === "dark");
      setColors(theme === "dark" ? darkTheme : lightTheme);
    }
    setIsInitialized(true);
  }, [systemColorScheme, theme]);

  // When theme changes in store, update the UI
  useEffect(() => {
    if (isInitialized) {
      setIsDarkTheme(theme === "dark");
      setColors(theme === "dark" ? darkTheme : lightTheme);
    }
  }, [theme, isInitialized]);

  // Simple toggle between light and dark
  const toggleTheme = () => {
    const newTheme: ThemeType = isDarkTheme ? "light" : "dark";
    setTheme(newTheme);
  };

  // Set a specific theme type (mainly for internal use)
  const setThemeType = (newTheme: ThemeType) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        colors,
        isDarkTheme,
        themeType: theme,
        toggleTheme,
        setThemeType,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
