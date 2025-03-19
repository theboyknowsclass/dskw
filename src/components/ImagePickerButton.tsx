import React from 'react';
import { Button } from './Button';
import { useImagePicker } from '../hooks/useImagePicker';
import { useImageStore } from '../stores/useImageStore';

type ImagePickerButtonProps = {
  style?: any;
};

export const ImagePickerButton: React.FC<ImagePickerButtonProps> = ({
  style,
}) => {
  const { pickImage } = useImagePicker();
  const { uri, isLoading } = useImageStore();
  const hasSelectedImage = uri !== null;

  return (
    <Button
      variant={hasSelectedImage ? 'outline' : 'primary'}
      title="Select Image"
      onPress={pickImage}
      loading={isLoading}
      size="large"
      style={style}
    />
  );
};
