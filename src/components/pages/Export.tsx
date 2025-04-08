import React from 'react';
import { useTransformedImageStore } from '@stores';
import { Image } from 'react-native';
import { AppShellLayout } from '@templates';
import { DownloadButton } from '@molecules';

export const Export: React.FC = () => {
  const { destinationUri } = useTransformedImageStore();

  if (!destinationUri) return null;

  return (
    <AppShellLayout>
      <AppShellLayout.ActionItems>
        <DownloadButton key="download-button" />
      </AppShellLayout.ActionItems>
      <Image
        source={{ uri: destinationUri }}
        style={{
          width: '100%',
          height: '100%',
        }}
        resizeMode="contain"
      />
    </AppShellLayout>
  );
};
