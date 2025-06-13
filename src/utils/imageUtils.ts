export const toBase64 = (image: string, extension: string = 'jpeg') => {
  if (image.startsWith('data:image/')) {
    return image;
  }
  return 'data:image/' + extension + ';base64,' + image;
};

/**
 * Removes the data URL prefix from a base64 string if present
 * @param base64 - The base64 string that may include a data URL prefix
 * @returns The clean base64 string without the data URL prefix
 */
export const cleanBase64 = (base64: string): string => {
  return base64.replace(/^data:image\/\w+;base64,/, '');
};
