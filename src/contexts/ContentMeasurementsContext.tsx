import React, { createContext, useState, ReactNode } from 'react';
import { Dimensions } from '@types';

interface ContentMeasurementsContextType {
  dimensions: Dimensions;
  isReady: boolean;
  setDimensions: (dimensions: Dimensions) => void;
  setIsReady: (isReady: boolean) => void;
}

export const ContentMeasurementsContext =
  createContext<ContentMeasurementsContextType>({
    dimensions: { width: 0, height: 0 },
    setDimensions: () => {},
    isReady: false,
    setIsReady: () => {},
  });

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
  const [isReady, setIsReady] = useState(false);

  const value = {
    dimensions,
    isReady,
    setDimensions,
    setIsReady,
  };

  return (
    <ContentMeasurementsContext.Provider value={value}>
      {children}
    </ContentMeasurementsContext.Provider>
  );
};
