import { TransformImageButton } from '@molecules';
import { View, ImageBackground, StyleSheet } from 'react-native';
import { PageTemplate } from '@templates';
import { Overlay, ZoomPreview } from '@organisms';
import { useEdit, ZOOM_WINDOW_PADDING } from './useEdit';

const EditContent: React.FC = () => {
  const { uri, isLandscape, zoomWindowSize, scaledWidth, scaledHeight } =
    useEdit();
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        flexDirection: isLandscape ? 'row' : 'column',
      }}
    >
      {zoomWindowSize ? (
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
      ) : null}
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
  imagePreview: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
