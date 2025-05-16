import { createContext, RefObject, useRef } from 'react';
import { GestureType } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/gesture';
import { makeMutable, SharedValue } from 'react-native-reanimated';

interface PanZoomContextType {
  isReady: boolean;
  scale: SharedValue<number>;
  panGesture: RefObject<GestureType | undefined>;
}

export const PanZoomContext = createContext<PanZoomContextType>({
  isReady: false,
} as PanZoomContextType);

interface PanZoomProviderProps {
  children: React.ReactNode;
}

export const PanZoomProvider: React.FC<PanZoomProviderProps> = ({
  children,
}) => {
  const panGesture = useRef<GestureType | undefined>(undefined);
  const scale = makeMutable(1);

  const value = {
    isReady: true,
    scale,
    panGesture,
  };

  return (
    <PanZoomContext.Provider value={value}>{children}</PanZoomContext.Provider>
  );
};
