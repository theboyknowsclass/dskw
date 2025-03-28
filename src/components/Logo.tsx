import { useTheme } from '@react-navigation/native';
import { Svg, Polygon, Circle, Text } from 'react-native-svg';
import { useLayout } from '../hooks/useLayout';

type LogoProps = {
  size?: number;
};

export const Logo: React.FC<LogoProps> = ({ size }) => {
  const { dark, colors } = useTheme();
  const {
    logo: { width, height },
  } = useLayout();

  const foreground = dark ? colors.background : colors.primary;
  const background = dark ? colors.primary : colors.background;
  const stroke = colors.primary;

  return (
    <Svg viewBox="0 0 1024 1024" width={size ?? width} height={size ?? height}>
      <Polygon
        points="150,150 875,200 800,700 250,875"
        fill={foreground}
        stroke={stroke}
        strokeWidth="30"
      />
      <Circle
        r="80"
        cx="150"
        cy="150"
        fill={foreground}
        stroke={background}
        strokeWidth="30"
      />
      <Circle
        r="80"
        cx="875"
        cy="200"
        fill={foreground}
        stroke={background}
        strokeWidth="30"
      />
      <Circle
        r="80"
        cx="800"
        cy="700"
        fill={foreground}
        stroke={background}
        strokeWidth="30"
      />
      <Circle
        r="80"
        cx="250"
        cy="875"
        fill={foreground}
        stroke={background}
        strokeWidth="30"
      />
      <Text
        x="50%"
        y="47%"
        alignmentBaseline="middle"
        textAnchor="middle"
        fill={background}
        stroke={background}
        fontSize="160"
        fontFamily="Orbitron_500Medium"
        fontWeight="500"
      >
        dSkw
      </Text>
    </Svg>
  );
};
