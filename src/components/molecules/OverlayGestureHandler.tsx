import React, { useMemo } from 'react';
import { useOverlayStore } from '@stores';
import { Corner, Dimensions } from '@types';
import { TouchPoint } from '../atoms';

type OverlayGestureHandlerProps = {
  offset: { xOffset: number; yOffset: number };
  dimensions: Dimensions;
};

export const OverlayGestureHandler: React.FC<OverlayGestureHandlerProps> = ({
  offset,
  dimensions,
}) => {
  // Use selectors from the store for better performance
  const pointsLength = useOverlayStore((state) => state.points.length);

  const pointsIndices = useMemo(() => {
    return Array.from({ length: pointsLength }, (_, index) => index);
  }, [pointsLength]);

  return (
    <>
      {pointsIndices.map((_, index) => (
        <TouchPoint
          key={`point-${index}`}
          index={index as Corner}
          parentOffset={offset}
          parentDimensions={dimensions}
        />
      ))}
    </>
  );
};
