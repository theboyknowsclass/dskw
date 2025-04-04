import React, { useMemo } from 'react';
import { Svg, Polygon, Circle } from 'react-native-svg';
import { useTheme } from '@react-navigation/native';
import { useOverlayStore } from '@stores';

type OverlaySvgProps = {
  imageWidth: number;
  imageHeight: number;
  screenPoints: { x: number; y: number }[];
};

export const OverlaySvg: React.FC<OverlaySvgProps> = ({
  imageWidth,
  imageHeight,
  screenPoints,
}) => {
  const { colors } = useTheme();

  // Use selectors from the store for better performance
  const activePointIndex = useOverlayStore((state) => state.activePointIndex);

  const polygonPoints = useMemo(() => {
    return screenPoints.map((point) => `${point.x},${point.y}`).join(' ');
  }, [screenPoints]);

  const isDragging = activePointIndex != null;

  return (
    <Svg width={imageWidth} height={imageHeight}>
      <Polygon
        points={polygonPoints}
        fill="none"
        stroke={isDragging ? colors.primary : `${colors.primary}`}
        strokeWidth={isDragging ? '3' : '2'}
      />

      {screenPoints.map((point, index) => (
        <Circle
          key={index}
          cx={point.x}
          cy={point.y}
          r="15"
          fill={
            activePointIndex === index ? colors.primary : `${colors.primary}`
          }
        />
      ))}
    </Svg>
  );
};
