import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Typography, Spacing, Shadows } from "../../constants/theme";

interface Props {
  nextHotelName: string;
  checkInDay: number;
  checkInTime: string;
}

export function TransitionDayCard({ nextHotelName, checkInDay, checkInTime }: Props) {
  return (
    <View style={[styles.card, Shadows.sm]}>
      <View style={styles.iconBg}>
        <Ionicons name="bus-outline" size={28} color={Colors.primary.main} />
      </View>
      <Text style={styles.title}>Travelling Today</Text>
      <Text style={styles.description}>
        You are travelling today between hotel locations.
      </Text>
      <View style={styles.divider} />
      <View style={styles.nextInfoRow}>
        <Ionicons name="business-outline" size={16} color={Colors.neutral.textSecondary} />
        <Text style={styles.nextInfoText}>
          Next Hotel: <Text style={styles.boldText}>{nextHotelName}</Text>
        </Text>
      </View>
      <View style={styles.nextInfoRow}>
        <Ionicons name="time-outline" size={16} color={Colors.neutral.textSecondary} />
        <Text style={styles.nextInfoText}>
          Check-in: Day {checkInDay} at {checkInTime}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    marginHorizontal: Spacing.screenPaddingH,
    marginTop: 20,
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: Colors.neutral.border,
  },
  iconBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary.lightBg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.neutral.textPrimary,
    fontFamily: Typography.fontFamilies.bold,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.neutral.textSecondary,
    fontFamily: Typography.fontFamilies.regular,
    textAlign: "center",
    marginBottom: 16,
  },
  divider: {
    height: 0.5,
    backgroundColor: Colors.neutral.border,
    width: "100%",
    marginBottom: 16,
  },
  nextInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  nextInfoText: {
    fontSize: 13,
    color: Colors.neutral.textSecondary,
    fontFamily: Typography.fontFamilies.regular,
  },
  boldText: {
    fontWeight: "600",
    color: Colors.neutral.textPrimary,
  },
});
