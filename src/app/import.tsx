import { TextButton } from '@components';
import { Logo } from '@components';
import { View, StyleSheet } from 'react-native';
import { ImagePickerService } from '@services';
import { useImageStore } from '@stores';
import { router } from 'expo-router';
import { BaseLayout } from '@components';

export const Import = () => {
  const { isLoading, setLoading, setUri, setOriginalDimensions } =
    useImageStore();

  const onStartPress = async () => {
    setLoading(true);
    try {
      const { success, error, data } = await ImagePickerService.selectImage();
      if (success && data) {
        const { uri, dimensions } = data;
        setUri(uri);
        setOriginalDimensions(dimensions);
        router.navigate('edit');
        return;
      }
      console.warn(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseLayout>
      <View style={styles.container}>
        <Logo size={200} />
        <TextButton
          size="large"
          variant="outline"
          title="Start"
          loading={isLoading}
          onPress={onStartPress}
          style={styles.button}
        />
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
  button: { width: 120 },
});
