import { TransformImageButton } from '@molecules';
import { useScreenDimensions } from '@hooks';
import { useSourceImageStore } from '@stores';
import { View, ImageBackground, StyleSheet } from 'react-native';
import { AppShellLayout } from '@templates';
import { Overlay, ZoomPreview } from '@organisms';
import { useContentMeasurements } from 'contexts/ContentMeasurementsContext';

const MAX_ZOOM_WINDOW_SIZE = 400;
const MAX_ZOOM_WINDOW_RATIO = 0.5;
const ZOOM_WINDOW_PADDING = 40;

const EditContent: React.FC = () => {
  const { uri, originalDimensions } = useSourceImageStore();
  const { isLandscape } = useScreenDimensions();
  const { dimensions: contentContainerSize } = useContentMeasurements();

  // calculates the layout of the screen based on orientation and screen size
  const { width: contentWidth, height: contentHeight } = contentContainerSize;

  let zoomWindowSize = 0;
  let maxImageWidth = 0;
  let maxImageHeight = 0;

  if (isLandscape) {
    zoomWindowSize = Math.min(
      contentWidth * MAX_ZOOM_WINDOW_RATIO,
      MAX_ZOOM_WINDOW_SIZE
    );

    maxImageWidth = contentWidth - zoomWindowSize - ZOOM_WINDOW_PADDING;
    maxImageHeight = contentHeight;
  } else {
    zoomWindowSize = Math.min(
      contentHeight * MAX_ZOOM_WINDOW_RATIO,
      MAX_ZOOM_WINDOW_SIZE
    );

    maxImageWidth = contentWidth;
    maxImageHeight = contentHeight - zoomWindowSize - ZOOM_WINDOW_PADDING;
  }

  const { width: imageWidth, height: imageHeight } = originalDimensions;

  const widthScale = maxImageWidth / imageWidth;
  const heightScale = maxImageHeight / imageHeight;

  const scaleFactor = Math.min(widthScale, heightScale);

  const scaledWidth = imageWidth * scaleFactor;
  const scaledHeight = imageHeight * scaleFactor;

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        flexDirection: isLandscape ? 'row' : 'column',
      }}
    >
      <View
        style={{
          flex: 0,
          position: 'relative',
          alignSelf: 'center',
          minWidth: zoomWindowSize,
          minHeight: zoomWindowSize,
          marginRight: isLandscape ? ZOOM_WINDOW_PADDING : 0,
          marginBottom: isLandscape ? 0 : ZOOM_WINDOW_PADDING,
        }}
      >
        <ZoomPreview size={zoomWindowSize} />
      </View>
      <View style={styles.imagePreview}>
        <ImageBackground
          source={uri ? { uri } : undefined}
          imageStyle={{
            width: scaledWidth,
            height: scaledHeight,
          }}
          resizeMode="contain"
        >
          <Overlay dimensions={{ width: scaledWidth, height: scaledHeight }} />
        </ImageBackground>
      </View>
    </View>
  );
};

const EditActionItems: React.FC = () => {
  return <TransformImageButton />;
};

export const Edit: React.FC = () => {
  return (
    <AppShellLayout>
      <AppShellLayout.ActionItems>
        <EditActionItems />
      </AppShellLayout.ActionItems>
      <EditContent />
    </AppShellLayout>
  );
};

const styles = StyleSheet.create({
  imagePreview: {
    flex: 1,
    alignSelf: 'center',
  },
});
