import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  roomNumber: string;
  floor?: string;
  roomType?: string;
}

export function RoomCard({ roomNumber, floor, roomType }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Your Room</Text>
      <Text style={styles.roomNumber}>{roomNumber}</Text>
      <View style={styles.metaRow}>
        {floor ? <Text style={styles.metaText}>Floor {floor}</Text> : null}
        {roomType ? (
          <Text style={styles.metaText}>
            {floor ? "· " : ""}
            {roomType}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F3F4F6",
    borderLeftWidth: 4,
    borderLeftColor: "#0F766E",
    borderRadius: 16,
    padding: 16,
  },
  label: {
    color: "#9CA3AF",
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Medium",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  roomNumber: {
    color: "#111827",
    fontSize: 40,
    lineHeight: 44,
    fontFamily: "PlusJakartaSans-Bold",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  metaText: {
    color: "#6B7280",
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Medium",
  },
});
