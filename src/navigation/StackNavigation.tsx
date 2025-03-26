import { Stack } from 'expo-router';

export const StackNavigation = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    ></Stack>
  );
};
