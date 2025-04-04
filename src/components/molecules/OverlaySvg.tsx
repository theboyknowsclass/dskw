import React, { useMemo } from 'react';
import { Svg, Polygon } from 'react-native-svg';
import { useTheme } from '@react-navigation/native';
import { useOverlayStore, useSourceImageStore } from '@stores';

export const OverlaySvg: React.FC = () => {
  const { colors } = useTheme();

  // Use selectors from the store for better performance
  const points = useOverlayStore((state) => state.points);
  const { width: imageWidth, height: imageHeight } = useSourceImageStore(
    (state) => state.scaledDimensions
  );

  // Convert relative coordinates to screen coordinates
  const polygonPoints = useMemo(() => {
    return points
      .map(({ x, y }) => `${x * imageWidth},${y * imageHeight}`)
      .join(' ');
  }, [points, imageWidth, imageHeight]);

  if (imageWidth === 0 || imageHeight === 0) {
    return null;
  }

  return (
    <Svg width={imageWidth} height={imageHeight}>
      <Polygon
        points={polygonPoints}
        fill="none"
        stroke={colors.primary}
        strokeWidth={2}
      />
    </Svg>
  );
};
