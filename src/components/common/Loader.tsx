import React from "react";
import { View, StyleSheet, ActivityIndicator, ViewStyle } from "react-native";
import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";

interface LoaderProps {
  visible: boolean;
  size?: "small" | "large";
  color?: string;
  style?: ViewStyle;
}

export const Loader: React.FC<LoaderProps> = ({
  visible,
  size = "large",
  color = Colors.primary,
  style,
}) => {
  if (!visible) return null;

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
});
