import { CloseButton, SettingsToggle } from '@molecules';
import { useSettingsStore } from '@stores';
import { View, StyleSheet } from 'react-native';

export const Settings: React.FC = () => {
  const { cropToOverlay, setCropToOverlay } = useSettingsStore();

  return (
    <View>
      <View style={styles.closeButtonContainer}>
        <CloseButton />
      </View>
      <View style={styles.container}>
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
    top: 10,
    left: 10,
  },
});
