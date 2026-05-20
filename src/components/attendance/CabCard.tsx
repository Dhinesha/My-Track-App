import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Typography } from "../../constants/theme";
import { TransportLeg } from "../../hooks/useAttendance";

interface Props {
  leg: TransportLeg;
  isSharing: boolean;
  sharingCount: number;
}

export function CabCard({ leg, isSharing, sharingCount }: Props) {
  const handleCall = () => {
    const phone = leg.cab_driver_phone || leg.driver_phone;
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "D";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const driverName = leg.cab_driver_name || leg.driver_name || "Cab Driver";
  const driverPhone = leg.cab_driver_phone || leg.driver_phone || "";

  return (
    <View style={styles.card}>
      {/* Header Row */}
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Ionicons name="car" size={24} color="#D97706" />
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.companyText}>
            {leg.cab_company || "Uber Outstation"}
          </Text>
          <Text style={styles.cabType}>
            {leg.cab_type || "Sedan"}
          </Text>
        </View>
      </View>

      {/* Route Row */}
      <View style={styles.routeRow}>
        <View style={styles.routePoint}>
          <Text style={styles.placeLabel}>PICKUP</Text>
          <Text style={styles.placeText}>{leg.departure_place}</Text>
        </View>
        <Ionicons name="arrow-forward" size={16} color={Colors.neutral.textSecondary} />
        <View style={[styles.routePoint, { alignItems: "flex-end" }]}>
          <Text style={[styles.placeLabel, { textAlign: "right" }]}>DROP</Text>
          <Text style={[styles.placeText, { textAlign: "right" }]}>{leg.arrival_place}</Text>
        </View>
      </View>

      {/* Time details */}
      <View style={styles.timeSection}>
        <Ionicons name="time-outline" size={16} color={Colors.neutral.textSecondary} />
        <Text style={styles.timeText}>
          Pickup scheduled at <Text style={styles.boldText}>{leg.departure_time}</Text>
        </Text>
      </View>

      <View style={styles.divider} />

      {/* Driver Details Row */}
      <View style={styles.driverRow}>
        <View style={styles.driverProfile}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{getInitials(driverName)}</Text>
          </View>
          <View>
            <Text style={styles.driverLabel}>DRIVER</Text>
            <Text style={styles.driverName}>{driverName}</Text>
          </View>
        </View>

        {driverPhone ? (
          <TouchableOpacity
            onPress={handleCall}
            style={styles.callButton}
            activeOpacity={0.8}
          >
            <Ionicons name="call" size={16} color="#FFFFFF" />
            <Text style={styles.callButtonText}>Call Driver</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Cab Registration Number */}
      {leg.cab_number || leg.vehicle_number ? (
        <View style={styles.registrationRow}>
          <Ionicons name="car-outline" size={18} color={Colors.neutral.textSecondary} />
          <Text style={styles.registrationText}>
            Plate No: <Text style={styles.boldReg}>{leg.cab_number || leg.vehicle_number}</Text>
          </Text>
        </View>
      ) : null}

      {/* Sharing Pill */}
      {isSharing ? (
        <View style={styles.sharingBanner}>
          <Ionicons name="people-outline" size={14} color="#B45309" />
          <Text style={styles.sharingText}>
            Shared cab — {sharingCount} travellers in this cab
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
    backgroundColor: "#FEF3E2",
    alignItems: "center",
    justifyContent: "center",
  },
  headerRight: {
    flex: 1,
  },
  companyText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.neutral.textPrimary,
    fontFamily: Typography.fontFamilies.bold,
  },
  cabType: {
    fontSize: 12,
    color: Colors.neutral.textMuted,
    fontFamily: Typography.fontFamilies.regular,
  },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  routePoint: {
    flex: 1,
  },
  placeLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: Colors.neutral.textMuted,
    marginBottom: 4,
  },
  placeText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.neutral.textPrimary,
    fontFamily: Typography.fontFamilies.semibold,
  },
  timeSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  timeText: {
    fontSize: 13,
    color: Colors.neutral.textSecondary,
  },
  boldText: {
    fontWeight: "700",
    color: Colors.neutral.textPrimary,
  },
  divider: {
    height: 0.5,
    backgroundColor: Colors.neutral.border,
    marginBottom: 14,
  },
  driverRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  driverProfile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FEF3E2",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#D97706",
    fontSize: 12,
    fontWeight: "bold",
  },
  driverLabel: {
    fontSize: 8,
    fontWeight: "700",
    color: Colors.neutral.textMuted,
  },
  driverName: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.neutral.textPrimary,
  },
  callButton: {
    backgroundColor: "#1D9E75", // Green call driver button
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  callButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  registrationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  registrationText: {
    fontSize: 13,
    color: Colors.neutral.textSecondary,
  },
  boldReg: {
    fontWeight: "700",
    color: Colors.neutral.textPrimary,
  },
  sharingBanner: {
    backgroundColor: "#FFFBEB",
    borderColor: "#FDE68A",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sharingText: {
    fontSize: 12,
    color: "#B45309",
    fontWeight: "600",
  },
});
