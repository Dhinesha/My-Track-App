import { useState, useEffect } from "react";
import { fonts, textStyles } from '../../constants/theme';
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSyncStore } from "../../store/syncStore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from "date-fns";

type CheckInState =
  | "LOADING"
  | "NOT_ASSIGNED"
  | "READY"
  | "CHECKING_IN"
  | "CONFIRMED_ONLINE"
  | "CONFIRMED_OFFLINE"
  | "ALREADY_CHECKED";

interface Props {
  paxId: string;
  vehicleId: string;
  tripId: string;
  initialState?: CheckInState;
  checkedInAt?: string;
  onCheckInSuccess?: () => void;
  transportType?: "bus" | "flight" | "train" | "cab";
}

export function SelfCheckInSection({
  paxId,
  vehicleId,
  tripId,
  initialState = "READY",
  checkedInAt,
  onCheckInSuccess,
  transportType = "bus",
}: Props) {
  const [state, setState] = useState<CheckInState>(initialState);
  const [timestamp, setTimestamp] = useState<string>(checkedInAt ?? "");
  const { isOnline } = useSyncStore();

  useEffect(() => {
    checkExistingCheckIn();
  }, [tripId]);

  const checkExistingCheckIn = async () => {
    try {
      const savedCheckIn = await AsyncStorage.getItem(`checkin_${tripId}`);
      if (savedCheckIn) {
        const data = JSON.parse(savedCheckIn);
        setTimestamp(format(new Date(data.time), "h:mm a"));
        setState("ALREADY_CHECKED");
      }
    } catch (error) {
      console.error('Error checking existing check-in:', error);
    }
  };

  const handleCheckIn = async () => {
    setState("CHECKING_IN");
    try {
      const now = new Date().toISOString();
      const checkInData = {
        tripId,
        paxId,
        vehicleId,
        time: now,
      };

      await AsyncStorage.setItem(`checkin_${tripId}`, JSON.stringify(checkInData));
      
      setTimestamp(format(new Date(now), "h:mm a"));
      setState(isOnline ? "CONFIRMED_ONLINE" : "CONFIRMED_OFFLINE");
      if (onCheckInSuccess) onCheckInSuccess();
    } catch (error) {
      console.error('Check-in failed:', error);
      setState("READY");
    }
  };

  if (state === "LOADING")
    return (
      <ActivityIndicator style={{ paddingVertical: 24 }} color="#2B8CEE" />
    );

  if (state === "NOT_ASSIGNED") {
    return (
      <View
        style={{
          backgroundColor: "#FFFBEB",
          borderRadius: 12,
          padding: 12,
          borderWidth: 1,
          borderColor: "#FDE68A",
        }}
      >
        <Text style={{ color: "#92400E", fontSize: 13, textAlign: "center" }}>
          Vehicle not assigned yet. Please contact your tour organiser.
        </Text>
      </View>
    );
  }

  if (
    state === "CONFIRMED_ONLINE" ||
    state === "CONFIRMED_OFFLINE" ||
    state === "ALREADY_CHECKED"
  ) {
    const successTitle = transportType === "cab" ? "Pickup Confirmed!" : "Boarding Confirmed!";
    const checkinTimeLabel = transportType === "cab" ? `Picked up at ${timestamp}` : `Boarded at ${timestamp}`;

    return (
      <View
        style={{
          backgroundColor: "#ECFDF5",
          borderRadius: 12,
          padding: 16,
          alignItems: "center",
          gap: 8,
        }}
      >
        <MaterialCommunityIcons name="check-circle" size={64} color="#059669" />
        <Text style={{ color: "#065F46", fontWeight: "600", fontSize: 16 }}>
          {successTitle}
        </Text>
        <Text style={{ color: "#0F766E", fontSize: 13 }}>{checkinTimeLabel}</Text>
        {state === "CONFIRMED_OFFLINE" && (
          <Text style={{ color: "#9CA3AF", fontSize: 12 }}>(syncing...)</Text>
        )}
      </View>
    );
  }

  const getButtonText = () => {
    switch (transportType) {
      case "flight":
        return "Confirm Boarding — Flight";
      case "train":
        return "Confirm Boarding — Train";
      case "cab":
        return "Confirm Pickup — Cab";
      case "bus":
      default:
        return "Confirm Boarding — Bus";
    }
  };

  return (
    <TouchableOpacity
      onPress={handleCheckIn}
      disabled={state === "CHECKING_IN"}
      style={{
        backgroundColor: "#2B8CEE",
        borderRadius: 12,
        height: 56,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 12,
      }}
    >
      {state === "CHECKING_IN" ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
          {getButtonText()}
        </Text>
      )}
    </TouchableOpacity>
  );
}
