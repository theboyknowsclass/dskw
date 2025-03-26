import React from 'react';
import { TextButton } from './TextButton';
import { useImagePicker } from '../hooks/useImagePicker';
import { useImageStore } from '../stores/useImageStore';
import { StyleProp, ViewStyle } from 'react-native';

type ImagePickerButtonProps = {
  style?: StyleProp<ViewStyle>;
};

export const ImagePickerButton: React.FC<ImagePickerButtonProps> = ({
  style,
}) => {
  const { pickImage } = useImagePicker();
  const { uri, isLoading } = useImageStore();
  const hasSelectedImage = uri !== null;

  return (
    <TextButton
      variant={hasSelectedImage ? 'outline' : 'primary'}
      title="Select Image"
      onPress={pickImage}
      loading={isLoading}
      size="large"
      style={style}
    />
  );
};
