import { ImagePickerButton } from '@molecules';
import { PageTemplate } from '@templates';
import { View, StyleSheet } from 'react-native';
import { useScreenDimensions } from '@hooks';
import { Logo2 } from '@components/molecules/Logo2';

export const Import: React.FC = () => {
  const { width, height } = useScreenDimensions();
  const logoSize = Math.min(width, height) * 0.6;

  return (
    <PageTemplate>
      <View style={styles.container}>
        <Logo2 size={logoSize} />
        <ImagePickerButton />
      </View>
    </PageTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
