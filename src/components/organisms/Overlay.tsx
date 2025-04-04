import React, { useRef, useState } from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { OverlaySvg, OverlayGestureHandler } from '@molecules';

type OverlayProps = {
  style?: StyleProp<ViewStyle>;
};

export const Overlay: React.FC<OverlayProps> = ({ style }) => {
  const [containerSize, setContainerSize] = useState({ pageX: 0, pageY: 0 });
  const containerRef = useRef<View>(null); // Ref to track the container's position

  const onContainerLayout = () => {
    containerRef.current?.measure((_, __, ___, ____, pageX, pageY) => {
      setContainerSize({ pageX, pageY });
    });
  };

  return (
    <View
      ref={containerRef}
      style={[
        // Note: The absoluteFill and explicit dimensions were commented out by user
        // StyleSheet.absoluteFill,
        // { width: imageWidth, height: imageHeight },
        style ?? null,
      ]}
      onLayout={onContainerLayout}
    >
      {/* SVG Layer (visual only) */}
      <OverlaySvg />

      {/* Separate interaction layer */}
      <OverlayGestureHandler containerSize={containerSize} />
    </View>
  );
};
