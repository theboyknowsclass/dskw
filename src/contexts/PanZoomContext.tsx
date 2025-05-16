import { createContext, useState, createRef, RefObject } from 'react';
import { GestureType } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/gesture';
import { makeMutable, SharedValue } from 'react-native-reanimated';

const panGesture = createRef<GestureType>();
const scale = makeMutable(1);

interface PanZoomContextType {
  scale: SharedValue<number>;
  gesturesEnabled: boolean;
  panGesture: RefObject<GestureType | null>;
  setGesturesEnabled: (enabled: boolean) => void;
}

export const PanZoomContext = createContext<PanZoomContextType>({
  scale: scale,
  gesturesEnabled: true,
  panGesture,
  setGesturesEnabled: () => {},
});

interface PanZoomProviderProps {
  children: React.ReactNode;
}

export const PanZoomProvider: React.FC<PanZoomProviderProps> = ({
  children,
}) => {
  const [gesturesEnabled, setGesturesEnabled] = useState(true);

  const value = {
    scale,
    panGesture,
    gesturesEnabled,
    setGesturesEnabled,
  };

  return (
    <PanZoomContext.Provider value={value}>{children}</PanZoomContext.Provider>
  );
};
