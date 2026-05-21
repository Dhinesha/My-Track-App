import React from "react";
import { fonts, textStyles } from '../../constants/theme';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from "react-native";

interface Props {
  vehicleName: string;
  seatNumber?: string;
  driverName?: string;
  driverPhone?: string;
  departureTime?: string;
}

export function VehicleInfoCard({
  vehicleName,
  seatNumber,
  driverName,
  driverPhone,
  departureTime,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.vehicleName}>{vehicleName}</Text>

      {seatNumber && (
        <View style={styles.row}>
          <Text style={styles.label}>Your seat</Text>
          <Text style={styles.value}>{seatNumber}</Text>
        </View>
      )}

      {departureTime && (
        <View style={styles.row}>
          <Text style={styles.label}>Departure</Text>
          <Text style={styles.value}>{departureTime}</Text>
        </View>
      )}

      {driverName && (
        <View style={styles.row}>
          <Text style={styles.label}>Driver</Text>
          {driverPhone ? (
            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${driverPhone}`)}
              activeOpacity={0.75}
            >
              <Text style={styles.driverLink}>
                {driverName} · {driverPhone}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.value}>{driverName}</Text>
          )}
        </View>
      )}
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
    // Use vertical spacing via row marginTop instead of CSS gap
  },
  vehicleName: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: "#111827",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  label: {
    width: 80,
    fontSize: 14,
    color: "#9CA3AF",
    fontFamily: fonts.medium,
    marginRight: 8,
  },
  value: {
    fontSize: 14,
    color: "#1F2937",
    fontFamily: fonts.semiBold,
  },
  driverLink: {
    fontSize: 14,
    color: "#0F766E",
    fontFamily: fonts.medium,
    textDecorationLine: "underline",
  },
});
