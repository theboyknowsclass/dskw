import { BackButton, SettingsButton, ThemeToggle } from '@molecules';
import { useScreenDimensions } from '@hooks';
import { View, StyleSheet, ViewStyle } from 'react-native';

export const NavigationBar: React.FC = () => {
  const { isLandscape } = useScreenDimensions();

  const navigationBarStyles = [
    styles.navigationBarBase,
    getNavigationBarStyles(isLandscape),
  ];

  const navigationBarPrimaryStyles = [
    styles.navigationBarPrimary,
    getNavigationBarStyles(isLandscape),
  ];

  const navigationBarSecondaryStyles = [
    styles.navigationBarSecondary,
    getNavigationBarStyles(isLandscape),
  ];

  return (
    <View style={navigationBarStyles}>
      <View style={navigationBarPrimaryStyles}>
        <BackButton />
      </View>
      <View style={navigationBarSecondaryStyles}>
        <ThemeToggle />
        <SettingsButton />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navigationBarBase: {
    display: 'flex',
    flexGrow: 0,
    padding: 16,
    gap: 16,
  },
  navigationBarPrimary: {
    flexGrow: 1,
    gap: 16,
  },
  navigationBarSecondary: {
    display: 'flex',
    flexGrow: 0,
    gap: 16,
  },
});

const getNavigationBarStyles = (isLandscape: boolean): ViewStyle => {
  return {
    flexDirection: isLandscape ? 'column' : 'row',
  };
};
