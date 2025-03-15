import { useTheme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { ThemeToggle } from '../components/ThemeToggle';

export const DrawerNavigation = () => {
  const theme = useTheme();

  return (
    <Drawer
      screenOptions={{
        // Ensure drawer background matches current theme
        drawerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerStyle: {
          backgroundColor: theme.colors.background,
          borderBottomWidth: 0,
        },
        overlayColor: theme.dark
          ? styles.drawerOverlayDark.backgroundColor
          : styles.drawerOverlayLight.backgroundColor,
        // Add theme toggle button to the header
        headerRight: () => <ThemeToggle />,
        headerTitle: 'DSKW',
        headerTitleAlign: 'center',
      }}
    />
  );
};

const styles = StyleSheet.create({
  drawerOverlayDark: {
    backgroundColor: 'rgba(33, 33, 33, 0.6)',
  },
  drawerOverlayLight: {
    backgroundColor: 'rgba( 220, 220, 220, 0.6)',
  },
});
