import { useTheme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { Icon } from '@components/Icon';
import { router } from 'expo-router';

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const { colors } = useTheme();
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        marginLeft: 0,
        paddingStart: 0,
        paddingEnd: 0,
      }}
    >
      {/* <DrawerItem
        label="Home"
        style={{ margin: 0, padding: 0 }}
        labelStyle={[{ color: colors.primary }, styles.labelStyle]}
        icon={() => <Icon name="home" />}
        onPress={() => {
          router.push('/home/dskw');
        }}
      /> */}
      <DrawerItem
        label="Settings"
        labelStyle={[{ color: colors.primary }, styles.labelStyle]}
        icon={() => <Icon name="settings" />}
        onPress={() => {
          router.navigate('settings');
        }}
      />
    </DrawerContentScrollView>
  );
};

export const DrawerNavigation = () => {
  const theme = useTheme();

  return (
    <Drawer
      screenOptions={{
        // Ensure header background matches current theme
        headerTransparent: true,
        headerTitleStyle: {
          display: 'none',
        },
        headerTintColor: theme.colors.primary,
        // Ensure drawer background matches current theme
        drawerStyle: {
          width: 70,
          borderBottomStartRadius: 0,
          borderTopRightRadius: 0,
          borderBottomEndRadius: 0,
          borderRadius: 0,
          margin: 0,
          padding: 0,
        },
        drawerContentContainerStyle: {
          padding: 0,
          margin: 0,
          backgroundColor: theme.colors.background,
        },
        drawerContentStyle: {
          padding: 0,
          margin: 0,
          backgroundColor: theme.colors.background,
        },
        drawerLabelStyle: {
          fontFamily: 'Orbitron_400Regular',
        },
        overlayColor: theme.dark
          ? styles.drawerOverlayDark.backgroundColor
          : styles.drawerOverlayLight.backgroundColor,
      }}
      drawerContent={CustomDrawerContent}
    ></Drawer>
  );
};

const styles = StyleSheet.create({
  drawerOverlayDark: {
    backgroundColor: 'rgba(33, 33, 33, 0.6)',
  },
  drawerOverlayLight: {
    backgroundColor: 'rgba( 220, 220, 220, 0.6)',
  },
  labelStyle: {
    fontFamily: 'Orbitron_400Regular',
  },
});
