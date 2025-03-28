import { TextButton } from '@components';
import { ImagePickerService } from '@services';
import { useImageStore } from '@stores';
import { router } from 'expo-router';
import { StyleSheet } from 'react-native';

export const ImagePickerButton: React.FC = () => {
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
    <TextButton
      size="large"
      variant="outline"
      title="Start"
      loading={isLoading}
      disabled={isLoading}
      onPress={onStartPress}
      style={styles.button}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    width: 120,
  },
});
