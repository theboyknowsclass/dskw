import React from 'react';
import { Redirect } from 'expo-router';
import { useTransformedImageStore } from '@stores';
import { Export } from '@pages';
/**
 * Process Image screen component
 * This screen displays the processed image
 */
export const ExportRoute: React.FC = () => {
  const { destinationUri } = useTransformedImageStore();

  if (!destinationUri) return <Redirect href="/" />;

  return <Export />;
};

export default ExportRoute;
