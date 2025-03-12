import { DefaultTheme, Theme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

export type ThemeType = 'light' | 'dark' | 'system';
export type ThemeColors = {
  primary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
};

type ThemeFontStyle = {
  fontFamily: string;
  fontWeight:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
};

export type ThemeFonts = {
  regular: ThemeFontStyle;
  medium: ThemeFontStyle;
  bold: ThemeFontStyle;
  heavy: ThemeFontStyle;
};
interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const THEME_KEY = 'theme';

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: DefaultTheme,
  setTheme: (theme: Theme) => {
    AsyncStorage.setItem(THEME_KEY, JSON.stringify(theme));
    set({ theme });
  },
}));

export const getStoredTheme = async (): Promise<Theme | undefined> => {
  try {
    const jsonValue = await AsyncStorage.getItem(THEME_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : undefined;
  } catch (e) {
    console.error(e);
    // error reading value
    return undefined;
  }
};
