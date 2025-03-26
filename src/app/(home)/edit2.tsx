import { Layout } from '@components/Layout';
import { Logo } from '@components/Logo';
import { Overlay } from '@components/Overlay';
import { ZoomPreview } from '@components/ZoomPreview';
import { useImageStore } from '@stores/useImageStore';
import { useOverlayStore } from '@stores/useOverlayStore';
import { View, Image, LayoutChangeEvent } from 'react-native';

export const Edit: React.FC = () => {
  const { uri, originalDimensions, setScaledDimensions, scaledDimensions } =
    useImageStore();
  const { activePointIndex } = useOverlayStore();

  const isDragging = activePointIndex != null;

  if (!uri || !originalDimensions) return null;

  const { width, height } = originalDimensions;

  const onLayout = (event: LayoutChangeEvent) => {
    const { width: maxWidth, height: maxHeight } = event.nativeEvent.layout;
    console.log('maxWidth', maxWidth);
    console.log('maxHeight', maxHeight);
    // Calculate scale factors for both dimensions
    const widthScale = maxWidth / width;
    const heightScale = maxHeight / height;

    const scaleFactor = Math.min(widthScale, heightScale);

    setScaledDimensions({
      width: width * scaleFactor,
      height: height * scaleFactor,
    });
  };

  if (!scaledDimensions) return null;

  const { width: scaledWidth, height: scaledHeight } = scaledDimensions;

  return (
    <Layout>
      <View onLayout={onLayout} style={{ width: '100%', height: '100%' }}>
        {isDragging ? <ZoomPreview /> : <Logo />}
        <Image
          source={{ uri: uri }}
          style={{ width: scaledWidth, height: scaledHeight }}
          resizeMode="contain"
        ></Image>
        <Overlay imageWidth={scaledWidth} imageHeight={scaledHeight} />
      </View>
    </Layout>
  );
};

export default Edit;
