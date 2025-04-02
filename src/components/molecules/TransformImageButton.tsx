import { IconButton } from '@atoms';
import { useTransformImage } from '@hooks';

export const TransformImageButton: React.FC = () => {
  const { handleProcess, isLoading, error } = useTransformImage();

  const onTransformImagePress = async () => {
    await handleProcess();
    if (error) {
      console.error(error);
    }
  };

  return (
    <IconButton
      key="transform-image"
      icon="done"
      accessibilityLabel="Transform Image"
      onPress={onTransformImagePress}
      loading={isLoading}
      disabled={isLoading}
    />
  );
};
