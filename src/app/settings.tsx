import { View } from 'react-native';
import BackNavigation from '@navigation/BackNavigation';
import { ThemeToggle } from '@components/ThemeToggle';
import { ShareButton } from '@components/ShareButton';

export const Settings: React.FC = () => {
  return (
    <View
      style={{
        flex: 1,
        padding: 0,
        marginLeft: 0,
      }}
    >
      <BackNavigation />
      <View
        style={{
          flex: 1,
          gap: 8,
          marginTop: 24,
          marginLeft: 46,
        }}
      >
        <ThemeToggle />
        <ShareButton />
      </View>
      {/* <Text>Settings</Text>
      {canGoBack && <BackButton />}
      <BackButton />
      <ShareButton /> */}
    </View>
  );
};

export default Settings;
