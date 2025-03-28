import { router } from 'expo-router';
import { IconButton } from './IconButton';

export const SettingsButton = () => {
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
