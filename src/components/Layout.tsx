import { useScreenDimensions } from '@hooks/useScreenDimensions';
import { StyleSheet, View } from 'react-native';
import { BackButton } from './BackButton';
import { SettingsButton } from './SettingsButton';
import { ThemeToggle } from './ThemeToggle';

interface BaseLayoutProps {
  children?: React.ReactNode | React.ReactNode[];
  actionItems?: React.ReactNode | React.ReactNode[];
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({
  children,
  actionItems,
}) => {
  const { isLandscape } = useScreenDimensions();

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
          <BackButton />
        </View>
        <View
          style={[
            styles.navigationBarSecondary,
            isLandscape ? styles.barLandscape : styles.barPortrait,
          ]}
        >
          <ThemeToggle />
          <SettingsButton />
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
