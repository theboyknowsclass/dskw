import { Dimensions } from '../types';
import { useScreenDimensions } from './useScreenDimensions';

type Layout = {
  imageMax: Dimensions;
  zoomView: Dimensions;
  logo: Dimensions;
};

export const useLayout = (): Layout => {
  const {
    width: screenWidth,
    height: screenHeight,
    isLandscape,
  } = useScreenDimensions();

  const imageMax = {
    width: isLandscape ? screenWidth * 0.4 : screenWidth * 0.8,
    height: isLandscape ? screenHeight * 0.8 : screenHeight * 0.4,
  };

  const zoomView = {
    width: Math.max(screenWidth, screenHeight) * 0.4,
    height: Math.max(screenWidth, screenHeight) * 0.4,
  };

  const logo = {
    width: isLandscape ? screenWidth * 0.35 : screenWidth * 0.8,
    height: isLandscape ? screenWidth * 0.35 : screenWidth * 0.8,
  };

  return {
    imageMax,
    zoomView,
    logo,
  };
};
