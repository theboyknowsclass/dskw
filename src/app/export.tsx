import React from 'react';
import { useImageStore } from '@stores';
import * as Sharing from 'expo-sharing';
import { Image } from 'react-native';
import {
  BaseLayout,
  IconButton,
  BackButton,
  DownloadButton,
} from '@components';
import { Redirect } from 'expo-router';
/**
 * Process Image screen component
 * This screen displays the processed image
 */
export const ExportImageScreen: React.FC = () => {
  const { destinationUri } = useImageStore();

  if (!destinationUri) return <Redirect href="/" />;

  const onSharePress = () => {
    if (destinationUri) {
      Sharing.shareAsync(destinationUri);
    }
  };

  return (
    <BaseLayout
      actionItems={[
        <BackButton key="back-button" />,
        <DownloadButton key="download-button" />,
        <IconButton
          key="share-button"
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
