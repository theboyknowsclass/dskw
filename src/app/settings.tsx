import { useState } from 'react';
import { Switch, View, StyleSheet } from 'react-native';
import { Text, CloseButton } from '@components';

// doesn't use Layout Component
export const Settings: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => {
    setIsEnabled((previousState: boolean) => !previousState);
  };

  return (
    <View>
      <View style={styles.closeButtonContainer}>
        <CloseButton />
      </View>
      <View style={styles.container}>
        <View style={styles.toggleContainer}>
          <Switch onValueChange={toggleSwitch} value={isEnabled} />
          <Text>Switch</Text>
        </View>
      </View>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    alignItems: 'center',
    marginTop: 40,
  },
  toggleContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
});
