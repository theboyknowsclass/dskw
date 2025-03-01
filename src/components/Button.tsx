import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";

// Interface for Button component props
interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline" | "iconButton";
  size?: "small" | "medium" | "large";
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode; // For icon buttons
}

/**
 * Reusable Button component that follows the Open/Closed principle
 * It can be extended without modifying its source code through props
 */
export const Button: React.FC<ButtonProps> = ({
  title,
  loading = false,
  variant = "primary",
  size = "medium",
  buttonStyle,
  textStyle,
  disabled,
  icon,
  ...rest
}) => {
  // Use the current theme
  const { colors, isDarkTheme } = useTheme();

  // Determine button styles based on variant and size
  const getButtonStyles = (): ViewStyle => {
    // Base styles
    const baseStyle: ViewStyle = {
      backgroundColor: colors.primary,
      borderRadius: 8,
      opacity: disabled ? 0.6 : 1,
    };

    // Size styles
    const sizeStyles: Record<string, ViewStyle> = {
      small: { paddingVertical: 6, paddingHorizontal: 12 },
      medium: { paddingVertical: 10, paddingHorizontal: 16 },
      large: { paddingVertical: 14, paddingHorizontal: 24 },
    };

    // Variant styles
    const variantStyles: Record<string, ViewStyle> = {
      primary: { backgroundColor: colors.primary },
      secondary: { backgroundColor: isDarkTheme ? "#2C2C2C" : "#E0E0E0" },
      outline: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: colors.primary,
      },
      iconButton: {
        backgroundColor: "transparent",
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 20,
      },
    };

    // Apply size styles only for non-icon buttons
    if (variant === "iconButton") {
      return {
        ...baseStyle,
        ...variantStyles[variant],
      };
    }

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  // Determine text styles based on variant
  const getTextStyles = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: "bold",
      textAlign: "center",
    };

    const variantTextStyles: Record<string, TextStyle> = {
      primary: { color: "#FFFFFF" },
      secondary: { color: isDarkTheme ? "#FFFFFF" : "#000000" },
      outline: { color: colors.primary },
      iconButton: { color: colors.text },
    };

    const sizeTextStyles: Record<string, TextStyle> = {
      small: { fontSize: 12 },
      medium: { fontSize: 16 },
      large: { fontSize: 18 },
    };

    // For icon buttons, we only apply the variant text style
    if (variant === "iconButton") {
      return {
        ...baseStyle,
        ...variantTextStyles[variant],
      };
    }

    return {
      ...baseStyle,
      ...variantTextStyles[variant],
      ...sizeTextStyles[size],
    };
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyles(), buttonStyle]}
      disabled={disabled || loading}
      accessibilityRole="button"
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "outline" ? colors.primary : "#FFFFFF"}
        />
      ) : variant === "iconButton" && icon ? (
        <View style={styles.iconButtonContainer}>
          {icon}
          {title ? (
            <Text style={[getTextStyles(), textStyle, styles.iconButtonText]}>
              {title}
            </Text>
          ) : null}
        </View>
      ) : (
        <Text style={[getTextStyles(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconButtonText: {
    marginLeft: 4,
  },
});
