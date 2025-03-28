import { BackButton } from '@components/BackButton';
import { Layout } from '@components/Layout';
import { Logo } from '@components/Logo';
import { Overlay } from '@components/Overlay';
import { ZoomPreview } from '@components/ZoomPreview';
import { useScreenDimensions } from '@hooks/useScreenDimensions';
import { useImageStore } from '@stores/useImageStore';
import { useOverlayStore } from '@stores/useOverlayStore';
import { useState } from 'react';
import { View, Image, LayoutChangeEvent } from 'react-native';

export const Edit: React.FC = () => {
  const { uri, originalDimensions, setScaledDimensions, scaledDimensions } =
    useImageStore();
  const { activePointIndex } = useOverlayStore();
  const { isLandscape } = useScreenDimensions();
  const [zoomWindowSize, setZoomWindowSize] = useState<number>(0);

  const isDragging = activePointIndex != null;

  if (!uri || !originalDimensions) return null;

  const { width, height } = originalDimensions;

  const onLayout = (event: LayoutChangeEvent) => {
    const { width: maxWidth, height: maxHeight } = event.nativeEvent.layout;
    console.log('maxWidth', maxWidth);
    console.log('maxHeight', maxHeight);

    // Calculate scale factors for both dimensions
    let widthScale = maxWidth / width;
    let heightScale = maxHeight / height;

    // If the screen is landscape, we want to scale the width to the max width
    if (isLandscape) {
      widthScale = widthScale / 2;
      setZoomWindowSize(maxWidth / 2 - 40);
    } else {
      heightScale = heightScale / 2;
      setZoomWindowSize(maxWidth / 2 - 40);
    }

    const scaleFactor = Math.min(widthScale, heightScale);

    setScaledDimensions({
      width: width * scaleFactor,
      height: height * scaleFactor,
    });
  };

  if (!scaledDimensions) return null;

  const { width: scaledWidth, height: scaledHeight } = scaledDimensions;

  return (
    <Layout actionItems={[<BackButton />]}>
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
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            minWidth: zoomWindowSize + 40,
            minHeight: zoomWindowSize + 40,
          }}
        >
          {isDragging ? (
            <ZoomPreview size={zoomWindowSize} />
          ) : (
            <Logo size={zoomWindowSize} />
          )}
        </View>
        <View
          style={{
            flex: 1,
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
          }}
        >
          <Image
            source={{ uri: uri }}
            style={{ width: scaledWidth, height: scaledHeight }}
            resizeMode="contain"
          ></Image>
          <Overlay imageWidth={scaledWidth} imageHeight={scaledHeight} />
        </View>
      </View>
    </Layout>
  );
};

export default Edit;
