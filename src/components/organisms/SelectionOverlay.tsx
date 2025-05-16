import { Canvas, Points } from '@shopify/react-native-skia';
import { useTheme } from '@react-navigation/native';
import { useOverlayStore, useSourceImageStore } from '@stores';
import { makeMutable, useDerivedValue } from 'react-native-reanimated';
import { TouchPoint } from '../molecules/TouchPoint';
import { View, StyleSheet } from 'react-native';
import { Point } from '@types';
import { useContext } from 'react';
import { PanZoomContext } from '@contexts/PanZoomContext';

export const SelectionOverlay: React.FC = () => {
  const { colors } = useTheme();
  const { scale } = useContext(PanZoomContext);
  const points = useOverlayStore((state) => state.points);
  const pointIndices = Array.from(points, (_, k) => k);
  const { width, height } = useSourceImageStore(
    (state) => state.originalDimensions
  );

  const absolutePoints = points.map((p) =>
    makeMutable({
      x: p.x * width,
      y: p.y * height,
    })
  );

  const overlayPoints = useDerivedValue<Point[]>(() => {
    return [...absolutePoints, absolutePoints[0]].map((p) => ({
      x: p.value.x,
      y: p.value.y,
    }));
  }, [absolutePoints, ...absolutePoints]);

  const lineWidth = useDerivedValue(() => {
    return 3 / scale.value;
  });

  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}>
        <Points
          points={overlayPoints}
          mode="polygon"
          color={colors.primary}
          style="stroke"
          strokeWidth={lineWidth}
        />
      </Canvas>
      <View style={styles.pointsContainer}>
        {pointIndices.map((index) => (
          <TouchPoint
            key={index}
            index={index}
            position={absolutePoints[index]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
    width: '100%',
    height: '100%',
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    width: '100%',
    height: '100%',
  },
  pointsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
    width: '100%',
    height: '100%',
  },
});
