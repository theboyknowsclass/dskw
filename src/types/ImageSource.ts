import { Dimensions } from './Dimensions';
import { ExifTags } from '@lodev09/react-native-exify';

/**
 * Represents an image source with its URI and dimensions.
 * @property uri - The URI of the image
 * @property dimensions - The dimensions of the image
 */
export type ImageSource = {
  uri: string | null;
  dimensions: Dimensions;
  tags: ExifTags | null;
};

export const DefaultSourceImage: ImageSource = {
  uri: null,
  dimensions: { width: 0, height: 0 },
  tags: null,
};

export const IsDefaultSourceImage = (sourceImage: ImageSource) => {
  return (
    sourceImage.uri === null &&
    sourceImage.dimensions.width === 0 &&
    sourceImage.dimensions.height === 0 &&
    sourceImage.tags === null
  );
};
