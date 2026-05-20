import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { Colors, Typography, Spacing } from "../../constants/theme";
import { TransportLeg } from "../../hooks/useAttendance";

interface Props {
  leg: TransportLeg;
  seatNumber: string;
  pnrNumber: string;
  mealPreference?: string;
}

export function FlightCard({ leg, seatNumber, pnrNumber, mealPreference }: Props) {
  const handleCopyPNR = async () => {
    if (!pnrNumber) return;
    await Clipboard.setStringAsync(pnrNumber);
    Alert.alert("PNR Copied!", "Flight PNR has been copied to your clipboard.");
  };

  const calculateDuration = (dep: string, arr: string) => {
    try {
      const [depH, depM] = dep.split(":").map(Number);
      const [arrH, arrM] = arr.split(":").map(Number);
      let diffMins = (arrH * 60 + arrM) - (depH * 60 + depM);
      if (diffMins < 0) diffMins += 24 * 60; // handle overnight flights
      const hrs = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hrs}h ${mins}m`;
    } catch {
      return "2h 15m";
    }
  };

  const duration = calculateDuration(leg.departure_time, leg.arrival_time);

  return (
    <View style={styles.card}>
      {/* Header Row */}
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Ionicons name="airplane" size={24} color="#2A7FD4" />
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.airlineText}>
            {leg.airline_name || "Indigo Airlines"}
          </Text>
          <Text style={styles.flightNo}>
            {leg.flight_number || "6E-204"}
          </Text>
        </View>
      </View>

      {/* Route Row (Airport Style) */}
      <View style={styles.routeRow}>
        <View style={styles.cityCol}>
          <Text style={styles.cityText}>
            {leg.departure_place.substring(0, 3).toUpperCase()}
          </Text>
          <Text style={styles.placeSub}>{leg.departure_place}</Text>
        </View>

        <View style={styles.planeIconContainer}>
          <View style={styles.planeLine} />
          <Ionicons name="airplane" size={16} color={Colors.neutral.textSecondary} />
          <View style={styles.planeLine} />
        </View>

        <View style={[styles.cityCol, { alignItems: "flex-end" }]}>
          <Text style={styles.cityText}>
            {leg.arrival_place.substring(0, 3).toUpperCase()}
          </Text>
          <Text style={[styles.placeSub, { textAlign: "right" }]}>{leg.arrival_place}</Text>
        </View>
      </View>

      {/* Time & Duration Row */}
      <View style={styles.timeRow}>
        <View style={styles.timeCol}>
          <Text style={styles.timeVal}>{leg.departure_time}</Text>
        </View>
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{duration}</Text>
        </View>
        <View style={[styles.timeCol, { alignItems: "flex-end" }]}>
          <Text style={styles.timeVal}>{leg.arrival_time}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Prominent PNR Box */}
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
            <Ionicons name="copy-outline" size={18} color="#2A7FD4" />
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Details Row: Terminal, Gate, Seat */}
      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>TERMINAL</Text>
          <Text style={styles.detailVal}>{leg.terminal || "T2"}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>GATE</Text>
          <Text style={styles.detailVal}>{leg.gate || "14B"}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>SEAT</Text>
          <Text style={styles.detailVal}>{seatNumber || "12A"}</Text>
        </View>
      </View>

      {/* Meal Preference Pill */}
      {mealPreference ? (
        <View style={styles.mealBadge}>
          <Text style={styles.mealText}>
            {mealPreference.toLowerCase().includes("veg") ? "🥗 Veg" : "🍗 Non-veg"}
          </Text>
        </View>
      ) : null}
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
    backgroundColor: "#EBF3FC",
    alignItems: "center",
    justifyContent: "center",
  },
  headerRight: {
    flex: 1,
  },
  airlineText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.neutral.textPrimary,
    fontFamily: Typography.fontFamilies.bold,
  },
  flightNo: {
    fontSize: 12,
    color: Colors.neutral.textMuted,
    fontFamily: Typography.fontFamilies.regular,
  },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cityCol: {
    flex: 1,
  },
  cityText: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.neutral.textPrimary,
    fontFamily: Typography.fontFamilies.bold,
  },
  placeSub: {
    fontSize: 11,
    color: Colors.neutral.textSecondary,
    marginTop: 2,
  },
  planeIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    gap: 4,
  },
  planeLine: {
    flex: 1,
    height: 1,
    borderStyle: "dashed",
    borderWidth: 0.5,
    borderColor: Colors.neutral.border,
    borderRadius: 1,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  timeCol: {
    flex: 1,
  },
  timeVal: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.neutral.textSecondary,
  },
  durationBadge: {
    backgroundColor: Colors.neutral.pageBackground,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  durationText: {
    fontSize: 11,
    color: Colors.neutral.textSecondary,
    fontWeight: "500",
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
  },
  pnrLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: Colors.neutral.textMuted,
    letterSpacing: 1,
  },
  pnrValue: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.neutral.textPrimary,
    letterSpacing: 3,
    marginTop: 2,
  },
  copyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EBF3FC",
    alignItems: "center",
    justifyContent: "center",
  },
  detailsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: Colors.neutral.textMuted,
  },
  detailVal: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.neutral.textPrimary,
    marginTop: 4,
  },
  mealBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  mealText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.neutral.textSecondary,
  },
});
