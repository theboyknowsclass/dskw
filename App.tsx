import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, Platform } from 'react-native';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { AppDrawerNavigator } from './src/navigation/DrawerNavigator';

// Apply global styles for web platform
if (Platform.OS === 'web') {
  // Create a style element
  const style = document.createElement('style');
  // Remove all unwanted borders and lines
  style.textContent = `
    * {
      box-sizing: border-box;
    }
    body, html {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow-x: hidden;
    }
    div, nav, header {
      border: none !important;
      border-width: 0 !important;
      border-bottom-width: 0 !important;
      border-top-width: 0 !important;
      box-shadow: none !important;
    }
  `;
  // Add the style to the document head
  document.head.appendChild(style);
}

/**
 * App Content component wrapped with theme context
 * This follows the Dependency Inversion Principle by depending on abstractions
 */
const AppContent = () => {
  const { isDarkTheme, colors } = useTheme();

  // Create a theme that extends the default theme but with our custom colors
  const theme = {
    ...(isDarkTheme ? DarkTheme : DefaultTheme),
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.secondary,
      text: colors.text,
      border: colors.border,
      notification: colors.accent,
    },
  };

  // Add an effect to update the document's body style on web
  useEffect(() => {
    if (Platform.OS === 'web') {
      document.body.style.backgroundColor = colors.background;
    }
  }, [colors.background]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <NavigationContainer theme={theme}>
        <StatusBar style={isDarkTheme ? 'light' : 'dark'} />
        <AppDrawerNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

/**
 * Main App component that sets up the foundational providers
 */
export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 0,
  },
});
