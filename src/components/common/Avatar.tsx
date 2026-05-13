import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { Colors } from "../../theme/colors";
import { Spacing, Radius } from "../../theme/spacing";
import { Typography } from "../../theme/typography";
import { getInitials } from "../../utils/formatters";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
  initialsOnly?: boolean;
}

const sizeMap = {
  sm: { size: 32, fontSize: 12 },
  md: { size: 40, fontSize: 14 },
  lg: { size: 56, fontSize: 18 },
  xl: { size: 72, fontSize: 24 },
};

// Generate deterministic color from string
const getColorFromName = (name: string): string => {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E2",
  ];
  const hash = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

export const Avatar: React.FC<AvatarProps> = ({
  name,
  size = "md",
  backgroundColor,
  textColor = Colors.white,
  style,
  initialsOnly = false,
}) => {
  const sizeStyle = sizeMap[size];
  const bg = backgroundColor || getColorFromName(name);
  const initials = getInitials(name);

  return (
    <View
      style={[
        styles.avatar,
        {
          width: sizeStyle.size,
          height: sizeStyle.size,
          borderRadius: sizeStyle.size / 2,
          backgroundColor: bg,
        },
        style,
      ]}
    >
      <Text
        style={{
          fontSize: sizeStyle.fontSize,
          fontFamily: "PlusJakartaSans-Bold",
          color: textColor,
        }}
      >
        {initials}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    justifyContent: "center",
    alignItems: "center",
  },
});
