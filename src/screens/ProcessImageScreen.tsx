import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useTheme } from '../contexts/ThemeContext';
import { Header } from '../components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useImageStore } from '../stores/useImageStore';

// Get screen dimensions for responsive sizing
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Define the navigation props type
type ProcessImageScreenProps = {
  navigation: DrawerNavigationProp<any, any>;
};

/**
 * Process Image screen component
 * This screen displays the processed image
 */
export const ProcessImageScreen: React.FC<ProcessImageScreenProps> = ({
  navigation,
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { destinationUri } = useImageStore();

  // Go back to the home screen
  const handleBack = () => {
    navigation.goBack();
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
      <Header navigation={navigation} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>
            Processed Image
          </Text>

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
              <Text style={[styles.errorText, { color: colors.error }]}>
                No processed image available
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.primary }]}
            onPress={handleBack}
          >
            <Text style={styles.backButtonText}>Back to Image Selection</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
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
    borderRadius: 8,
    marginVertical: 30,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
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
