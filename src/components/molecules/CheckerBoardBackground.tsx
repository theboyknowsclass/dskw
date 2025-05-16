import { useTheme } from '@react-navigation/native';
import {
  ImageBackground,
  ImageSourcePropType,
  Platform,
  StyleSheet,
} from 'react-native';

interface CheckerBoardBackgroundProps {
  children: React.ReactNode | React.ReactNode[];
  width: number;
  height: number;
}

const checkerBoardLightSmall = require('@assets/checkerboard_light_30px.png');
const checkerBoardLightMedium = require('@assets/checkerboard_light_60px.png');
const checkerBoardLightLarge = require('@assets/checkerboard_light_120px.png');

const checkerBoardDarkSmall = require('@assets/checkerboard_dark_30px.png');
const checkerBoardDarkMedium = require('@assets/checkerboard_dark_60px.png');
const checkerBoardDarkLarge = require('@assets/checkerboard_dark_120px.png');

const checkerBoards = new Map<string, Map<string, ImageSourcePropType>>([
  [
    'light',
    new Map<string, ImageSourcePropType>([
      ['small', checkerBoardLightSmall],
      ['medium', checkerBoardLightMedium],
      ['large', checkerBoardLightLarge],
    ]),
  ],
  [
    'dark',
    new Map<string, ImageSourcePropType>([
      ['small', checkerBoardDarkSmall],
      ['medium', checkerBoardDarkMedium],
      ['large', checkerBoardDarkLarge],
    ]),
  ],
]);

export const CheckerBoardBackground: React.FC<CheckerBoardBackgroundProps> = ({
  children,
  width,
  height,
}) => {
  const { dark } = useTheme();

  let size = 'small';

  if (width > 5000) {
    size = 'large';
  }

  if (width > 3000) {
    size = 'medium';
  }

  const variant = dark ? 'dark' : 'light';

  const source = checkerBoards.get(variant)?.get(size);

  return (
    <ImageBackground
      source={source}
      style={[
        styles.checkerboard,
        {
          width: width,
          height: height,
        },
      ]}
      resizeMode={Platform.OS === 'android' ? 'cover' : 'repeat'}
    >
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  checkerboard: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
