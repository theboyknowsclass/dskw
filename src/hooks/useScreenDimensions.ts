import { useWindowDimensions } from 'react-native';

type ScreenDimensions = {
  width: number;
  height: number;
  isLandscape: boolean;
};

export const useScreenDimensions = (): ScreenDimensions => {
  const { width, height } = useWindowDimensions();
  return { width, height, isLandscape: width > height };
};
