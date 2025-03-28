import React from 'react';
import { useImageStore } from '@stores';
import * as Sharing from 'expo-sharing';
import { Image } from 'react-native';
import { BaseLayout } from '@components/Layout';
import { IconButton } from '@components/IconButton';
import { BackButton } from '@components/BackButton';
import { DownloadButton } from '@components/DownloadButton';
/**
 * Process Image screen component
 * This screen displays the processed image
 */
export const ExportImageScreen: React.FC = () => {
  const { destinationUri } = useImageStore();

  const onSharePress = () => {
    if (destinationUri) {
      Sharing.shareAsync(destinationUri);
    }
  };

  return (
    <BaseLayout
      actionItems={[
        <BackButton />,
        <DownloadButton />,
        <IconButton
          icon="share"
          accessibilityLabel="Share"
          onPress={onSharePress}
        />,
      ]}
    >
      <Image
        source={{ uri: destinationUri ?? '' }}
        style={{
          width: '100%',
          height: '100%',
        }}
        resizeMode="contain"
      />
    </BaseLayout>
  );
};

export default ExportImageScreen;
