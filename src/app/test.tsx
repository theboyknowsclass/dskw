import { DownloadButton } from '@components/DownloadButton';
import { Layout } from '@components/Layout';
import { ShareButton } from '@components/ShareButton';
import { View } from 'react-native';

export const Test: React.FC = () => {
  return (
    <Layout actionItems={[<DownloadButton />, <ShareButton />]}>
      <View style={{ backgroundColor: 'red', height: '100%', width: '100%' }} />
    </Layout>
  );
};

export default Test;
