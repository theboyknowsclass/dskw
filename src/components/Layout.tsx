import { useScreenDimensions } from '@hooks/useScreenDimensions';
import { StyleSheet, View } from 'react-native';

interface LayoutProps {
  children: React.ReactNode | React.ReactNode[];
  actionItems?: React.ReactNode | React.ReactNode[];
}

export const Layout: React.FC<LayoutProps> = ({ children, actionItems }) => {
  const { width, height, isLandscape, deviceType } = useScreenDimensions();

  return (
    <View
      style={[
        styles.rootContainer,
        isLandscape ? styles.landscapeContainer : styles.portraitContainer,
      ]}
    >
      <View style={styles.contentContainer}>{children}</View>
      {actionItems && (
        <View
          style={[
            styles.actionBarBase,
            isLandscape ? styles.actionBarLandscape : styles.actionBarPortrait,
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
    padding: 50,
  },
  actionBarBase: {
    display: 'flex',
    flexGrow: 0,
    justifyContent: 'space-evenly',
  },
  actionBarPortrait: {
    flexDirection: 'row',
  },
  actionBarLandscape: {
    flexDirection: 'column',
  },
});
