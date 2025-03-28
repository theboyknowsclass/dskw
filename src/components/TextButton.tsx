import { useTheme } from '@react-navigation/native';
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Dimensions,
} from 'react-native';

// Get device width for responsive sizing
const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TextButtonProps extends TouchableOpacityProps {
  /** The text to display on the button */
  title: string;
  /** Whether the button is in a loading state */
  loading?: boolean;
  /** The visual style variant of the button */
  variant?: 'primary' | 'secondary' | 'outline';
  /** The size of the button */
  size?: 'small' | 'medium' | 'large';
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Custom styles for the button text */
  textStyle?: TextStyle;
}

/**
 * A button component specifically designed for text-based buttons.
 * Provides a clean, focused interface for text-only buttons with consistent styling.
 *
 * Features:
 * - Multiple visual variants (primary, secondary, outline)
 * - Three size options (small, medium, large)
 * - Loading state with activity indicator
 * - Responsive sizing based on screen width
 * - Dark/light theme support
 * - Customizable styles for both container and text
 * - Accessibility support
 *
 * @example
 * ```tsx
 * // Basic usage
 * <TextButton title="Click me" onPress={() => {}} />
 *
 * // With loading state
 * <TextButton title="Loading..." loading />
 *
 * // With custom styles
 * <TextButton
 *   title="Custom"
 *   style={{ marginTop: 20 }}
 *   variant="outline"
 * />
 * ```
 */
export const TextButton: React.FC<TextButtonProps> = ({
  title,
  loading = false,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  textStyle,
  style,
  ...rest
}) => {
  const { colors, dark: isDarkTheme } = useTheme();

  const getButtonStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: colors.primary,
      borderRadius: 2,
      opacity: disabled ? 0.5 : 1,
      maxWidth: SCREEN_WIDTH > 600 ? 300 : SCREEN_WIDTH * 0.8,
      alignSelf: 'center',
    };

    const sizeStyles: Record<string, ViewStyle> = {
      small: { paddingVertical: 6, paddingHorizontal: 12 },
      medium: { paddingVertical: 10, paddingHorizontal: 16 },
      large: { paddingVertical: 14, paddingHorizontal: 24 },
    };

    const variantStyles: Record<string, ViewStyle> = {
      primary: { backgroundColor: colors.primary },
      secondary: { backgroundColor: isDarkTheme ? '#2C2C2C' : '#E0E0E0' },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.primary,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const getTextStyles = (): TextStyle => {
    const baseStyle: TextStyle = {
      textAlign: 'center',
      fontFamily: 'Orbitron_400Regular',
    };

    const variantTextStyles: Record<string, TextStyle> = {
      primary: { color: isDarkTheme ? '#000000' : '#FFFFFF' },
      secondary: { color: isDarkTheme ? '#000000' : '#FFFFFF' },
      outline: { color: colors.primary },
    };

    const sizeTextStyles: Record<string, TextStyle> = {
      small: { fontSize: 12 },
      medium: { fontSize: 16 },
      large: { fontSize: 18 },
    };

    return {
      ...baseStyle,
      ...variantTextStyles[variant],
      ...sizeTextStyles[size],
    };
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyles(), style]}
      disabled={disabled || loading}
      accessibilityRole="button"
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : (
        <Text style={[getTextStyles(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    minWidth: 50,
  },
});
