import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeToggle } from './ThemeToggle';

// Get screen dimensions for responsive sizing
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Interface for header props
interface HeaderProps {
  navigation: DrawerNavigationProp<any, any>;
  title?: string;
}

/**
 * Header component with hamburger menu button and theme toggle
 * Follows the Single Responsibility Principle
 */
export const Header: React.FC<HeaderProps> = ({ navigation, title }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  // Check if we're on a wide screen
  const isWideScreen = SCREEN_WIDTH > 768;

  // Calculate proper padding based on platform and insets
  const headerStyle = {
    backgroundColor: colors.background,
    paddingTop:
      Platform.OS === 'android' ? insets.top : insets.top > 0 ? insets.top : 8,
  };

  // Dynamic container style
  const containerStyle = [
    styles.container,
    headerStyle,
    isWideScreen ? styles.wideContainer : null,
  ];

  return (
    <View
      style={[styles.headerWrapper, { backgroundColor: colors.background }]}
    >
      <View style={containerStyle}>
        {/* Left section with menu button */}
        <View style={styles.leftSection}>
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
        </View>

        {/* Middle section with title */}
        <View style={styles.middleSection}>
          {title ? (
            <Text
              style={[styles.title, { color: colors.text }]}
              numberOfLines={1}
            >
              {title}
            </Text>
          ) : (
            <View style={styles.spacer} />
          )}
        </View>

        {/* Right section with theme toggle */}
        <View style={styles.rightSection}>
          <ThemeToggle />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    borderBottomWidth: 0,
    borderColor: 'transparent',
    // Remove all shadow and elevation that might create lines
    ...Platform.select({
      android: {
        elevation: 0,
      },
      ios: {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
      },
      web: {
        boxShadow: 'none',
      },
    }),
  },
  container: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    borderWidth: 0,
    borderBottomWidth: 0,
    borderColor: 'transparent',
  },
  wideContainer: {
    maxWidth: 1200,
    alignSelf: 'center',
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  middleSection: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  menuButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconContainer: {
    width: 24,
    height: 18,
    justifyContent: 'space-between',
  },
  menuIconBar: {
    width: '100%',
    height: 2,
    borderRadius: 1,
  },
  spacer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
