import { MaterialIcons } from '@expo/vector-icons';
import { IconType } from '@types';
import { useTheme } from '@react-navigation/native';

interface IconProps {
  name: IconType;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, size = 32 }) => {
  const { colors } = useTheme();
  return <MaterialIcons name={name} size={size} color={colors.primary} />;
};
