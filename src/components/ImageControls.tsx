import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "./Button";

type ImageControlsProps = {
  onSelectImage: () => void;
  isLoading: boolean;
  error?: string | null;
  textColor: string;
};

export const ImageControls: React.FC<ImageControlsProps> = ({
  onSelectImage,
  isLoading,
  error,
  textColor,
}) => {
  return (
    <View style={styles.buttonContainer}>
      <Button
        title="Select Image"
        onPress={onSelectImage}
        loading={isLoading}
        size="large"
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    marginTop: 20,
    textAlign: "center",
  },
});
