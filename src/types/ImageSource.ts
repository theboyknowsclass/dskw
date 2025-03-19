import { Dimensions } from './Dimensions';

/**
 * Represents an image source with its URI and dimensions.
 * @property uri - The URI of the image
 * @property dimensions - The dimensions of the image
 */
export type ImageSource = {
  uri: string | null;
  dimensions: Dimensions;
  // extension: string;
};
