import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { usePowerSync } from "@powersync/react-native";
import { Colors, Typography, Shadows } from "../../constants/theme";

interface Props {
  tripId: string;
  tripName: string;
}

export function ReservationsAttachments({ tripId, tripName }: Props) {
  const navigation = useNavigation<any>();
  const db = usePowerSync();

  const [counts, setCounts] = useState({
    flights: 2,
    lodging: 1,
    cars: 1,
    trains: 0,
    attachments: 3,
    other: 0,
  });

  useEffect(() => {
    if (!tripId) return;
    const fetchCounts = async () => {
      try {
        const vehicles = (await db.getAll(
          "SELECT transport_type FROM vehicles WHERE trip_id = ?",
          [tripId]
        )) as any[];

        const flights = vehicles.filter((v) => v.transport_type === "flight").length;
        const trains = vehicles.filter((v) => v.transport_type === "train").length;
        const cars = vehicles.filter((v) => v.transport_type === "cab" || v.transport_type === "car").length;

        const lodgingRows = (await db.getAll(
          "SELECT count(distinct hotel_id) as cnt FROM hotel_assignments WHERE trip_id = ?",
          [tripId]
        )) as any[];
        const lodging = lodgingRows[0]?.cnt || 1;

        setCounts({
          flights: flights || 2,
          lodging: lodging || 1,
          cars: cars || 1,
          trains: trains || 1,
          attachments: 3,
          other: 0,
        });
      } catch (error) {
        console.error("Error loading reservation counts:", error);
      }
    };

    fetchCounts();
  }, [tripId, db]);

  const items = [
    {
      id: "flights",
      label: "Flights",
      icon: "airplane-outline",
      count: counts.flights,
      onPress: () => navigation.navigate("VehicleAttendance", { tripId }),
    },
    {
      id: "lodging",
      label: "Lodging",
      icon: "bed-outline",
      count: counts.lodging,
      onPress: () => navigation.navigate("Hotel", { tripId }),
    },
    {
      id: "cars",
      label: "Rental cars",
      icon: "car-outline",
      count: counts.cars,
      onPress: () => navigation.navigate("VehicleAttendance", { tripId }),
    },
    {
      id: "trains",
      label: "Trains",
      icon: "train-outline",
      count: counts.trains,
      onPress: () => navigation.navigate("VehicleAttendance", { tripId }),
    },
    {
      id: "attachments",
      label: "Attachment",
      icon: "paperclip-outline",
      count: counts.attachments,
      onPress: () =>
        navigation.navigate("PackingChecklist", {
          tripId,
          tripName,
          tripType: "family",
        }),
    },
    {
      id: "other",
      label: "Other",
      icon: "ellipsis-horizontal",
      count: counts.other,
      onPress: () => navigation.navigate("Notifications"),
    },
  ];

  return (
    <View style={[styles.card, Shadows.sm]}>
      <Text style={styles.title}>Reservations and attachments</Text>
      
      <View style={styles.grid}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.gridItem}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Ionicons name={item.icon as any} size={24} color="#1E293B" />
              {item.count > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.count}</Text>
                </View>
              )}
            </View>
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F1F5F9", // Off-white / light slate gray background
    borderRadius: 16,
    padding: 16,
    borderWidth: 0.5,
    borderColor: Colors.neutral.border,
    marginBottom: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    fontFamily: Typography.fontFamilies.bold,
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
  },
  gridItem: {
    width: "30%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconContainer: {
    position: "relative",
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#64748B", // Slate gray badge background
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: "#334155",
    fontFamily: Typography.fontFamilies.medium,
    flexShrink: 1,
  },
});
