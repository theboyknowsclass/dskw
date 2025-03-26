import { TextButton } from '@components/TextButton';
import { Logo } from '@components/Logo';
import { View, StyleSheet } from 'react-native';
import { ImagePickerService } from '@services/ImagePickerService';
import { useImageStore } from '@stores/useImageStore';
import { router } from 'expo-router';

export const Import = () => {
  const { isLoading, setLoading, setUri, setOriginalDimensions } =
    useImageStore();

  const onStart = async () => {
    setLoading(true);
    try {
      const { success, error, data } = await ImagePickerService.selectImage();
      if (success && data) {
        const { uri, dimensions } = data;
        setUri(uri);
        setOriginalDimensions(dimensions);
        router.navigate('edit2');
        return;
      }
      console.warn(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Logo />
      <TextButton
        size="large"
        variant="outline"
        title="Start"
        loading={isLoading}
        onPress={onStart}
        style={styles.button}
      />
    </View>
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
