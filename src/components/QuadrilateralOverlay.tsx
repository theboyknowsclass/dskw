import React, { useMemo, useCallback, useRef } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Polygon, Circle } from "react-native-svg";
import { useOverlayStore } from "../stores/useOverlayStore";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useTheme } from "../contexts/ThemeContext";

type QuadrilateralOverlayProps = {
  imageWidth: number;
  imageHeight: number;
};

export const QuadrilateralOverlay: React.FC<QuadrilateralOverlayProps> = ({
  imageWidth,
  imageHeight,
}) => {
  const {
    points,
    activePointIndex,
    isDragging,
    setActivePointIndex,
    updatePoint,
    setIsDragging,
  } = useOverlayStore();
  const { colors } = useTheme();

  // Ref to track the container's position
  const containerRef = useRef<View>(null);

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
      // Get the container's position
      containerRef.current?.measure((x, y, width, height, pageX, pageY) => {
        // Calculate coordinates relative to the container
        const relativeX = (screenX - pageX) / imageWidth;
        const relativeY = (screenY - pageY) / imageHeight;

        // Clamp values between 0 and 1
        return {
          x: Math.max(0, Math.min(1, relativeX)),
          y: Math.max(0, Math.min(1, relativeY)),
        };
      });
    },
    [imageWidth, imageHeight]
  );

  // Create a pan gesture for a point
  const createPanGesture = useCallback(
    (index: number) => {
      return Gesture.Pan()
        .onStart(() => {
          setActivePointIndex(index);
          setIsDragging(true);
        })
        .onUpdate((e) => {
          // Get the container's position
          containerRef.current?.measure((x, y, width, height, pageX, pageY) => {
            // Calculate coordinates relative to the container
            const relativeX = (e.absoluteX - pageX) / imageWidth;
            const relativeY = (e.absoluteY - pageY) / imageHeight;

            // Clamp values between 0 and 1
            const clampedPoint = {
              x: Math.max(0, Math.min(1, relativeX)),
              y: Math.max(0, Math.min(1, relativeY)),
            };

            updatePoint(index, clampedPoint);
          });
        })
        .onEnd(() => {
          setActivePointIndex(null);
          setIsDragging(false);
        });
    },
    [imageWidth, imageHeight, setActivePointIndex, updatePoint, setIsDragging]
  );

  const polygonPoints = useMemo(() => {
    return screenPoints.map((point) => `${point.x},${point.y}`).join(" ");
  }, [screenPoints]);

  return (
    <View ref={containerRef} style={StyleSheet.absoluteFill}>
      {/* SVG Layer (visual only) */}
      <Svg width={imageWidth} height={imageHeight}>
        <Polygon
          points={polygonPoints}
          fill="none"
          stroke={isDragging ? colors.accent : `${colors.accent}cc`}
          strokeWidth={isDragging ? "3" : "2"}
        />

        {screenPoints.map((point, index) => (
          <Circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="15"
            fill={
              activePointIndex === index ? colors.accent : `${colors.accent}80`
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
