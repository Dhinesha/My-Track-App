import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAuthStore } from "../../store/authStore";
import { useSyncStore } from "../../store/syncStore";
import { useTripStore } from "../../store/tripStore";

export function StoreTestPanel() {
  const { user, setUser, clearAuth } = useAuthStore();
  const {
    isOnline,
    setOnline,
    pendingCount,
    setPendingCount,
    setLastSynced,
    lastSyncedAt,
  } = useSyncStore();
  const { activeTripId, activeTripName, setActiveTrip, clearActiveTrip } =
    useTripStore();

  const formatTime = (date: Date | null) => {
    if (!date) return "Never";
    return date.toLocaleTimeString();
  };

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>Store Test Panel</Text>
      <Text style={styles.line}>
        Auth: {user ? `${user.name} (${user.role})` : "No user"}
      </Text>
      <Text style={styles.line}>
        Sync: {isOnline ? "Online" : "Offline"} | Pending: {pendingCount}
      </Text>
      <Text style={styles.line}>
        Trip: {activeTripName || "No active trip"}
        {activeTripId ? ` (${activeTripId})` : ""}
      </Text>
      <Text style={styles.line}>Last sync: {formatTime(lastSyncedAt)}</Text>

      <View style={styles.row}>
        <ActionButton
          label="Set User"
          onPress={() =>
            setUser({
              id: "u-101",
              name: "Demo Traveler",
              mobile: "9999999999",
              role: "traveler",
            })
          }
        />
        <ActionButton label="Clear Auth" onPress={clearAuth} />
      </View>

      <View style={styles.row}>
        <ActionButton
          label="Toggle Online"
          onPress={() => setOnline(!isOnline)}
        />
        <ActionButton
          label="+ Pending"
          onPress={() => setPendingCount(pendingCount + 1)}
        />
        <ActionButton label="Sync Now" onPress={setLastSynced} />
      </View>

      <View style={styles.row}>
        <ActionButton
          label="Set Trip"
          onPress={() => setActiveTrip("trip-42", "Demo Trip to Goa")}
        />
        <ActionButton label="Clear Trip" onPress={clearActiveTrip} />
      </View>
    </View>
  );
}

function ActionButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: "absolute",
    left: 24,
    bottom: 24,
    width: 360,
    maxWidth: "42vw" as any,
    padding: 16,
    borderRadius: 18,
    backgroundColor: "rgba(7, 14, 26, 0.88)",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.18)",
  },
  title: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  line: {
    color: "#cbd5e1",
    fontSize: 13,
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#1f6feb",
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
