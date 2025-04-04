import React, { useMemo, useRef, useState } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useOverlayStore } from '@stores';
import { OverlaySvg, OverlayGestureHandler } from '@molecules';

type OverlayProps = {
  imageWidth: number;
  imageHeight: number;
  style?: StyleProp<ViewStyle>;
};

export const Overlay: React.FC<OverlayProps> = ({
  imageWidth,
  imageHeight,
  style,
}) => {
  const [containerSize, setContainerSize] = useState({ pageX: 0, pageY: 0 });
  const containerRef = useRef<View>(null); // Ref to track the container's position

  // Use a selector for better performance
  const points = useOverlayStore((state) => state.points);

  // Convert relative coordinates to screen coordinates
  const screenPoints = useMemo(() => {
    return points.map((point) => ({
      x: point.x * imageWidth,
      y: point.y * imageHeight,
    }));
  }, [points, imageWidth, imageHeight]);

  const onContainerLayout = () => {
    containerRef.current?.measure((_, __, ___, ____, pageX, pageY) => {
      setContainerSize({ pageX, pageY });
    });
  };

  return (
    <View
      ref={containerRef}
      style={[
        StyleSheet.absoluteFill,
        { width: imageWidth, height: imageHeight },
        style ?? null,
      ]}
      onLayout={onContainerLayout}
    >
      {/* SVG Layer (visual only) */}
      <OverlaySvg
        imageWidth={imageWidth}
        imageHeight={imageHeight}
        screenPoints={screenPoints}
      />

      {/* Separate interaction layer */}
      <OverlayGestureHandler
        imageWidth={imageWidth}
        imageHeight={imageHeight}
        screenPoints={screenPoints}
        containerSize={containerSize}
      />
    </View>
  );
};
