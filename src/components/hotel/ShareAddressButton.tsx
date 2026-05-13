import React from "react";
import { TouchableOpacity, Text, Share, StyleSheet } from "react-native";

interface Props {
  hotelName: string;
  address: string;
  roomNumber: string;
}

export function ShareAddressButton({ hotelName, address, roomNumber }: Props) {
  const handleShare = async () => {
    await Share.share({
      message: `Hotel: ${hotelName}\nAddress: ${address}\nMy Room: ${roomNumber}`,
    });
  };

  return (
    <TouchableOpacity
      onPress={handleShare}
      activeOpacity={0.85}
      style={styles.button}
    >
      <Text style={styles.text}>Share Hotel Address</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: "#0F766E",
    borderRadius: 16,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  text: {
    color: "#0F766E",
    fontSize: 14,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
});
