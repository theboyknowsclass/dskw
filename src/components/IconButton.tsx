import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  TouchableOpacityProps,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { IconType } from '../types/IconType';
import { Icon } from './Icon';

interface IconButtonProps extends TouchableOpacityProps {
  /** The icon to display */
  icon: IconType;
  /** Whether the button is in a loading state */
  loading?: boolean;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** The accessibility label for the button */
  accessibilityLabel: string;
  /** Optional title to display alongside the icon */
  title?: string;
  /** The size of the button */
  size?: 'small' | 'large';
  /** Whether to show the border around the button */
  showBorder?: boolean;
}

/**
 * A button component specifically designed for icon-based buttons.
 * Provides a clean, focused interface for icon buttons with consistent styling.
 *
 * Features:
 * - Support for icons with optional text
 * - Loading state with activity indicator
 * - Dark/light theme support
 * - Customizable styles
 * - Accessibility support
 * - Two size variants (small: 24px, medium: 32px)
 * - Optional border styling
 *
 * @example
 * ```tsx
 * // Basic usage with border
 * <IconButton
 *   icon="settings"
 *   onPress={() => {}}
 *   accessibilityLabel="Settings"
 * />
 *
 * // Without border
 * <IconButton
 *   icon="settings"
 *   showBorder={false}
 *   onPress={() => {}}
 *   accessibilityLabel="Settings"
 * />
 *
 * // Small size with border
 * <IconButton
 *   icon="settings"
 *   size="small"
 *   onPress={() => {}}
 *   accessibilityLabel="Settings"
 * />
 * ```
 */
export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  loading = false,
  disabled,
  accessibilityLabel,
  title,
  size = 'large',
  showBorder = true,
  style,
  ...rest
}) => {
  const { colors } = useTheme();
  const iconSize = size === 'small' ? 20 : 36;

  const getButtonStyles = (): ViewStyle => {
    return {
      opacity: disabled ? 0.5 : 1,
      borderWidth: showBorder ? 2 : 0,
      borderColor: colors.primary,
    };
  };

  return (
    <TouchableOpacity
      style={[styles.button, styles[size], getButtonStyles(), style]}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size={size} color={colors.primary} />
      ) : (
        <Icon name={icon} size={iconSize} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: 9999,
    alignSelf: 'flex-start',
  },
  small: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  large: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
});
