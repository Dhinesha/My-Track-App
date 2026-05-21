import React from "react";
import { fonts, textStyles } from '../../constants/theme';
import { View, Text, StyleSheet } from "react-native";
import { differenceInDays, format } from "date-fns";

interface Props {
  startDate: string;
  endDate: string;
}

export function DayPill({ startDate, endDate }: Props) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  const totalDays = differenceInDays(end, start) + 1;
  const currentDay = Math.min(
    Math.max(differenceInDays(today, start) + 1, 1),
    totalDays,
  );
  const dayLabel = format(today, "EEEE d MMM");

  return (
    <View style={styles.container}>
      <Text style={styles.text} numberOfLines={1}>
        Day {currentDay} of {totalDays} — {dayLabel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  text: {
    color: "#1E3A8A",
    fontSize: 12,
    fontFamily: fonts.medium,
  },
});
