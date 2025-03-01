import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

export const ThemeToggle: React.FC = () => {
  const { isDarkTheme, toggleTheme, colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.themeButton, { backgroundColor: "transparent" }]}
      onPress={toggleTheme}
      accessibilityLabel="Toggle dark mode"
    >
      <Ionicons
        name={isDarkTheme ? "moon" : "sunny"}
        size={24}
        color={colors.text}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  themeButton: {
    padding: 8,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
