import React, { useMemo, useCallback } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Svg, { Polygon, Circle } from "react-native-svg";
import { useQuadrilateralStore } from "../store/quadrilateralStore";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

type QuadrilateralOverlayProps = {
  imageWidth: number;
  imageHeight: number;
};

export const QuadrilateralOverlay: React.FC<QuadrilateralOverlayProps> = ({
  imageWidth,
  imageHeight,
}) => {
  const { points, activePointIndex, setActivePointIndex, updatePoint } =
    useQuadrilateralStore();

  // Convert relative coordinates to screen coordinates
  const screenPoints = useMemo(() => {
    return points.map((point) => ({
      x: point.x * imageWidth,
      y: point.y * imageHeight,
    }));
  }, [points, imageWidth, imageHeight]);

  // Convert screen coordinates to relative coordinates
  const getRelativeCoordinates = useCallback(
    (screenX: number, screenY: number) => {
      // Calculate relative coordinates (0-1) based on image dimensions
      const relativeX = Math.max(0, Math.min(1, screenX / imageWidth));
      const relativeY = Math.max(0, Math.min(1, screenY / imageHeight));

      return { x: relativeX, y: relativeY };
    },
    [imageWidth, imageHeight]
  );

  // Create a pan gesture for a point
  const createPanGesture = useCallback(
    (index: number) => {
      return Gesture.Pan()
        .onStart(() => {
          setActivePointIndex(index);
        })
        .onUpdate((e) => {
          // Calculate the new position (clamped to image boundaries)
          const pointX = Math.max(0, Math.min(imageWidth, e.absoluteX));
          const pointY = Math.max(0, Math.min(imageHeight, e.absoluteY));

          // Convert to relative coordinates and update the point
          const relativePoint = getRelativeCoordinates(pointX, pointY);
          updatePoint(index, relativePoint);
        })
        .onEnd(() => {
          setActivePointIndex(null);
        });
    },
    [
      imageWidth,
      imageHeight,
      getRelativeCoordinates,
      setActivePointIndex,
      updatePoint,
    ]
  );

  const polygonPoints = useMemo(() => {
    return screenPoints.map((point) => `${point.x},${point.y}`).join(" ");
  }, [screenPoints]);

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* SVG Layer (visual only) */}
      <Svg width={imageWidth} height={imageHeight}>
        <Polygon
          points={polygonPoints}
          fill="none"
          stroke="rgba(255, 255, 255, 0.8)"
          strokeWidth="2"
        />

        {screenPoints.map((point, index) => (
          <Circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="15"
            fill={
              activePointIndex === index
                ? "rgba(255, 255, 255, 0.8)"
                : "rgba(255, 255, 255, 0.5)"
            }
          />
        ))}
      </Svg>

      {/* Separate interaction layer */}
      {screenPoints.map((point, index) => {
        // Memoize the gesture for each point
        const panGesture = useMemo(
          () => createPanGesture(index),
          [createPanGesture, index]
        );

        return (
          <GestureDetector key={`gesture-${index}`} gesture={panGesture}>
            <View
              style={[
                styles.touchPoint,
                {
                  left: point.x - 20,
                  top: point.y - 20,
                },
              ]}
            />
          </GestureDetector>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  touchPoint: {
    position: "absolute",
    width: 40,
    height: 40,
    backgroundColor: "transparent",
  },
  touchPointDebug: {
    position: "absolute",
    width: 40,
    height: 40,
    backgroundColor: "rgba(255, 0, 0, 0.2)",
    borderWidth: 1,
    borderColor: "red",
  },
});
