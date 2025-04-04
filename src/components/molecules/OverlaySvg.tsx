import React, { useMemo } from 'react';
import { Svg, Polygon, Circle } from 'react-native-svg';
import { useTheme } from '@react-navigation/native';
import { useOverlayStore } from '@stores';

type OverlaySvgProps = {
  imageWidth: number;
  imageHeight: number;
};

export const OverlaySvg: React.FC<OverlaySvgProps> = ({
  imageWidth,
  imageHeight,
}) => {
  const { colors } = useTheme();

  // Use selectors from the store for better performance
  const activePointIndex = useOverlayStore((state) => state.activePointIndex);
  const points = useOverlayStore((state) => state.points);

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

  const isDragging = activePointIndex != null;

  const strokeWidth = isDragging ? '3' : '2';
  const strokeColor = isDragging ? `${colors.primary}90` : colors.primary;
  const pointFill = isDragging ? `${colors.primary}90` : colors.primary;

  return (
    <Svg width={imageWidth} height={imageHeight}>
      <Polygon
        points={polygonPoints}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />

      {screenPoints.map((point, index) => (
        <Circle key={index} cx={point.x} cy={point.y} r="15" fill={pointFill} />
      ))}
    </Svg>
  );
};
