import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Typography, Spacing } from "../../constants/theme";

interface Props {
  checkInDay: number;
  checkOutDay: number;
}

export function StayDurationBanner({ checkInDay, checkOutDay }: Props) {
  const nights = Math.max(1, checkOutDay - checkInDay);

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🌙</Text>
      <Text style={styles.text}>
        Staying Day {checkInDay} → Day {checkOutDay} ({nights} {nights === 1 ? "night" : "nights"})
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary.lightBg,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: Spacing.screenPaddingH,
    marginTop: 14,
    marginBottom: 6,
    gap: 8,
  },
  icon: {
    fontSize: 14,
  },
  text: {
    color: Colors.primary.main,
    fontSize: 13,
    fontWeight: "600",
    fontFamily: Typography.fontFamilies.semibold,
  },
});
