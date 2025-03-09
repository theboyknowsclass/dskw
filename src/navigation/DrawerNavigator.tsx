import React from "react";
import { View, Text, StyleSheet, Platform, Dimensions } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { HomeScreen } from "../screens/HomeScreen";
import { AboutScreen } from "../screens/AboutScreen";
import { ProcessImageScreen } from "../screens/ProcessImageScreen";
import { useTheme } from "../contexts/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemeToggle } from "../components/ThemeToggle";

// Create drawer navigator
const Drawer = createDrawerNavigator();

// Screen dimensions for responsive sizing
const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Determine drawer width based on platform and screen size
const getDrawerWidth = () => {
  if (Platform.OS === "web") {
    return Math.min(320, SCREEN_WIDTH * 0.7); // Cap at 320px or 70% of screen width, whichever is smaller
  }
  return "70%"; // Default for mobile
};

/**
 * Custom drawer content component
 */
const CustomDrawerContent = (props: any) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        paddingTop: insets.top > 0 ? 0 : 16, // Only add padding if there's no inset
      }}
      style={{ backgroundColor: colors.background }}
    >
      <View style={[styles.drawerHeader, { backgroundColor: colors.primary }]}>
        <Text style={styles.drawerHeaderText}>Image Picker App</Text>
      </View>

      <DrawerItemList
        {...props}
        activeTintColor={colors.primary}
        inactiveTintColor={colors.text}
      />

      <View
        style={[styles.drawerSeparator, { backgroundColor: colors.border }]}
      />

      {/* Theme toggle component */}
      <View style={styles.themeToggleContainer}>
        <Text style={[styles.themeToggleTitle, { color: colors.text }]}>
          Appearance
        </Text>
        <ThemeToggle />
      </View>

      <View style={[styles.drawerFooter, { borderTopColor: colors.border }]}>
        <Text style={[styles.footerText, { color: colors.text }]}>
          © 2025 SOLID App
        </Text>
      </View>
    </DrawerContentScrollView>
  );
};

/**
 * Drawer Navigator component
 * This follows the Open/Closed principle by allowing easy extension with more screens
 */
export const AppDrawerNavigator = () => {
  const { colors, isDarkTheme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.text,
        drawerStyle: {
          backgroundColor: colors.background,
          width: getDrawerWidth(),
          paddingLeft: insets.left,
          paddingBottom: insets.bottom,
        },
        // Use front for web to prevent drawer from appearing on resize
        drawerType: Platform.OS === "web" ? "front" : "slide",
        overlayColor: isDarkTheme ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.5)",
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerLabel: "Home",
        }}
      />
      <Drawer.Screen
        name="ProcessImage"
        component={ProcessImageScreen}
        options={{
          drawerLabel: "Process Image",
          // Hide from drawer but allow navigation to it
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="About"
        component={AboutScreen}
        options={{
          drawerLabel: "About",
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    height: 120,
    justifyContent: "flex-end",
    padding: 16,
    marginBottom: 8,
  },
  drawerHeaderText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  drawerSeparator: {
    height: 1,
    marginVertical: 16,
    marginHorizontal: 16,
  },
  themeToggleContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  themeToggleTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  drawerFooter: {
    padding: 16,
    borderTopWidth: 1,
    marginTop: "auto",
  },
  footerText: {
    fontSize: 12,
    textAlign: "center",
  },
});
