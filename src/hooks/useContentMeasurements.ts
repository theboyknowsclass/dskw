import { ContentMeasurementsContext } from 'contexts/ContentMeasurementsContext';
import { useContext } from 'react';

export const useContentMeasurements = () => {
  const context = useContext(ContentMeasurementsContext);
  if (context === undefined) {
    throw new Error(
      'useContentMeasurements must be used within a ContentMeasurementsProvider'
    );
  }
  return context;
};
