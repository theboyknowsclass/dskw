import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore } from '../stores/useThemeStore';
import { Button } from './Button';

type IconTypes =
  | 'file-download'
  | 'arrow-back'
  | 'arrow-forward'
  | 'done'
  | 'share'
  | 'light-mode'
  | 'dark-mode'
  | 'settings'
  | 'home';

interface IconButtonProps {
  icon: IconTypes;
  onPress: () => void;
  accessibilityLabel: string;
  title: string | undefined;
}
/**
 * A button component that allows users to go back to the previous screen.
 * Uses the Button component with an icon variant for consistent styling.
 */
export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  accessibilityLabel,
  title,
}) => {
  const {
    theme: { colors },
  } = useThemeStore();

  return (
    <Button
      variant="iconButton"
      icon={<MaterialIcons name={icon} size={32} color={colors.primary} />}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      title={title ?? ''}
      style={{
        borderRadius: '50%',
        borderWidth: 2,
        borderColor: colors.primary,
      }}
    />
  );
};
