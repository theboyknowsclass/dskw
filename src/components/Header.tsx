import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemeToggle } from "./ThemeToggle";

// Interface for header props
interface HeaderProps {
  title: string;
  navigation: DrawerNavigationProp<any, any>;
}

/**
 * Header component with hamburger menu button and theme toggle
 * Follows the Single Responsibility Principle
 */
export const Header: React.FC<HeaderProps> = ({ title, navigation }) => {
  const { colors, isDarkTheme } = useTheme();
  const insets = useSafeAreaInsets();

  // Calculate proper padding based on platform and insets
  const getHeaderStyle = () => {
    return {
      backgroundColor: colors.background,
      borderBottomColor: colors.border,
      paddingTop:
        Platform.OS === "android"
          ? insets.top
          : insets.top > 0
          ? insets.top
          : 8,
    };
  };

  return (
    <View style={[styles.container, getHeaderStyle()]}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.openDrawer()}
        accessibilityRole="button"
        accessibilityLabel="Open menu"
      >
        {/* Simple hamburger menu icon */}
        <View style={styles.menuIconContainer}>
          <View
            style={[styles.menuIconBar, { backgroundColor: colors.text }]}
          />
          <View
            style={[styles.menuIconBar, { backgroundColor: colors.text }]}
          />
          <View
            style={[styles.menuIconBar, { backgroundColor: colors.text }]}
          />
        </View>
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
        {title}
      </Text>

      {/* Theme Toggle Button */}
      <ThemeToggle />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    ...Platform.select({
      android: {
        elevation: 4,
      },
    }),
  },
  menuButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  menuIconContainer: {
    width: 24,
    height: 18,
    justifyContent: "space-between",
  },
  menuIconBar: {
    width: "100%",
    height: 2,
    borderRadius: 1,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
