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
  View,
  Dimensions,
} from 'react-native';

// Get device width for responsive sizing
const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Props for the Button component.
 * Extends TouchableOpacityProps to support all standard touch properties.
 */
interface ButtonProps extends TouchableOpacityProps {
  /** The text to display on the button */
  title?: string;
  /** Whether the button is in a loading state */
  loading?: boolean;
  /** The visual style variant of the button */
  variant?: 'primary' | 'secondary' | 'outline' | 'iconButton';
  /** The size of the button */
  size?: 'small' | 'medium' | 'large';
  /** Custom styles for the button text */
  textStyle?: TextStyle;
  /** Optional icon to display alongside the text (for iconButton variant) */
  icon?: React.ReactNode;
}

/**
 * A flexible and reusable Button component that supports multiple variants, sizes, and states.
 *
 * Features:
 * - Multiple visual variants (primary, secondary, outline, iconButton)
 * - Three size options (small, medium, large)
 * - Loading state with activity indicator
 * - Support for icons
 * - Responsive sizing based on screen width
 * - Dark/light theme support
 * - Customizable styles for both container and text
 * - Accessibility support
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Button title="Click me" onPress={() => {}} />
 *
 * // With loading state
 * <Button title="Loading..." loading />
 *
 * // With custom styles
 * <Button
 *   title="Custom"
 *   style={{ marginTop: 20 }}
 *   textStyle={{ fontWeight: 'bold' }}
 * />
 *
 * // With icon
 * <Button
 *   title="Settings"
 *   icon={<Icon name="settings" />}
 *   variant="iconButton"
 * />
 * ```
 */
export const Button: React.FC<ButtonProps> = ({
  title,
  loading = false,
  variant = 'primary',
  size = 'medium',
  textStyle,
  disabled,
  icon,
  style,
  ...rest
}) => {
  // Use the current theme for dynamic styling
  const { colors, dark: isDarkTheme } = useTheme();

  /**
   * Generates the button container styles based on variant and size.
   * Implements responsive design and handles different visual states.
   *
   * @returns {ViewStyle} The computed styles for the button container
   */
  const getButtonStyles = (): ViewStyle => {
    // Base styles that apply to all button variants
    const baseStyle: ViewStyle = {
      backgroundColor: colors.primary,
      borderRadius: 2,
      opacity: disabled ? 0.5 : 1,
      maxWidth: SCREEN_WIDTH > 600 ? 300 : SCREEN_WIDTH * 0.8,
      alignSelf: 'center',
    };

    // Size-specific padding and dimensions
    const sizeStyles: Record<string, ViewStyle> = {
      small: { paddingVertical: 6, paddingHorizontal: 12 },
      medium: { paddingVertical: 10, paddingHorizontal: 16 },
      large: { paddingVertical: 14, paddingHorizontal: 24 },
    };

    // Visual styles for different button variants
    const variantStyles: Record<string, ViewStyle> = {
      primary: { backgroundColor: colors.primary },
      secondary: { backgroundColor: isDarkTheme ? '#2C2C2C' : '#E0E0E0' },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary,
      },
      iconButton: {
        backgroundColor: 'transparent',
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 20,
      },
    };

    // Special handling for icon buttons
    if (variant === 'iconButton') {
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

  /**
   * Generates the text styles based on variant and size.
   * Handles different text appearances for various button types.
   *
   * @returns {TextStyle} The computed styles for the button text
   */
  const getTextStyles = (): TextStyle => {
    const baseStyle: TextStyle = {
      textAlign: 'center',
      fontFamily: 'Orbitron_400Regular',
    };

    // Text colors for different variants
    const variantTextStyles: Record<string, TextStyle> = {
      primary: { color: isDarkTheme ? '#000000' : '#FFFFFF' },
      secondary: { color: isDarkTheme ? '#000000' : '#FFFFFF' },
      outline: { color: colors.primary },
      iconButton: { color: colors.text },
    };

    // Font sizes for different button sizes
    const sizeTextStyles: Record<string, TextStyle> = {
      small: { fontSize: 12 },
      medium: { fontSize: 16 },
      large: { fontSize: 18 },
    };

    // Special handling for icon buttons
    if (variant === 'iconButton') {
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
      style={[styles.button, getButtonStyles(), style]}
      disabled={disabled || loading}
      accessibilityRole="button"
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : variant === 'iconButton' && icon ? (
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
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50, // Ensure buttons have a minimum width for better touch targets
  },
  iconButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonText: {
    marginLeft: 4, // Spacing between icon and text
  },
});
