import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import { OverlaySvg, OverlayGestureHandler } from '@molecules';

export const Overlay: React.FC = () => {
  const [containerSize, setContainerSize] = useState({ pageX: 0, pageY: 0 });
  const containerRef = useRef<View>(null); // Ref to track the container's position

  const onContainerLayout = () => {
    containerRef.current?.measure((_, __, ___, ____, pageX, pageY) => {
      setContainerSize({ pageX, pageY });
    });
  };

  return (
    <View ref={containerRef} onLayout={onContainerLayout}>
      {/* SVG Layer (visual only) */}
      <OverlaySvg />

      {/* Separate interaction layer */}
      <OverlayGestureHandler containerSize={containerSize} />
    </View>
  );
};
