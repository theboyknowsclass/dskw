import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useTheme } from "../contexts/ThemeContext";
import { Header } from "../components/Header";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Define the navigation props type
type AboutScreenProps = {
  navigation: DrawerNavigationProp<any, any>;
};

/**
 * About screen component
 * Follows the Liskov Substitution Principle by being interchangeable with other screens
 */
export const AboutScreen: React.FC<AboutScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {/* Header with hamburger menu */}
      <Header title="About" navigation={navigation} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: Math.max(20, insets.bottom) },
        ]}
      >
        <Text style={[styles.heading, { color: colors.text }]}>
          About This App
        </Text>

        <Text style={[styles.paragraph, { color: colors.text }]}>
          This application is designed as a cross-platform image picker
          demonstration that follows SOLID principles:
        </Text>

        <Text style={[styles.subheading, { color: colors.primary }]}>
          Single Responsibility Principle
        </Text>
        <Text style={[styles.paragraph, { color: colors.text }]}>
          Each class has only one reason to change. For example, our
          ImagePickerService only handles image selection logic.
        </Text>

        <Text style={[styles.subheading, { color: colors.primary }]}>
          Open/Closed Principle
        </Text>
        <Text style={[styles.paragraph, { color: colors.text }]}>
          Components like Button are open for extension but closed for
          modification, allowing new functionality without changing existing
          code.
        </Text>

        <Text style={[styles.subheading, { color: colors.primary }]}>
          Liskov Substitution Principle
        </Text>
        <Text style={[styles.paragraph, { color: colors.text }]}>
          Screen components can be substituted without affecting the behavior of
          the app. They all have the same base props structure.
        </Text>

        <Text style={[styles.subheading, { color: colors.primary }]}>
          Interface Segregation Principle
        </Text>
        <Text style={[styles.paragraph, { color: colors.text }]}>
          Components only depend on interfaces they use. For example, each
          component only receives the props it needs.
        </Text>

        <Text style={[styles.subheading, { color: colors.primary }]}>
          Dependency Inversion Principle
        </Text>
        <Text style={[styles.paragraph, { color: colors.text }]}>
          High-level modules depend on abstractions, not concrete
          implementations. Our hooks and components depend on interfaces rather
          than specific implementations.
        </Text>

        <Text style={[styles.version, { color: colors.text }]}>
          Version 1.0.0
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subheading: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  version: {
    marginTop: 30,
    fontSize: 14,
    textAlign: "center",
    opacity: 0.7,
  },
});
