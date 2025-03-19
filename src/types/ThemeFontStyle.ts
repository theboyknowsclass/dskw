/**
 * Represents a font style with a font family and weight.
 * @property fontFamily - The font family name
 * @property fontWeight - The weight of the font (normal, bold, etc.)
 */
export type ThemeFontStyle = {
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
