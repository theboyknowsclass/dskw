import { Logo, TransformImageButton } from '@molecules';
import { useScreenDimensions } from '@hooks';
import { useSourceImageStore, useOverlayStore } from '@stores';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Image, LayoutChangeEvent, ImageBackground } from 'react-native';
import { BaseLayout } from '@templates';
import { Overlay, ZoomPreview } from '@organisms';

const MAX_ZOOM_WINDOW_SIZE = 400;
const MAX_ZOOM_WINDOW_RATIO = 0.5;
const ZOOM_WINDOW_PADDING = 40;

export const Edit: React.FC = () => {
  const { uri, originalDimensions, setScaledDimensions, scaledDimensions } =
    useSourceImageStore();
  const { activePointIndex } = useOverlayStore();
  const { isLandscape } = useScreenDimensions();
  const [zoomWindowSize, setZoomWindowSize] = useState<number>(0);
  const [contentContainerSize, setContentContainerSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  const isDragging = activePointIndex != null;

  useEffect(() => {
    if (!contentContainerSize || !originalDimensions) return;
    const { width: contentWidth, height: contentHeight } = contentContainerSize;

    let zoomWindowSize = 0;
    let maxImageWidth = 0;
    let maxImageHeight = 0;

    if (isLandscape) {
      // set the zoom window size to be either the max width or the max width * the max zoom window ratio, whichever is smaller
      zoomWindowSize = Math.min(
        contentWidth * MAX_ZOOM_WINDOW_RATIO,
        MAX_ZOOM_WINDOW_SIZE
      );

      // set the max image width to be the content width minus the zoom window size and the zoom window padding
      maxImageWidth = contentWidth - zoomWindowSize - ZOOM_WINDOW_PADDING;
      // set the max image height to be the content height
      maxImageHeight = contentHeight;
    } else {
      // set the zoom window size to be either the max height or the max height * the max zoom window ratio, whichever is smaller
      zoomWindowSize = Math.min(
        contentHeight * MAX_ZOOM_WINDOW_RATIO,
        MAX_ZOOM_WINDOW_SIZE
      );

      // set the max image width to be the content width
      maxImageWidth = contentWidth;
      // set the max image height to be the content height minus the zoom window size and the zoom window padding
      maxImageHeight = contentHeight - zoomWindowSize - ZOOM_WINDOW_PADDING;
    }

    const { width: imageWidth, height: imageHeight } = originalDimensions;

    // Calculate scale factors for both dimensions
    const widthScale = maxImageWidth / imageWidth;
    const heightScale = maxImageHeight / imageHeight;

    // set the scale factor to be the minimum of the width scale and the height scale
    const scaleFactor = Math.min(widthScale, heightScale);

    // set the scaled dimensions to be the original dimensions multiplied by the scale factor
    setScaledDimensions({
      width: imageWidth * scaleFactor,
      height: imageHeight * scaleFactor,
    });

    // set the zoom window size to be the zoom window size
    setZoomWindowSize(zoomWindowSize);
  }, [
    contentContainerSize,
    isLandscape,
    originalDimensions,
    setScaledDimensions,
    setZoomWindowSize,
  ]);

  if (!scaledDimensions) return <Redirect href="/" />;

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContentContainerSize({ width, height });
  };

  if (!uri) return <Redirect href="/" />;

  const { width: scaledWidth, height: scaledHeight } = scaledDimensions;

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
          {isDragging ? (
            <ZoomPreview size={zoomWindowSize} />
          ) : (
            <Logo size={zoomWindowSize} />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <View
            style={{
              alignSelf: 'center',
              width: scaledWidth,
              height: scaledHeight,
            }}
          >
            <ImageBackground
              source={{ uri: uri ?? '' }}
              style={{
                width: scaledWidth,
                height: scaledHeight,
              }}
              resizeMode="contain"
            >
              <Overlay imageWidth={scaledWidth} imageHeight={scaledHeight} />
            </ImageBackground>
          </View>
        </View>
      </View>
    </BaseLayout>
  );
};

export default Edit;
