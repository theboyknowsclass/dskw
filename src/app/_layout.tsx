import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { ThemeProvider } from '@react-navigation/native';

import { DrawerNavigation } from '../navigation/DrawerNavigation';
import { useTheme } from '../hooks/useTheme';

/**
 * Root layout component that sets up the app's navigation drawer and theme handling.
 * This component wraps the entire app and provides theme context to all child components.
 */
export default function HomeLayout() {
  const theme = useTheme();

  return (
    <ThemeProvider value={theme}>
      {/* GestureHandlerRootView is required for gesture handling in React Native */}
      <GestureHandlerRootView style={styles.container}>
        <DrawerNavigation />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

// Styles for the layout components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 0,
  },
});
