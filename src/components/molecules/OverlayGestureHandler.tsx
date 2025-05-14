import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useOverlayStore } from '@stores';
import { Corner, Dimensions } from '@types';
import { TouchPoint } from '../atoms';

type OverlayGestureHandlerProps = {
  offset: { xOffset: number; yOffset: number };
  dimensions: Dimensions;
  scale: number;
};

export const OverlayGestureHandler: React.FC<OverlayGestureHandlerProps> = ({
  offset,
  dimensions,
  scale,
}) => {
  // Use selectors from the store for better performance
  const pointsLength = useOverlayStore((state) => state.points.length);

  const pointsIndices = useMemo(() => {
    return Array.from({ length: pointsLength }, (_, index) => index);
  }, [pointsLength]);

  return (
    <View style={styles.container}>
      {pointsIndices.map((_, index) => (
        <TouchPoint
          key={`point-${index}`}
          index={index as Corner}
          parentOffset={offset}
          parentDimensions={dimensions}
          scale={scale}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
