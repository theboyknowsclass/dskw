import { useScreenDimensions } from './useScreenDimensions';

export const useLayout = () => {
  const {
    width: screenWidth,
    height: screenHeight,
    isLandscape,
  } = useScreenDimensions();

  const imagePreviewDimensions = {
    width: isLandscape ? screenWidth * 0.5 : screenWidth,
    height: isLandscape ? screenHeight : screenHeight * 0.7,
  };

  const zoomPreviewDimensions = {
    width: isLandscape ? screenWidth * 0.5 : screenWidth,
    height: isLandscape ? screenHeight : screenHeight * 0.3,
  };

  const logoDimensions = {
    width: isLandscape ? screenWidth * 0.35 : screenWidth * 0.8,
    height: isLandscape ? screenWidth * 0.35 : screenWidth * 0.8,
  };

  return { imagePreviewDimensions, zoomPreviewDimensions, logoDimensions };
};
