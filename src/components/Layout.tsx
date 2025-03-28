import { useScreenDimensions } from '@hooks/useScreenDimensions';
import { StyleSheet, View } from 'react-native';
import { IconButton } from './IconButton';
import { router } from 'expo-router';
import { useThemeStore } from '@stores/useThemeStore';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';

interface LayoutProps {
  children: React.ReactNode | React.ReactNode[];
  actionItems?: React.ReactNode | React.ReactNode[];
}

export const Layout: React.FC<LayoutProps> = ({ children, actionItems }) => {
  const { width, height, isLandscape, deviceType } = useScreenDimensions();
  const {
    setTheme,
    theme: { dark },
  } = useThemeStore();

  const showBackButton = router.canGoBack();

  const onBackButtonPress = () => {
    router.back();
  };

  const onSettingsButtonPress = () => {
    router.push('/settings');
  };

  const onThemeButtonPress = () => {
    setTheme(dark ? DefaultTheme : DarkTheme);
  };

  return (
    <View
      style={[
        styles.rootContainer,
        isLandscape ? styles.landscapeContainer : styles.portraitContainer,
      ]}
    >
      <View
        style={[
          styles.navigationBarBase,
          isLandscape ? styles.barLandscape : styles.barPortrait,
        ]}
      >
        <View style={styles.navigationBarPrimary}>
          {showBackButton && (
            <IconButton
              icon="arrow-back"
              onPress={onBackButtonPress}
              accessibilityLabel="Go Back"
              title=""
            />
          )}
        </View>
        <View
          style={[
            styles.navigationBarSecondary,
            isLandscape ? styles.barLandscape : styles.barPortrait,
          ]}
        >
          <IconButton
            icon={dark ? 'light-mode' : 'dark-mode'}
            onPress={onThemeButtonPress}
            accessibilityLabel={`Switch to ${dark ? 'light' : 'dark'} mode`}
            title=""
          />
          <IconButton
            icon="settings"
            onPress={onSettingsButtonPress}
            accessibilityLabel="Settings"
            title=""
          />
        </View>
      </View>
      <View style={styles.contentContainer}>{children}</View>
      {actionItems && (
        <View
          style={[
            styles.actionBarBase,
            isLandscape ? styles.barLandscape : styles.barPortrait,
          ]}
        >
          {actionItems}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
  },
  portraitContainer: {
    flexDirection: 'column',
  },
  landscapeContainer: {
    flexDirection: 'row',
  },
  contentContainer: {
    flex: 1,
    margin: 10,
  },
  navigationBarBase: {
    display: 'flex',
    flexGrow: 0,
    padding: 10,
    gap: 10,
  },
  navigationBarPrimary: {
    flexGrow: 1,
    gap: 10,
  },
  navigationBarSecondary: {
    display: 'flex',
    flexGrow: 0,
    gap: 10,
  },
  actionBarBase: {
    display: 'flex',
    flexGrow: 0,
    justifyContent: 'space-evenly',
    padding: 10,
  },
  barPortrait: {
    flexDirection: 'row',
  },
  barLandscape: {
    flexDirection: 'column',
  },
});
