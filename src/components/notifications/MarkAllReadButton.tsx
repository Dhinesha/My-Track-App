import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Colors, Typography } from "../../constants/theme";

interface Props {
  onPress: () => void;
}

export function MarkAllReadButton({ onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.btn}>
      <Text style={styles.text}>Mark all read</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  text: {
    color: Colors.primary.main,
    fontSize: 14,
    fontFamily: Typography.fontFamilies.semibold,
    fontWeight: "600",
  },
});
