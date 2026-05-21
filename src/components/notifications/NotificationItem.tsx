import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Typography, Spacing, Shadows, fonts, textStyles } from '../../constants/theme';

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
  { bg: string; icon: keyof typeof Ionicons.glyphMap; iconColor: string; labelColor: string }
> = {
  general: { 
    bg: Colors.info.lightBg, 
    icon: "notifications-outline", 
    iconColor: Colors.info.main, 
    labelColor: Colors.info.text 
  },
  urgent: { 
    bg: Colors.warning.lightBg, 
    icon: "alert-circle-outline", 
    iconColor: Colors.warning.main, 
    labelColor: Colors.warning.textOnAmber 
  },
  departure: { 
    bg: Colors.primary.lightBg, 
    icon: "bus-outline", 
    iconColor: Colors.primary.main, 
    labelColor: Colors.primary.dark 
  },
  delay: { 
    bg: Colors.urgent.lightBg, 
    icon: "time-outline", 
    iconColor: Colors.urgent.main, 
    labelColor: Colors.urgent.main 
  },
  emergency: { 
    bg: Colors.info.lightBg, // Emergency icon is blue per user request!
    icon: "warning-outline", 
    iconColor: Colors.info.main, 
    labelColor: Colors.info.text 
  },
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
        { borderLeftColor: cfg.iconColor },
        Shadows.sm
      ]}
    >
      <View style={styles.headerRow}>
        <View style={[styles.iconCircle, { backgroundColor: cfg.bg }]}>
          <Ionicons name={cfg.icon} size={20} color={cfg.iconColor} />
        </View>
        <View style={styles.content}>
          <Text style={[styles.message, !isRead && styles.unreadMessage]}>
            {message}
          </Text>
          <View style={styles.footerRow}>
            <Text style={styles.time}>{timeLabel}</Text>
            {!isRead && <View style={styles.unreadDot} />}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: Spacing.cardRadius,
    padding: 16,
    borderWidth: 0.5,
    borderColor: Colors.neutral.border,
    borderLeftWidth: 4,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    color: Colors.neutral.textSecondary,
    fontFamily: fonts.regular,
    lineHeight: 20,
  },
  unreadMessage: {
    fontFamily: fonts.bold,
    color: Colors.neutral.textPrimary,
    fontWeight: "700",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  time: {
    fontSize: 11,
    color: Colors.neutral.textMuted,
    fontFamily: fonts.regular,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary.main,
  },
});
