import { TransformImageButton } from '@molecules';
import { View, StyleSheet, ImageBackground, Platform } from 'react-native';
import { PageTemplate } from '@templates';
import { useContentMeasurements } from '@hooks';
import { useSourceImageStore } from '@stores';
import { PanZoomControl, SelectionOverlay } from '@components/organisms';

const BORDER_PERCENTAGE = 0.2;
const MAX_SCALE = 1;

const checkerboardPattern = require('../../../assets/checkerboard.png');

const EditContent: React.FC = () => {
  const { uri, originalDimensions } = useSourceImageStore();
  const { dimensions: contentDimensions, isReady } = useContentMeasurements();

  if (!isReady) {
    return null;
  }

  const minCheckerboardWidth =
    originalDimensions.width * (1 + BORDER_PERCENTAGE * 2);
  const minCheckerboardHeight =
    originalDimensions.height * (1 + BORDER_PERCENTAGE * 2);

  const imageDimensions = {
    width: originalDimensions.width,
    height: originalDimensions.height,
  };

  const widthScale = contentDimensions.width / imageDimensions.width;
  const heightScale = contentDimensions.height / imageDimensions.height;
  const initialScale = Math.min(widthScale, heightScale);
  const minScale = initialScale / (1 + BORDER_PERCENTAGE * 2);

  const checkerboardSize = {
    width: Math.max(
      minCheckerboardWidth,
      Math.round(contentDimensions.width / minScale)
    ),
    height: Math.max(
      minCheckerboardHeight,
      Math.round(contentDimensions.height / minScale)
    ),
  };

  const absoluteWindowSize = {
    width: contentDimensions.width / initialScale,
    height: contentDimensions.height / initialScale,
  };

  const borderWidth = (checkerboardSize.width - imageDimensions.width) / 2;
  const borderHeight = (checkerboardSize.height - imageDimensions.height) / 2;

  const offsetX = (absoluteWindowSize.width - imageDimensions.width) / 2;
  const offsetY = (absoluteWindowSize.height - imageDimensions.height) / 2;
  const initialTranlate = {
    x: -borderWidth + offsetX,
    y: -borderHeight + offsetY,
  };

  return (
    <View style={styles.container}>
      <PanZoomControl
        contentSize={checkerboardSize}
        controlSize={contentDimensions}
        initialScale={initialScale}
        minScale={minScale}
        maxScale={MAX_SCALE}
        initialTranslate={initialTranlate}
      >
        <ImageBackground
          source={checkerboardPattern}
          style={[
            styles.checkerboard,
            {
              width: checkerboardSize.width,
              height: checkerboardSize.height,
            },
          ]}
          resizeMode={Platform.OS === 'android' ? 'cover' : 'repeat'}
        >
          <ImageBackground
            source={{ uri: uri ?? undefined }}
            style={[
              {
                position: 'absolute',
                top: borderHeight,
                left: borderWidth,
                width: imageDimensions.width,
                height: imageDimensions.height,
              },
            ]}
          >
            <SelectionOverlay />
          </ImageBackground>
        </ImageBackground>
      </PanZoomControl>
    </View>
  );
};

export const Edit: React.FC = () => {
  return (
    <PageTemplate>
      <PageTemplate.ActionItems>
        <TransformImageButton />
      </PageTemplate.ActionItems>
      <EditContent />
    </PageTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    backgroundColor: 'transparent',
    borderRadius: 5,
  },
  checkerboard: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  overlayWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
