import React, { useMemo } from 'react';
import { Svg, Polygon } from 'react-native-svg';
import { useTheme } from '@react-navigation/native';
import { useOverlayStore } from '@stores';
import { Dimensions } from '@types';

interface OverlaySvgProps {
  dimensions: Dimensions;
  scale: number;
}

export const OverlaySvg: React.FC<OverlaySvgProps> = ({
  dimensions,
  scale,
}) => {
  const { colors } = useTheme();

  // Use selectors from the store for better performance
  const points = useOverlayStore((state) => state.points);
  const { width: imageWidth, height: imageHeight } = dimensions;

  // Convert relative coordinates to screen coordinates
  const polygonPoints = useMemo(() => {
    return points
      .map(({ x, y }) => `${x * imageWidth},${y * imageHeight}`)
      .join(' ');
  }, [points, imageWidth, imageHeight]);

  const width = Math.max(0, imageWidth);
  const height = Math.max(0, imageHeight);
  const strokeWidth = Math.floor(2 / scale);

  return (
    <Svg width={width} height={height}>
      <Polygon
        points={polygonPoints}
        fill="none"
        stroke={colors.primary}
        strokeWidth={strokeWidth}
      />
    </Svg>
  );
};
