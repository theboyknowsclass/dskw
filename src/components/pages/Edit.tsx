import { TransformImageButton } from '@molecules';
import { useScreenDimensions } from '@hooks';
import { useSourceImageStore } from '@stores';
import { useEffect, useState } from 'react';
import {
  View,
  LayoutChangeEvent,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import { BaseLayout } from '@templates';
import { Overlay, ZoomPreview } from '@organisms';

const MAX_ZOOM_WINDOW_SIZE = 400;
const MAX_ZOOM_WINDOW_RATIO = 0.5;
const ZOOM_WINDOW_PADDING = 40;

export const Edit: React.FC = () => {
  const { uri, originalDimensions, setScaledDimensions, scaledDimensions } =
    useSourceImageStore();
  const { isLandscape } = useScreenDimensions();
  const [zoomWindowSize, setZoomWindowSize] = useState<number>(0);
  const [contentContainerSize, setContentContainerSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  useEffect(() => {
    if (!contentContainerSize || !originalDimensions) return;
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

    setScaledDimensions({
      width: imageWidth * scaleFactor,
      height: imageHeight * scaleFactor,
    });

    setZoomWindowSize(zoomWindowSize);
  }, [
    contentContainerSize,
    isLandscape,
    originalDimensions,
    setScaledDimensions,
    setZoomWindowSize,
  ]);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContentContainerSize({ width, height });
  };

  const { width: scaledWidth, height: scaledHeight } = scaledDimensions;

  if (!scaledWidth || !scaledHeight) return null;

  return (
    <BaseLayout actionItems={[<TransformImageButton key="transform-image" />]}>
      <View
        onLayout={onLayout}
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
            <Overlay />
          </ImageBackground>
        </View>
      </View>
    </BaseLayout>
  );
};

const styles = StyleSheet.create({
  imagePreview: {
    flex: 1,
    alignSelf: 'center',
  },
});
