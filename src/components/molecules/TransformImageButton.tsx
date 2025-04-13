import { TextButton } from '@atoms';
import { useTransformImage } from '@hooks';
import { StyleSheet } from 'react-native';
export const TransformImageButton: React.FC = () => {
  const { handleProcess, isLoading, error } = useTransformImage();

  const onTransformImagePress = async () => {
    await handleProcess();
    if (error) {
      console.error(error);
    }
  };

  return (
    <TextButton
      key="transform-image"
      accessibilityLabel="Go"
      onPress={onTransformImagePress}
      loading={isLoading}
      disabled={isLoading}
      title="Go"
      variant="outline"
      style={styles.button}
      size="medium"
      textStyle={styles.text}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    paddingVertical: 28,
    paddingHorizontal: 28,
    borderWidth: 2,
    borderRadius: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
