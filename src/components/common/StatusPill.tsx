import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../../theme/colors";
import { Spacing, Radius } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

type StatusPillStatus =
  | "checked-in"
  | "pending"
  | "confirmed"
  | "completed"
  | "delayed"
  | "cancelled";

interface StatusPillProps {
  status: StatusPillStatus;
  label?: string;
  size?: "sm" | "md" | "lg";
  style?: ViewStyle;
  animated?: boolean;
}

const statusConfig: Record<
  StatusPillStatus,
  { icon: string; color: string; bg: string; label: string }
> = {
  "checked-in": {
    icon: "check-circle",
    color: Colors.status.success,
    bg: "#E8F5E9",
    label: "Checked In",
  },
  pending: {
    icon: "clock-outline",
    color: Colors.status.warning,
    bg: "#FFF3E0",
    label: "Pending",
  },
  confirmed: {
    icon: "check",
    color: Colors.status.success,
    bg: "#E8F5E9",
    label: "Confirmed",
  },
  completed: {
    icon: "check-all",
    color: Colors.status.success,
    bg: "#E8F5E9",
    label: "Completed",
  },
  delayed: {
    icon: "alert-circle",
    color: Colors.status.error,
    bg: "#FFEBEE",
    label: "Delayed",
  },
  cancelled: {
    icon: "close-circle",
    color: Colors.text.muted,
    bg: "#F5F5F5",
    label: "Cancelled",
  },
};

const sizeMap = {
  sm: {
    fontSize: 10,
    iconSize: 12,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  md: {
    fontSize: 12,
    iconSize: 14,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  lg: {
    fontSize: 14,
    iconSize: 16,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
};

export const StatusPill: React.FC<StatusPillProps> = ({
  status,
  label,
  size = "md",
  style,
  animated = false,
}) => {
  const config = statusConfig[status];
  const sizeStyle = sizeMap[size];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: config.bg,
          paddingHorizontal: sizeStyle.paddingHorizontal,
          paddingVertical: sizeStyle.paddingVertical,
        },
        style,
      ]}
    >
      <MaterialCommunityIcons
        name={config.icon as any}
        size={sizeStyle.iconSize}
        color={config.color}
        style={animated && status === "checked-in" ? styles.pulse : undefined}
      />
      <Text
        style={{
          fontSize: sizeStyle.fontSize,
          fontFamily: "PlusJakartaSans-SemiBold",
          color: config.color,
          marginLeft: Spacing.sm,
        }}
      >
        {label || config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Radius.full,
    alignSelf: "flex-start",
  },
  pulse: {
    // Animation would be added here using react-native-reanimated
  },
});
