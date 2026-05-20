import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { Colors, Typography } from "../../constants/theme";

interface Props {
  pnrNumber: string;
  transportType: "flight" | "train";
}

export function PNRQuickAction({ pnrNumber, transportType }: Props) {
  if (!pnrNumber) return null;

  const handleCopyPNR = async () => {
    await Clipboard.setStringAsync(pnrNumber);
    Alert.alert("PNR Copied!", "PNR copied to clipboard");
  };

  const handleCheckStatus = () => {
    if (transportType === "train") {
      Linking.openURL(`https://www.indianrail.gov.in/enquiry/PNR/${pnrNumber}`).catch(() =>
        Alert.alert("Error", "Could not open PNR tracking website.")
      );
    } else {
      Linking.openURL("https://www.makemytrip.com/flight-tracking/").catch(() =>
        Alert.alert("Error", "Could not open flight tracking website.")
      );
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.pnrSection}>
        <Text style={styles.label}>PNR NUMBER</Text>
        <Text style={styles.pnrText}>{pnrNumber}</Text>
      </View>
      <View style={styles.btnRow}>
        <TouchableOpacity
          onPress={handleCopyPNR}
          style={[styles.btn, styles.copyBtn]}
          activeOpacity={0.7}
        >
          <Ionicons name="copy-outline" size={16} color={Colors.primary.main} />
          <Text style={styles.copyText}>Copy PNR</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={handleCheckStatus}
          style={[styles.btn, styles.statusBtn]}
          activeOpacity={0.7}
        >
          <Ionicons name="search-outline" size={16} color="#FFFFFF" />
          <Text style={styles.statusText}>Check Status</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.primary.main,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    gap: 12,
  },
  pnrSection: {
    alignItems: "center",
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.neutral.textMuted,
    letterSpacing: 1,
  },
  pnrText: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.neutral.textPrimary,
    letterSpacing: 2,
    marginTop: 2,
  },
  btnRow: {
    flexDirection: "row",
    gap: 12,
  },
  btn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  copyBtn: {
    borderColor: Colors.primary.main,
    borderWidth: 1,
    backgroundColor: "#FFFFFF",
  },
  statusBtn: {
    backgroundColor: Colors.primary.main,
  },
  copyText: {
    color: Colors.primary.main,
    fontSize: 13,
    fontWeight: "700",
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});
