import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { Colors } from "../../theme/colors";
import { Spacing, Radius } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

type BadgeVariant =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "neutral"
  | "primary";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: "sm" | "md" | "lg";
  style?: ViewStyle;
  icon?: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
  success: { bg: Colors.badge.greenBg, text: Colors.badge.greenText },
  error: { bg: Colors.badge.redBg, text: Colors.badge.redText },
  warning: { bg: Colors.badge.yellowBg, text: Colors.badge.yellowText },
  info: { bg: Colors.badge.blueBg, text: Colors.badge.blueText },
  neutral: { bg: Colors.badge.grayBg, text: Colors.badge.grayText },
  primary: { bg: Colors.primaryLight, text: Colors.primary },
};

const sizeStyles: Record<
  string,
  { fontSize: number; paddingVertical: number; paddingHorizontal: number }
> = {
  sm: { fontSize: 10, paddingVertical: 2, paddingHorizontal: Spacing.sm },
  md: {
    fontSize: 12,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  lg: {
    fontSize: 14,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "neutral",
  size = "md",
  style,
  icon,
}) => {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: variantStyle.bg,
          paddingVertical: sizeStyle.paddingVertical,
          paddingHorizontal: sizeStyle.paddingHorizontal,
        },
        style,
      ]}
    >
      {icon && icon}
      <Text
        style={{
          fontSize: sizeStyle.fontSize,
          fontFamily: "PlusJakartaSans-SemiBold",
          color: variantStyle.text,
          marginLeft: icon ? Spacing.sm : 0,
        }}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: Radius.full,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
});
