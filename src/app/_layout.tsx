import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { ThemeProvider } from '@react-navigation/native';

import { DrawerNavigation } from '../navigation/DrawerNavigation';
import { useTheme } from '../hooks/useTheme';
import { ErrorBoundary } from '../components/ErrorBoundary';

import {
  Orbitron_400Regular,
  Orbitron_500Medium,
  Orbitron_600SemiBold,
  Orbitron_700Bold,
  Orbitron_800ExtraBold,
  Orbitron_900Black,
  useFonts,
} from '@expo-google-fonts/orbitron';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

/**
 * Root layout component that sets up the app's navigation drawer and theme handling.
 * This component wraps the entire app and provides theme context to all child components.
 */
export default function HomeLayout() {
  const [loaded, error] = useFonts({
    Orbitron_400Regular,
    Orbitron_500Medium,
    Orbitron_600SemiBold,
    Orbitron_700Bold,
    Orbitron_800ExtraBold,
    Orbitron_900Black,
  });
  const theme = useTheme();

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider value={theme}>
        {/* GestureHandlerRootView is required for gesture handling in React Native */}
        <GestureHandlerRootView style={styles.container}>
          <DrawerNavigation />
        </GestureHandlerRootView>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

// Styles for the layout components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 0,
  },
});
