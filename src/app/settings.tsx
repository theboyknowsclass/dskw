import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button } from '../components/Button';
import { useErrorBoundary } from '../hooks/useErrorBoundary';
import { useTheme } from '../hooks/useTheme';

/**
 * Settings screen component
 *
 * Provides app settings and debugging tools including error boundary testing.
 */
export const Settings: React.FC = () => {
  const {
    throwError,
    throwGestureError,
    throwLongPressError,
    throwAsyncError,
  } = useErrorBoundary();
  const theme = useTheme();

  const handleAsyncError = async () => {
    try {
      await throwAsyncError('Async error from Settings page');
    } catch (error) {
      console.error('Caught async error:', error);
      // This error won't trigger the error boundary
      // since it's caught here, but will be logged
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          App Settings
        </Text>
        <Text style={[styles.description, { color: theme.colors.text }]}>
          Configure the application settings and preferences.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Error Boundary Testing
        </Text>
        <Text style={[styles.description, { color: theme.colors.text }]}>
          These buttons can be used to test the app's error handling
          capabilities.
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            title="Trigger Regular Error"
            onPress={() => throwError('Manually triggered error from Settings')}
            variant="outline"
            testID="trigger-error-button"
          />

          <Button
            title="Trigger Gesture Error"
            onPress={throwGestureError}
            variant="outline"
            testID="trigger-gesture-error-button"
          />

          <Button
            title="Trigger Long Press Error"
            onPress={throwLongPressError}
            variant="outline"
            testID="trigger-longpress-error-button"
          />

          <Button
            title="Trigger Async Error (Caught)"
            onPress={handleAsyncError}
            variant="outline"
            testID="trigger-async-error-button"
          />
        </View>

        <Text style={[styles.note, { color: theme.colors.text }]}>
          Note: The first three buttons will trigger the error boundary with
          different error types. The last button shows how to handle async
          errors properly.
        </Text>

        <Text style={[styles.tip, { color: theme.colors.primary }]}>
          If your app crashes during long press gestures, try the "Long Press
          Error" button to see if the error pattern matches what you're
          experiencing.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    opacity: 0.8,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 16,
  },
  note: {
    fontSize: 14,
    fontStyle: 'italic',
    opacity: 0.7,
    marginBottom: 12,
  },
  tip: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Settings;
