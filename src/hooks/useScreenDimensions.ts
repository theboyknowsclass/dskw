import { useWindowDimensions } from 'react-native';
import { DeviceType, deviceType } from 'expo-device';

type ScreenDimensions = {
  width: number;
  height: number;
  isLandscape: boolean;
  isMobile: boolean;
};

export const useScreenDimensions = (): ScreenDimensions => {
  const { width, height } = useWindowDimensions();
  const isMobile = deviceType === DeviceType.PHONE;
  return { width, height, isLandscape: width > height, isMobile };
};
