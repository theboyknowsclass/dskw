import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme as useNavigationTheme } from '@react-navigation/native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isGestureError: boolean;
  isLongPressError: boolean;
}

/**
 * ErrorBoundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the app.
 * Provides special handling for gesture-related errors.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isGestureError: false,
      isLongPressError: false,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if this is likely a gesture-related error
    const isGestureError =
      (error.message &&
        (error.message.includes('gesture') ||
          error.message.includes('pan') ||
          error.message.includes('touch') ||
          error.message.includes('handler') ||
          error.message.includes('event'))) ||
      (error.stack &&
        (error.stack.includes('GestureHandler') ||
          error.stack.includes('PanGestureHandler') ||
          error.stack.includes('LongPressGestureHandler') ||
          error.stack.includes('TapGestureHandler'))) ||
      false;

    // Check specifically for long press issues
    const isLongPressError =
      (error.message &&
        (error.message.includes('longPress') ||
          error.message.includes('long press') ||
          error.message.includes('timer') ||
          error.message.includes('timeout'))) ||
      (error.stack &&
        (error.stack.includes('LongPressGestureHandler') ||
          error.stack.includes('setTimeout') ||
          error.stack.includes('clearTimeout'))) ||
      false;

    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
      isGestureError,
      isLongPressError,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Enhanced logging for better debugging
    console.error('ErrorBoundary caught an error:', error);
    console.error('Component stack trace:', errorInfo.componentStack);

    if (error.stack) {
      console.error('Error stack:', error.stack);
    }

    // Determine if it's a gesture error
    const isGestureError =
      (error.message &&
        (error.message.includes('gesture') ||
          error.message.includes('pan') ||
          error.message.includes('touch') ||
          error.message.includes('handler') ||
          error.message.includes('event'))) ||
      (error.stack &&
        (error.stack.includes('GestureHandler') ||
          error.stack.includes('PanGestureHandler') ||
          error.stack.includes('LongPressGestureHandler') ||
          error.stack.includes('TapGestureHandler'))) ||
      false;

    // Check specifically for long press issues
    const isLongPressError =
      (error.message &&
        (error.message.includes('longPress') ||
          error.message.includes('long press') ||
          error.message.includes('timer') ||
          error.message.includes('timeout'))) ||
      (error.stack &&
        (error.stack.includes('LongPressGestureHandler') ||
          error.stack.includes('setTimeout') ||
          error.stack.includes('clearTimeout'))) ||
      false;

    this.setState({
      errorInfo,
      isGestureError,
      isLongPressError,
    });
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      isGestureError: false,
      isLongPressError: false,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use a functional component for the error UI to use the theme hook
      return (
        <ErrorFallbackUI
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          isGestureError={this.state.isGestureError}
          isLongPressError={this.state.isLongPressError}
          onReset={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

// Separate functional component for the error UI so we can use hooks
interface ErrorFallbackUIProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isGestureError: boolean;
  isLongPressError: boolean;
  onReset: () => void;
}

const ErrorFallbackUI: React.FC<ErrorFallbackUIProps> = ({
  error,
  errorInfo,
  isGestureError,
  isLongPressError,
  onReset,
}) => {
  // Use the navigation theme
  const theme = useNavigationTheme();

  // Determine the title and message based on the error type
  let title = 'Oops, Something Went Wrong';
  let message = "The app encountered an error and couldn't continue.";

  if (isLongPressError) {
    title = 'Long Press Error Detected';
    message =
      'The app crashed during a long press gesture. This might be related to touch timing or an event handler issue.';
  } else if (isGestureError) {
    title = 'Gesture Error Detected';
    message =
      'The app encountered an error during an active gesture. This might be related to touch handling or animations.';
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Ionicons name="alert-circle" size={64} color="#FF3B30" />
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {title}
        </Text>
        <Text style={[styles.message, { color: theme.colors.text }]}>
          {message}
        </Text>

        {__DEV__ && (
          <View
            style={[
              styles.errorDetails,
              { backgroundColor: theme.dark ? '#333' : '#f8f8f8' },
            ]}
          >
            <Text style={[styles.errorText, { color: '#FF3B30' }]}>
              {error?.toString()}
            </Text>

            {isLongPressError && (
              <Text style={[styles.tipText, { color: theme.colors.primary }]}>
                Tip: Try wrapping your LongPressGestureHandler in a try/catch
                block or adjust the minDurationMs property to avoid timing
                issues.
              </Text>
            )}

            <Text style={[styles.stackText, { color: theme.colors.text }]}>
              {errorInfo?.componentStack}
            </Text>

            {error?.stack && (
              <Text style={[styles.stackText, { color: theme.colors.text }]}>
                Stack trace: {error.stack}
              </Text>
            )}
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={onReset}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    opacity: 0.8,
  },
  errorDetails: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  errorText: {
    fontSize: 14,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    marginVertical: 12,
    fontWeight: 'bold',
  },
  stackText: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 8,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
