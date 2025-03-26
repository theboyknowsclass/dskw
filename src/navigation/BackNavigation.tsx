import { BackButton } from '@components/BackButton';
import { router } from 'expo-router';
import { View, StyleSheet } from 'react-native';

type BackNavigationProps = {
  position?: 'topLeft' | 'bottomLeft';
};

const BackNavigation = ({ position = 'topLeft' }: BackNavigationProps) => {
  const canGoBack = router.canGoBack();
  return canGoBack ? (
    <View style={styles[position]}>
      <BackButton size="small" showBorder={false} />
    </View>
  ) : null;
};

export default BackNavigation;

const styles = StyleSheet.create({
  topLeft: {
    position: 'absolute',
    top: 48,
    left: 10,
  },
  bottomLeft: {
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
});
