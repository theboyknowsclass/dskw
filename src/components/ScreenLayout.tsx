import React from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';

type ScreenLayoutProps = {
  children: React.ReactNode;
  scrollable?: boolean;
};

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  children,
  scrollable = true,
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  // Calculate header height based on platform
  const headerHeight = Platform.select({
    web: 64, // Standard header height for web
    ios: 44 + (insets.top || 0), // iOS header height + safe area
    android: 56 + (insets.top || 0), // Android header height + safe area
    default: 64, // Default header height
  });

  const Content = scrollable ? ScrollView : View;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: headerHeight,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <Content
        style={styles.content}
        contentContainerStyle={
          scrollable && [
            styles.scrollContent,
            { paddingBottom: Math.max(20, insets.bottom) },
          ]
        }
      >
        {children}
      </Content>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
});
