import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Typography } from "../../constants/theme";
import { TransportLeg } from "../../hooks/useAttendance";

interface Props {
  leg: TransportLeg;
  seatNumber: string;
}

export function BusCard({ leg, seatNumber }: Props) {
  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  return (
    <View style={styles.card}>
      {/* Header Row */}
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Ionicons name="bus" size={24} color="#0F6E56" />
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.label}>Bus</Text>
          <Text style={styles.vehicleName}>
            {leg.vehicle_number || "AC Mini Bus"}
          </Text>
        </View>
      </View>

      {/* Route Row */}
      <View style={styles.routeRow}>
        <Text style={styles.placeText}>{leg.departure_place}</Text>
        <Ionicons name="arrow-forward" size={16} color={Colors.neutral.textSecondary} />
        <Text style={styles.placeText}>{leg.arrival_place}</Text>
      </View>

      {/* Time Row */}
      <View style={styles.timeRow}>
        <Text style={styles.timeText}>{leg.departure_time}</Text>
        <Text style={styles.timeDivider}>to</Text>
        <Text style={styles.timeText}>{leg.arrival_time}</Text>
      </View>

      <View style={styles.divider} />

      {/* Seat Row */}
      {seatNumber ? (
        <View style={styles.seatRow}>
          <Ionicons name="person" size={18} color="#0F6E56" />
          <Text style={styles.seatText}>Seat {seatNumber}</Text>
        </View>
      ) : null}

      {/* Driver Row */}
      {leg.driver_name ? (
        <View style={styles.driverRow}>
          <View style={styles.driverInfo}>
            <Ionicons name="person-circle" size={24} color={Colors.neutral.textSecondary} />
            <Text style={styles.driverName}>{leg.driver_name}</Text>
          </View>
          {leg.driver_phone ? (
            <TouchableOpacity
              onPress={() => handleCall(leg.driver_phone!)}
              style={styles.callBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="call" size={16} color="#0F6E56" />
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}

      {/* Vehicle Number Bottom */}
      {leg.vehicle_number ? (
        <Text style={styles.vehicleNumberBottom}>
          Plate No: {leg.vehicle_number}
        </Text>
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
    backgroundColor: "#E1F5EE",
    alignItems: "center",
    justifyContent: "center",
  },
  headerRight: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: Colors.neutral.textMuted,
    fontFamily: Typography.fontFamilies.regular,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.neutral.textPrimary,
    fontFamily: Typography.fontFamilies.bold,
  },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  placeText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.neutral.textPrimary,
    fontFamily: Typography.fontFamilies.semibold,
    flex: 1,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  timeText: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.neutral.textPrimary,
    fontFamily: Typography.fontFamilies.bold,
  },
  timeDivider: {
    fontSize: 14,
    color: Colors.neutral.textSecondary,
  },
  divider: {
    height: 0.5,
    backgroundColor: Colors.neutral.border,
    marginBottom: 14,
  },
  seatRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  seatText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F6E56",
    fontFamily: Typography.fontFamilies.bold,
  },
  driverRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  driverInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  driverName: {
    fontSize: 14,
    color: Colors.neutral.textSecondary,
    fontFamily: Typography.fontFamilies.regular,
  },
  callBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E1F5EE",
    alignItems: "center",
    justifyContent: "center",
  },
  vehicleNumberBottom: {
    fontSize: 11,
    color: Colors.neutral.textMuted,
    fontFamily: Typography.fontFamilies.regular,
    marginTop: 6,
    textAlign: "right",
  },
});
