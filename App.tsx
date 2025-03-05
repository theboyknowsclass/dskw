import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { ThemeProvider, useTheme } from "./src/contexts/ThemeContext";
import { AppDrawerNavigator } from "./src/navigation/DrawerNavigator";

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

  return (
    <GestureHandlerRootView style={styles.container}>
      <NavigationContainer theme={theme}>
        <StatusBar style={isDarkTheme ? "light" : "dark"} />
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
  },
});
