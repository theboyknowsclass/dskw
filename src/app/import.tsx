import { Logo } from '@molecules';
import { BaseLayout } from '@templates';
import { ImagePickerButton } from '@molecules';
import { View, StyleSheet } from 'react-native';
import { useScreenDimensions } from '@hooks';

export const Import = () => {
  const { width, height } = useScreenDimensions();
  const logoSize = Math.min(width, height) * 0.6;

  return (
    <BaseLayout>
      <View style={styles.container}>
        <Logo size={logoSize} />
        <ImagePickerButton />
      </View>
    </BaseLayout>
  );
};

export default Import;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
