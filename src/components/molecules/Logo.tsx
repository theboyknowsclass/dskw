import { useTheme } from '@react-navigation/native';
import {
  Canvas,
  Circle,
  Group,
  Path,
  Skia,
  Text,
  useFont,
} from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';

interface LogoProps {
  size: number;
  fontSize?: number;
}

export const Logo: React.FC<LogoProps> = ({ size }) => {
  const { dark, colors } = useTheme();

  const foreground = dark ? colors.background : colors.primary;
  const background = dark ? colors.primary : colors.background;

  const points = [
    { x: 150, y: 150 },
    { x: 875, y: 200 },
    { x: 800, y: 700 },
    { x: 250, y: 875 },
  ];

  const fontPosition = { x: 250, y: 515 };
  const fontSize = 130;

  const width = Math.max(size, 0);
  const height = Math.max(size, 0);

  const scale = size / 1024;

  const pointRadius = 80 * scale;
  const strokeWidth = 30 * scale;
  const scaledPoints = points.map((point) => ({
    x: point.x * scale,
    y: point.y * scale,
  }));

  const scaledFontPosition = {
    x: fontPosition.x * scale,
    y: fontPosition.y * scale,
  };

  const scaledFontSize = fontSize * scale;

  const path = Skia.Path.Make();
  path.moveTo(scaledPoints[0].x, scaledPoints[0].y);
  path.lineTo(scaledPoints[1].x, scaledPoints[1].y);
  path.lineTo(scaledPoints[2].x, scaledPoints[2].y);
  path.lineTo(scaledPoints[3].x, scaledPoints[3].y);
  path.close();

  const pathStyle = useDerivedValue(() => {
    return dark ? 'stroke' : 'fill';
  }, [dark]);

  const pathColor = useDerivedValue(() => {
    return dark ? background : foreground;
  }, [dark]);

  const font = useFont(
    require('../../assets/Orbitron_500Medium.ttf'),
    scaledFontSize
  );

  const Point = ({ x, y }: { x: number; y: number }) => {
    return (
      <Group>
        <Circle
          r={pointRadius}
          cx={x}
          cy={y}
          color={background}
          strokeWidth={strokeWidth}
          style={'stroke'}
        />
        <Circle
          r={pointRadius - strokeWidth / 2}
          cx={x}
          cy={y}
          color={foreground}
          style={'fill'}
        />
      </Group>
    );
  };

  const Points = () => {
    return (
      <Group>
        {scaledPoints.map((point) => (
          <Point key={`${point.x}-${point.y}`} x={point.x} y={point.y} />
        ))}
      </Group>
    );
  };

  return (
    <Canvas
      style={{
        width: width,
        height: height,
        borderWidth: 0,
      }}
    >
      <Path
        path={path}
        color={pathColor}
        style={pathStyle}
        strokeWidth={strokeWidth}
      />
      <Points />
      <Text
        x={scaledFontPosition.x}
        y={scaledFontPosition.y}
        text="STR8N"
        font={font}
        color={background}
      />
    </Canvas>
  );
};
