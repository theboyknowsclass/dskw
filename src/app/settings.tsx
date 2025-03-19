import { View } from 'react-native';
import { DownloadButton } from '../components/DownloadButton';
import { BackButton } from '../components/BackButton';
import { ShareButton } from '../components/ShareButton';

export const Settings: React.FC = () => {
  return (
    <View>
      <DownloadButton />
      <BackButton />
      <ShareButton />
    </View>
  );
};

export default Settings;
