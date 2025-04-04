import React, { useMemo } from 'react';
import { Svg, Polygon, Circle } from 'react-native-svg';
import { useTheme } from '@react-navigation/native';
import { useOverlayStore, useSourceImageStore } from '@stores';

export const OverlaySvg: React.FC = () => {
  const { colors } = useTheme();

  // Use selectors from the store for better performance
  const isDragging = useOverlayStore((state) => state.activePointIndex != null);
  const points = useOverlayStore((state) => state.points);
  const { width: imageWidth, height: imageHeight } = useSourceImageStore(
    (state) => state.scaledDimensions
  );

  // Convert relative coordinates to screen coordinates
  const screenPoints = useMemo(() => {
    return points.map(({ x, y }) => ({
      x: x * imageWidth,
      y: y * imageHeight,
    }));
  }, [points, imageWidth, imageHeight]);

  const polygonPoints = useMemo(() => {
    return screenPoints.map((point) => `${point.x},${point.y}`).join(' ');
  }, [screenPoints]);

  // Memoize style values to prevent unnecessary recalculations
  const svgStyles = useMemo(
    () => ({
      strokeWidth: isDragging ? '3' : '2',
      strokeColor: isDragging ? `${colors.primary}90` : colors.primary,
      pointFill: isDragging ? `${colors.primary}90` : colors.primary,
    }),
    [isDragging, colors.primary]
  );

  // Memoize circles to prevent unnecessary recreation
  const circles = useMemo(
    () =>
      screenPoints.map((point, index) => (
        <Circle
          key={index}
          cx={point.x}
          cy={point.y}
          r="15"
          fill={svgStyles.pointFill}
        />
      )),
    [screenPoints, svgStyles.pointFill]
  );

  if (imageWidth === 0 || imageHeight === 0) {
    return null;
  }

  return (
    <Svg width={imageWidth} height={imageHeight}>
      <Polygon
        points={polygonPoints}
        fill="none"
        stroke={svgStyles.strokeColor}
        strokeWidth={svgStyles.strokeWidth}
      />
      {circles}
    </Svg>
  );
};
