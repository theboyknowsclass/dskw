import React, { useMemo } from 'react';
import { useOverlayStore } from '@stores';
import { Corner } from '@types';
import { TouchPoint } from '../atoms';

type OverlayGestureHandlerProps = {
  containerSize: { pageX: number; pageY: number };
};

export const OverlayGestureHandler: React.FC<OverlayGestureHandlerProps> = ({
  containerSize,
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
          containerSize={containerSize}
        />
      ))}
    </>
  );
};
