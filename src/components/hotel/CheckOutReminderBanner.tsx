import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Typography, Spacing } from "../../constants/theme";

interface Props {
  currentDay: number;
  checkInDay: number;
  checkOutDay: number;
  checkInTime: string;
  checkOutTime: string;
}

export function CheckOutReminderBanner({
  currentDay,
  checkInDay,
  checkOutDay,
  checkInTime,
  checkOutTime,
}: Props) {
  const isCheckOut = currentDay === checkOutDay;
  const isCheckIn = currentDay === checkInDay;

  if (!isCheckOut && !isCheckIn) return null;

  if (isCheckOut) {
    return (
      <View style={[styles.container, styles.checkoutContainer]}>
        <Ionicons name="warning-outline" size={16} color="#854F0B" />
        <Text style={[styles.text, styles.checkoutText]}>
          Check-out today by {checkOutTime} — settle your bill before leaving
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.checkinContainer]}>
      <Ionicons name="information-circle-outline" size={16} color={Colors.primary.main} />
      <Text style={[styles.text, styles.checkinText]}>
        Check-in today from {checkInTime}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    gap: 8,
  },
  checkoutContainer: {
    backgroundColor: "#FEF3E2",
    borderColor: "#F0C070",
  },
  checkinContainer: {
    backgroundColor: Colors.primary.lightBg,
    borderColor: Colors.primary.lightBg,
  },
  text: {
    fontSize: 13,
    fontWeight: "500",
    fontFamily: Typography.fontFamilies.regular,
    flex: 1,
  },
  checkoutText: {
    color: "#854F0B",
  },
  checkinText: {
    color: Colors.primary.main,
  },
});
