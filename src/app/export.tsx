import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useImageStore } from '../stores/useImageStore';
import { useTheme } from '@react-navigation/native';
import { router } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { Button } from '../components/Button';
import { Image } from 'react-native';
/**
 * Process Image screen component
 * This screen displays the processed image
 */
export const ExportImageScreen: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { destinationUri, scaledDimensions } = useImageStore();

  // Go back to the home screen
  const handleBack = () => {
    router.back();
  };

  const handleShare = () => {
    if (destinationUri) {
      Sharing.shareAsync(destinationUri);
    }
  };

  const handleSave = () => {
    console.log('save');
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View style={styles.content}>
        {destinationUri ? (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: destinationUri }}
              style={[
                styles.processedImage,
                {
                  width: scaledDimensions.width,
                  height: scaledDimensions.height,
                },
              ]}
              resizeMode="contain"
            />
          </View>
        ) : (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: colors.notification }]}>
              Error
            </Text>
          </View>
        )}

        <Button
          title="Back"
          onPress={handleBack}
          variant="primary"
          size="large"
          style={styles.button}
        />
        <Button
          title="Share"
          onPress={handleShare}
          variant="primary"
          size="large"
          style={styles.button}
        />
        <Button
          title="Save"
          onPress={handleSave}
          variant="primary"
          size="large"
          style={styles.button}
        />
      </View>
    </View>
  );
};

export default ExportImageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    alignSelf: 'center',
  },
  imageContainer: {
    alignItems: 'center',
  },
  processedImage: {
    width: 400,
    height: 400,
  },
  errorContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 30,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    marginTop: 30,
    width: '100%',
    maxWidth: 300,
  },
});
