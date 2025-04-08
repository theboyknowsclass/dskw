import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Dimensions } from '@types';

interface ContentMeasurementsContextType {
  dimensions: Dimensions;
  isLoading: boolean;
  setDimensions: (dimensions: Dimensions) => void;
  setIsLoading: (isLoading: boolean) => void;
}

const ContentMeasurementsContext = createContext<
  ContentMeasurementsContextType | undefined
>(undefined);

interface ContentMeasurementsProviderProps {
  children: ReactNode;
}

export const ContentMeasurementsProvider: React.FC<
  ContentMeasurementsProviderProps
> = ({ children }) => {
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const value = {
    dimensions,
    isLoading,
    setDimensions,
    setIsLoading,
  };

  return (
    <ContentMeasurementsContext.Provider value={value}>
      {children}
    </ContentMeasurementsContext.Provider>
  );
};

export const useContentMeasurements = () => {
  const context = useContext(ContentMeasurementsContext);
  if (context === undefined) {
    throw new Error(
      'useContentMeasurements must be used within a ContentMeasurementsProvider'
    );
  }
  return context;
};
