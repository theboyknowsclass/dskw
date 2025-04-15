import { View, StyleSheet } from 'react-native';
import { ZoomPreview } from '@organisms';
import { PageTemplate } from '@templates';
import { useContentMeasurements } from 'hooks';

const ZoomContent: React.FC = () => {
  const {
    dimensions: { width, height },
  } = useContentMeasurements();
  const zoomWindowSize = Math.min(width, height);

  return (
    <View style={styles.container}>
      <ZoomPreview size={zoomWindowSize} />
    </View>
  );
};

export const Zoom: React.FC = () => {
  return (
    <PageTemplate>
      <ZoomContent />
    </PageTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
