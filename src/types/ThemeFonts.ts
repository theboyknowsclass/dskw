import { ThemeFontStyle } from './ThemeFontStyle';

/**
 * Represents the fonts of a theme.
 * @property regular - The regular font style of the theme
 * @property medium - The medium font style of the theme
 * @property bold - The bold font style of the theme
 * @property heavy - The heavy font style of the theme
 */
export type ThemeFonts = {
  regular: ThemeFontStyle;
  medium: ThemeFontStyle;
  bold: ThemeFontStyle;
  heavy: ThemeFontStyle;
};
