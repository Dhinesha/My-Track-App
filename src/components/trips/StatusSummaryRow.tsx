import React from "react";
import { fonts, textStyles } from '../../constants/theme';
import { View, Text, StyleSheet } from "react-native";

interface Props {
  selfCheckedIn: boolean;
  familyCheckedIn: number;
  familyTotal: number;
  hotelCheckedIn: boolean;
}

function Chip({ label, done }: { label: string; done: boolean }) {
  return (
    <View style={[styles.chip, done ? styles.chipDone : styles.chipPending]}>
      <View style={[styles.dot, done ? styles.dotDone : styles.dotPending]} />
      <Text
        style={[
          styles.chipText,
          done ? styles.chipTextDone : styles.chipTextPending,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

export function StatusSummaryRow({
  selfCheckedIn,
  familyCheckedIn,
  familyTotal,
  hotelCheckedIn,
}: Props) {
  const familyDone = familyCheckedIn === familyTotal;

  return (
    <View style={styles.container}>
      <Chip label="My Check-in" done={selfCheckedIn} />
      <Chip
        label={`Family ${familyCheckedIn}/${familyTotal}`}
        done={familyDone}
      />
      <Chip label="Hotel" done={hotelCheckedIn} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8 as any,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipDone: {
    backgroundColor: "#ECFDF5",
    borderColor: "#BBF7D0",
  },
  chipPending: {
    backgroundColor: "#FFFBEB",
    borderColor: "#FDE68A",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  dotDone: { backgroundColor: "#16A34A" },
  dotPending: { backgroundColor: "#F59E0B" },
  chipText: {
    fontSize: 12,
    fontFamily: fonts.medium,
  },
  chipTextDone: { color: "#065F46",
    fontFamily: fonts.regular,},
  chipTextPending: { color: "#92400E",
    fontFamily: fonts.regular,},
});
