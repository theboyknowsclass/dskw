import { SettingsToggle } from '@atoms';
import { useScreenDimensions } from '@hooks';
import { CloseButton } from '@molecules';
import { useSettingsStore } from '@stores';
import { View, StyleSheet, Text } from 'react-native';

export const Settings: React.FC = () => {
  const { cropToOverlay, setCropToOverlay } = useSettingsStore();
  const { isMobile } = useScreenDimensions();

  return (
    <View>
      <View style={styles.closeButtonContainer}>
        <CloseButton />
      </View>
      <View style={styles.container}>
        {isMobile && <Text>Mobile</Text>}
        <SettingsToggle
          title="Crop to overlay"
          isEnabled={cropToOverlay}
          onToggle={setCropToOverlay}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    alignItems: 'center',
    marginTop: 40,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
});
