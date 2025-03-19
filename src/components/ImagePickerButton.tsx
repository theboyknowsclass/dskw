import React from 'react';
import { Button } from './Button';
import { useImagePicker } from '../hooks/useImagePicker';
import { useImageStore } from '../stores/useImageStore';

type ImagePickerButtonProps = {
  width: number;
  height: number;
  style?: any;
};

export const ImagePickerButton: React.FC<ImagePickerButtonProps> = ({
  width,
  height,
  style,
}) => {
  const { pickImage } = useImagePicker(width, height);
  const { uri, isLoading } = useImageStore();
  const hasSelectedImage = uri !== null;

  return (
    <Button
      variant={hasSelectedImage ? 'outline' : 'primary'}
      title="Select Image"
      onPress={pickImage}
      loading={isLoading}
      size="large"
      buttonStyle={style}
    />
  );
};
