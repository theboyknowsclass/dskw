import { useScreenLayout } from '@hooks/useScreenLayout';
import { ReactNode } from 'react';
import { View } from 'react-native';

export const ActionBar: React.FC<{ children: ReactNode | ReactNode[] }> = ({
  children,
}) => {
  const { actionBarContainerStyle } = useScreenLayout();

  return <View style={actionBarContainerStyle}>{children}</View>;
};
