import React, { useMemo } from "react";
import { View, StyleSheet, Text, Image, Dimensions } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useOverlayStore } from "../stores/useOverlayStore";
import { useImageStore } from "../stores/useImageStore";

export const ZoomPreview: React.FC = () => {
  const { points, activePointIndex, zoomLevel, setZoomLevel } =
    useOverlayStore();
  const { uri, originalDimensions } = useImageStore();
  const { colors } = useTheme();
  const { width: screenWidth } = Dimensions.get("window");

  // Calculate preview dimensions
  const previewSize = Math.min(screenWidth * 0.8, 400);
  console.log("previewSize", previewSize);

  // Get the active point coordinates
  const activePoint =
    activePointIndex !== null ? points[activePointIndex] : null;

  if (!activePoint || !uri) {
    return (
      <View style={styles.container}>
        <Text style={[styles.text, { color: colors.text }]}>
          Select a point to preview
        </Text>
      </View>
    );
  }

  // Calculate the scaled dimensions
  const scaledDimensions = useMemo(() => {
    const scale = previewSize / originalDimensions.width;
    return {
      width: originalDimensions.width * scale,
      height: originalDimensions.height * scale,
    };
  }, [originalDimensions, previewSize]);

  // Calculate the transform to center and zoom on the active point
  const transform = useMemo(() => {
    // Calculate the center point in scaled coordinates
    const centerX = activePoint.x * scaledDimensions.width;
    const centerY = activePoint.y * scaledDimensions.height;

    // Calculate the translation to center the point
    const translateX = previewSize / 2 - centerX;
    const translateY = previewSize / 2 - centerY;

    // Apply the zoom level to the translation
    const scaledTranslateX = translateX * zoomLevel;
    const scaledTranslateY = translateY * zoomLevel;

    return [
      { translateX: scaledTranslateX },
      { translateY: scaledTranslateY },
      { scale: zoomLevel },
    ];
  }, [activePoint, scaledDimensions, previewSize, zoomLevel]);

  // Format coordinates for display
  const coordinatesText = useMemo(() => {
    if (!activePointIndex) return "";
    const relativeX = activePoint.x.toFixed(3);
    const relativeY = activePoint.y.toFixed(3);
    const pixelX = Math.round(activePoint.x * originalDimensions.width);
    const pixelY = Math.round(activePoint.y * originalDimensions.height);
    return `Point ${
      activePointIndex + 1
    }: (${relativeX}, ${relativeY})\nPixel: (${pixelX}, ${pixelY})`;
  }, [activePoint, activePointIndex, originalDimensions]);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.previewContainer,
          { width: previewSize, height: previewSize },
        ]}
      >
        <Image
          source={{ uri }}
          style={[
            styles.previewImage,
            {
              width: scaledDimensions.width,
              height: scaledDimensions.height,
              position: "absolute",
              transform,
            },
          ]}
        />
        {/* Crosshair indicator */}
        <View style={[styles.crosshair]}>
          <View
            style={[
              styles.crosshairLine,
              { backgroundColor: `${colors.accent}bf` },
            ]}
          />
          <View
            style={[
              styles.crosshairLine,
              {
                backgroundColor: `${colors.accent}bf`,
                transform: [{ rotate: "90deg" }],
              },
            ]}
          />
        </View>
      </View>
      <View style={styles.controls}>
        <Text style={[styles.coordinates, { color: colors.text }]}>
          {coordinatesText}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  previewContainer: {
    overflow: "hidden",
    borderRadius: 8,
    backgroundColor: "#000",
    marginBottom: 20,
    position: "relative",
  },
  previewImage: {
    position: "absolute",
  },
  crosshair: {
    position: "absolute",
    width: 48,
    height: 48,
    top: "50%",
    left: "50%",
    marginLeft: -24,
    marginTop: -24,
    justifyContent: "center",
    alignItems: "center",
  },
  crosshairLine: {
    position: "absolute",
    width: 2,
    height: 48,
    backgroundColor: "transparent",
  },
  controls: {
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  coordinates: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 15,
    opacity: 0.8,
  },
  zoomControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  zoomButton: {
    fontSize: 24,
    width: 40,
    height: 40,
    textAlign: "center",
    textAlignVertical: "center",
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
});
