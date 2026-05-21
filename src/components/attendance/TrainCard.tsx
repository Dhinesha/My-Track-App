import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { Colors, Typography, fonts, textStyles } from '../../constants/theme';
import { TransportLeg } from "../../hooks/useAttendance";

interface Props {
  leg: TransportLeg;
  seatNumber: string;
  pnrNumber: string;
  berthNumber?: string;
}

export function TrainCard({ leg, seatNumber, pnrNumber, berthNumber }: Props) {
  const handleCopyPNR = async () => {
    if (!pnrNumber) return;
    await Clipboard.setStringAsync(pnrNumber);
    Alert.alert("PNR Copied!", "Train PNR has been copied to your clipboard.");
  };

  return (
    <View style={styles.card}>
      {/* Header Row */}
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Ionicons name="train" size={24} color="#BA7517" />
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.trainName}>
            {leg.train_name || "Express Train"}
          </Text>
          <Text style={styles.trainNumber}>
            No: {leg.train_number || "12301"}
          </Text>
        </View>
      </View>

      {/* Route Row */}
      <View style={styles.routeRow}>
        <View style={styles.routePoint}>
          <Text style={styles.placeText}>{leg.departure_place}</Text>
          <Text style={styles.timeText}>{leg.departure_time}</Text>
        </View>
        <Ionicons name="arrow-forward" size={18} color={Colors.neutral.textSecondary} style={styles.routeArrow} />
        <View style={[styles.routePoint, { alignItems: "flex-end" }]}>
          <Text style={[styles.placeText, { textAlign: "right" }]}>{leg.arrival_place}</Text>
          <Text style={styles.timeText}>{leg.arrival_time}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* PNR Box */}
      {pnrNumber ? (
        <View style={styles.pnrContainer}>
          <View>
            <Text style={styles.pnrLabel}>PNR NUMBER</Text>
            <Text style={styles.pnrValue}>{pnrNumber}</Text>
          </View>
          <TouchableOpacity
            onPress={handleCopyPNR}
            style={styles.copyBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="copy-outline" size={18} color="#BA7517" />
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Grid (2x2) */}
      <View style={styles.grid}>
        <View style={styles.gridRow}>
          <View style={styles.gridCell}>
            <Text style={styles.cellLabel}>COACH</Text>
            <Text style={styles.cellValue}>{leg.coach || "B4"}</Text>
          </View>
          <View style={styles.gridCell}>
            <Text style={styles.cellLabel}>BERTH</Text>
            <Text style={styles.cellValue}>{berthNumber || "12 (Upper)"}</Text>
          </View>
        </View>
        <View style={styles.gridRow}>
          <View style={styles.gridCell}>
            <Text style={styles.cellLabel}>SEAT</Text>
            <Text style={styles.cellValue}>{seatNumber || "Seat 24"}</Text>
          </View>
          <View style={styles.gridCell}>
            <Text style={styles.cellLabel}>CLASS</Text>
            <Text style={styles.cellValue}>{leg.berth_type || "3 Tier AC"}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 0.5,
    borderColor: Colors.neutral.border,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FAEEDA",
    alignItems: "center",
    justifyContent: "center",
  },
  headerRight: {
    flex: 1,
  },
  trainName: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.neutral.textPrimary,
    fontFamily: fonts.bold,
  },
  trainNumber: {
    fontSize: 12,
    color: Colors.neutral.textMuted,
    fontFamily: fonts.regular,
  },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  routePoint: {
    flex: 1,
  },
  placeText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.neutral.textPrimary,
    fontFamily: fonts.bold,
  },
  timeText: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.neutral.textSecondary,
    fontFamily: fonts.bold,
    marginTop: 4,
  },
  routeArrow: {
    marginHorizontal: 12,
  },
  divider: {
    height: 0.5,
    backgroundColor: Colors.neutral.border,
    marginBottom: 14,
  },
  pnrContainer: {
    backgroundColor: Colors.neutral.pageBackground,
    padding: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    fontFamily: fonts.regular,},
  pnrLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: Colors.neutral.textMuted,
    letterSpacing: 1,
    fontFamily: fonts.bold,},
  pnrValue: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.neutral.textPrimary,
    letterSpacing: 3,
    marginTop: 2,
    fontFamily: fonts.extraBold,},
  copyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FAEEDA",
    alignItems: "center",
    justifyContent: "center",
  },
  grid: {
    gap: 12,
  },
  gridRow: {
    flexDirection: "row",
    gap: 12,
  },
  gridCell: {
    flex: 1,
    backgroundColor: Colors.neutral.pageBackground,
    padding: 10,
    borderRadius: 10,
  },
  cellLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: Colors.neutral.textMuted,
    fontFamily: fonts.bold,},
  cellValue: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.neutral.textPrimary,
    marginTop: 4,
    fontFamily: fonts.bold,},
});
