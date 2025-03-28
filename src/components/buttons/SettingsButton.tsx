import { router } from 'expo-router';
import { IconButton } from '@components';

export const SettingsButton: React.FC = () => {
  const onSettingsButtonPress = () => {
    router.push('/settings');
  };

  return (
    <IconButton
      icon="settings"
      onPress={onSettingsButtonPress}
      accessibilityLabel="Settings"
      title=""
    />
  );
};
