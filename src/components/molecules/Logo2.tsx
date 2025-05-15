import { useTheme } from '@react-navigation/native';
import { Canvas, ImageSVG, Skia } from '@shopify/react-native-skia';

const getLogoSvg = (foreground: string, background: string) => {
  return `<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg" >
   <polygon points="150,150 875,200 800,700 250,875" fill="${foreground}" stroke="${foreground}" stroke-width="30" />
   <circle r="80" cx="150" cy="150" fill="${foreground}" stroke="${background}" stroke-width="30" />
   <circle r="80" cx="875" cy="200" fill="${foreground}" stroke="${background}" stroke-width="30" />
   <circle r="80" cx="800" cy="700" fill="${foreground}" stroke="${background}" stroke-width="30" />
   <circle r="80" cx="250" cy="875" fill="${foreground}" stroke="${background}" stroke-width="30" />
   <text x="50%" y="47%" dominant-baseline="middle" text-anchor="middle" fill="${background}" stroke="${background}" font-size="130" font-family="Orbitron" font-weight="500">STR8N</text>
</svg>`;
};

export const Logo2 = ({ size }: { size: number }) => {
  const { colors } = useTheme();
  const svg = Skia.SVG.MakeFromString(
    getLogoSvg(colors.primary, colors.background)
  );

  return (
    <Canvas
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        borderWidth: 1,
        borderColor: 'red',
      }}
    >
      {svg && <ImageSVG svg={svg} width={size} height={size} />}
    </Canvas>
  );
};
