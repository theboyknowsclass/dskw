import { Switch, Text } from './';
import { useTheme } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';

interface SettingsToggleProps {
  title: string;
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
}

export const SettingsToggle: React.FC<SettingsToggleProps> = ({
  title,
  isEnabled,
  onToggle,
}) => {
  const {
    colors: { primary },
  } = useTheme();

  return (
    <View style={styles.toggleContainer}>
      <Switch onValueChange={onToggle} value={isEnabled} />
      <Text color={primary} style={styles.toggleText}>
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  toggleText: {
    position: 'relative',
    top: -0.5,
  },
});
