import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import { OverlaySvg, OverlayGestureHandler } from '@molecules';
import { Dimensions } from '@types';

interface OverlayProps {
  dimensions: Dimensions;
  scale: number;
}

export const Overlay: React.FC<OverlayProps> = ({ dimensions, scale }) => {
  const [offset, setOffset] = useState({ xOffset: 0, yOffset: 0 });
  const containerRef = useRef<View>(null); // Ref to track the container's position

  const onContainerLayout = () => {
    containerRef.current?.measure((_, __, ___, ____, pageX, pageY) => {
      setOffset({ xOffset: pageX, yOffset: pageY });
    });
  };

  return (
    <View ref={containerRef} onLayout={onContainerLayout}>
      {/* SVG Layer (visual only) */}
      <OverlaySvg dimensions={dimensions} scale={scale} />

      {/* Separate interaction layer */}
      <OverlayGestureHandler
        offset={offset}
        dimensions={dimensions}
        scale={scale}
      />
    </View>
  );
};
