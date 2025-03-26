import { useWindowDimensions } from 'react-native';
import { DeviceType, deviceType } from 'expo-device';

type ScreenDimensions = {
  width: number;
  height: number;
  isLandscape: boolean;
  deviceType: DeviceType | null;
};

export const useScreenDimensions = (): ScreenDimensions => {
  const { width, height } = useWindowDimensions();
  return { width, height, isLandscape: width > height, deviceType };
};
