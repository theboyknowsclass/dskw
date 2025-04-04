import React from 'react';
import { useTransformedImageStore } from '@stores';
import { Image } from 'react-native';
import { Redirect } from 'expo-router';
import { BaseLayout } from '@templates';
import { DownloadButton } from '@molecules';
/**
 * Process Image screen component
 * This screen displays the processed image
 */
export const ExportImageScreen: React.FC = () => {
  const { destinationUri } = useTransformedImageStore();

  if (!destinationUri) return <Redirect href="/" />;

  return (
    <BaseLayout actionItems={[<DownloadButton key="download-button" />]}>
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
