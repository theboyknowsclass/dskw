import { useScreenDimensions } from '@hooks';
import { StyleSheet, View } from 'react-native';
import { BackButton } from './buttons/BackButton';
import { SettingsButton } from './buttons/SettingsButton';
import { ThemeToggle } from './buttons/ThemeToggle';

interface BaseLayoutProps {
  children?: React.ReactNode | React.ReactNode[];
  actionItems?: React.ReactNode | React.ReactNode[];
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({
  children,
  actionItems,
}) => {
  const { isLandscape } = useScreenDimensions();

  const rootContainerStyles = [
    styles.rootContainer,
    isLandscape ? styles.landscapeContainer : styles.portraitContainer,
  ];

  const navigationBarStyles = [
    styles.navigationBarBase,
    isLandscape ? styles.barLandscape : styles.barPortrait,
  ];

  const navigationBarPrimaryStyles = [
    styles.navigationBarPrimary,
    isLandscape ? styles.barLandscape : styles.barPortrait,
  ];

  const navigationBarSecondaryStyles = [
    styles.navigationBarSecondary,
    isLandscape ? styles.barLandscape : styles.barPortrait,
  ];

  const actionBarStyles = [
    styles.actionBarBase,
    isLandscape ? styles.barLandscape : styles.barPortrait,
  ];

  return (
    <View style={rootContainerStyles}>
      <View style={navigationBarStyles}>
        <View style={navigationBarPrimaryStyles}>
          <BackButton />
        </View>
        <View style={navigationBarSecondaryStyles}>
          <ThemeToggle />
          <SettingsButton />
        </View>
      </View>
      <View style={styles.contentContainer}>{children}</View>
      {actionItems && <View style={actionBarStyles}>{actionItems}</View>}
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
