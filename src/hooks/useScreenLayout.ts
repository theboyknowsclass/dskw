import { useScreenDimensions } from './useScreenDimensions';
import { StyleSheet } from 'react-native';

// This hook is used to get the layout of the screen
// we have the screen in 3 parts
// navigation - this contains the menu button and back button
// main content - this contains the main content of the screen
// action bar - this contains the actions if any
//
// it also responds to the device type and orientation

export const useScreenLayout = () => {
  const { width, height, isLandscape, deviceType } = useScreenDimensions();

  const navigation = {
    width: isLandscape ? height * 0.1 : width * 0.1,
    height: isLandscape ? width * 0.1 : height * 0.1,
  };

  const mainContent = {
    width: isLandscape ? height * 0.8 : width * 0.8,
    height: isLandscape ? width * 0.8 : height * 0.8,
  };

  const actionBar = {
    width: isLandscape ? height * 0.1 : width * 0.1,
    height: isLandscape ? width * 0.1 : height * 0.1,
  };

  const actionBarContainerStyle = isLandscape
    ? [styles.actionBarBase, styles.flexColumn]
    : [styles.actionBarBase, styles.flexRow];

  const rootContainerStyle = isLandscape
    ? [styles.rootContainer, styles.flexRow]
    : [styles.rootContainer, styles.flexColumn];

  return {
    navigation,
    mainContent,
    actionBar,
    actionBarContainerStyle,
    rootContainerStyle,
  };
};

const styles = StyleSheet.create({
  rootContainer: {
    width: '100%',
    height: '100%',
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexColumn: {
    flexDirection: 'column',
  },
  actionBarBase: {
    display: 'flex',
    flexGrow: 0,
    justifyContent: 'space-evenly',
  },
});
