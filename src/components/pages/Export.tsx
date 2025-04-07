import React from 'react';
import { useTransformedImageStore } from '@stores';
import { Image } from 'react-native';
import { BaseLayout } from '@templates';
import { DownloadButton } from '@molecules';

export const Export: React.FC = () => {
  const { destinationUri } = useTransformedImageStore();

  if (!destinationUri) return null;

  return (
    <BaseLayout actionItems={[<DownloadButton key="download-button" />]}>
      <Image
        source={{ uri: destinationUri }}
        style={{
          width: '100%',
          height: '100%',
        }}
        resizeMode="contain"
      />
    </BaseLayout>
  );
};
