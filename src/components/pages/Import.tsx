import { Logo, ImagePickerButton } from '@molecules';
import { AppShellLayout } from '@templates';
import { View, StyleSheet } from 'react-native';
import { useScreenDimensions } from '@hooks';

export const Import: React.FC = () => {
  const { width, height } = useScreenDimensions();
  const logoSize = Math.min(width, height) * 0.6;

  return (
    <AppShellLayout>
      <View style={styles.container}>
        <Logo size={logoSize} />
        <ImagePickerButton />
      </View>
    </AppShellLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
