import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Polygon, Circle } from "react-native-svg";
import { useQuadrilateralStore } from "../store/quadrilateralStore";

type QuadrilateralOverlayProps = {
  imageWidth: number;
  imageHeight: number;
};

export const QuadrilateralOverlay: React.FC<QuadrilateralOverlayProps> = ({
  imageWidth,
  imageHeight,
}) => {
  const { points } = useQuadrilateralStore();

  // Convert relative coordinates to screen coordinates
  const screenPoints = points.map((point) => ({
    x: point.x * imageWidth,
    y: point.y * imageHeight,
  }));

  return (
    <View style={StyleSheet.absoluteFill}>
      <Svg width={imageWidth} height={imageHeight}>
        <Polygon
          points={screenPoints
            .map((point) => `${point.x},${point.y}`)
            .join(" ")}
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
            fill="rgba(255, 255, 255, 0.5)"
          />
        ))}
      </Svg>
    </View>
  );
};
