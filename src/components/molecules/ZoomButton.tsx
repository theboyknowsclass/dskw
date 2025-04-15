import { IconButton } from '@atoms';
import { router } from 'expo-router';
import { useOverlayStore } from '@stores';

export const ZoomButton: React.FC = () => {
  const { activePointIndex } = useOverlayStore();

  const isDisabled = activePointIndex == null;

  const zoomButtonOnPress = () => {
    router.navigate('zoom');
  };

  return (
    <IconButton
      icon="zoom-in"
      onPress={zoomButtonOnPress}
      accessibilityLabel="Zoom in"
      title=""
      disabled={isDisabled}
    />
  );
};
