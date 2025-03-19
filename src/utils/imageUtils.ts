export const toBase64 = (image: string, extension: string = 'jpeg') => {
  if (image.startsWith('data:image/')) {
    return image;
  }
  return 'data:image/' + extension + ';base64,' + image;
};
