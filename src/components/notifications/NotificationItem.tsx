import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { format } from "date-fns";

export type NotifType =
  | "general"
  | "urgent"
  | "departure"
  | "delay"
  | "emergency";

interface Props {
  id: string;
  receiptId: string;
  type: NotifType;
  message: string;
  sentAt: string;
  isRead: boolean;
  onRead: () => void;
}

const TYPE_CONFIG: Record<
  NotifType,
  { borderColor: string; icon: string; emergency?: boolean }
> = {
  general: { borderColor: "#D1D5DB", icon: "📢" },
  urgent: { borderColor: "#FBBF24", icon: "⚠️" },
  departure: { borderColor: "#22C55E", icon: "🚌" },
  delay: { borderColor: "#EF4444", icon: "🕐" },
  emergency: { borderColor: "#DC2626", icon: "🚨", emergency: true },
};

export function NotificationItem({
  type,
  message,
  sentAt,
  isRead,
  onRead,
}: Props) {
  const cfg = TYPE_CONFIG[type];
  const timeLabel = format(new Date(sentAt), "d MMM · h:mm a");

  const handlePress = () => {
    if (!isRead) onRead();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={[
        styles.container,
        { borderLeftColor: cfg.borderColor },
        cfg.emergency ? styles.emergency : styles.normal,
      ]}
    >
      {!isRead && !cfg.emergency ? (
        <View style={styles.unreadDot} />
      ) : (
        <View style={styles.spacer} />
      )}
      <Text style={styles.icon}>{cfg.icon}</Text>
      <View style={styles.content}>
        <Text
          style={[styles.message, cfg.emergency && styles.emergencyMessage]}
        >
          {message}
        </Text>
        <Text style={[styles.time, cfg.emergency && styles.emergencyTime]}>
          {timeLabel}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    borderLeftWidth: 4,
    marginBottom: 12,
  },
  normal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emergency: {
    backgroundColor: "#DC2626",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#B91C1C",
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2B8CEE",
    marginTop: 6,
    marginRight: 12,
  },
  spacer: {
    width: 10,
    marginRight: 12,
  },
  icon: {
    fontSize: 18,
    marginRight: 12,
    marginTop: 1,
  },
  content: {
    flex: 1,
  },
  message: {
    color: "#1F2937",
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "PlusJakartaSans-Medium",
  },
  emergencyMessage: {
    color: "#FFFFFF",
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  time: {
    marginTop: 6,
    color: "#94A3B8",
    fontSize: 11,
    fontFamily: "PlusJakartaSans-Medium",
  },
  emergencyTime: {
    color: "#FECACA",
  },
});
