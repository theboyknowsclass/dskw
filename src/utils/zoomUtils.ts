export const getZoomTransform = (
  zoomWindowSize: number,
  activePoint: { x: number; y: number },
  originalDimensions: { width: number; height: number }
) => {
  // Bound checking for the point coordinates
  const pointX = Math.max(0, Math.min(1, activePoint.x));
  const pointY = Math.max(0, Math.min(1, activePoint.y));

  // Calculate transform directly in render method - no state or memo
  const startX = zoomWindowSize / 2;
  const startY = zoomWindowSize / 2;

  const transform = [
    { translateX: startX - pointX * originalDimensions.width },
    { translateY: startY - pointY * originalDimensions.height },
  ];

  return transform;
};
