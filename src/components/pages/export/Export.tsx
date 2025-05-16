import React from 'react';
import { useTransformedImageStore } from '@stores';
import { Image } from 'react-native';
import { PageTemplate } from '@templates';
import { DownloadButton } from '@molecules';

export const Export: React.FC = () => {
  const { destinationUri } = useTransformedImageStore();

  if (!destinationUri) return null;

  return (
    <PageTemplate>
      <PageTemplate.ActionItems>
        <DownloadButton key="download-button" />
      </PageTemplate.ActionItems>
      <Image
        source={{ uri: destinationUri }}
        style={{
          width: '100%',
          height: '100%',
        }}
        resizeMode="contain"
      />
    </PageTemplate>
  );
};
