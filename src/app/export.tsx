import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useImageStore } from '../stores/useImageStore';
import { useTheme } from '@react-navigation/native';
import { router } from 'expo-router';
import * as Sharing from 'expo-sharing';

// Get screen dimensions for responsive sizing
const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Process Image screen component
 * This screen displays the processed image
 */
export const ExportImageScreen: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { destinationUri } = useImageStore();

  // Go back to the home screen
  const handleBack = () => {
    router.back();
  };

  const handleShare = () => {
    if (destinationUri) {
      console.log('share uri', destinationUri);
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
              style={styles.processedImage}
              resizeMode="contain"
            />
          </View>
        ) : (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: colors.notification }]}>
              No processed image available
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.primary }]}
          onPress={handleBack}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.primary }]}
          onPress={handleShare}
        >
          <Text style={styles.backButtonText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.primary }]}
          onPress={handleSave}
        >
          <Text style={styles.backButtonText}>Save</Text>
        </TouchableOpacity>
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
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
    overflow: 'hidden',
    maxWidth: Math.min(SCREEN_WIDTH - 40, 600),
    aspectRatio: 1,
  },
  processedImage: {
    width: '100%',
    height: '100%',
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
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 30,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
