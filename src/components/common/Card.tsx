import React from "react";
import { View, StyleSheet, ViewStyle, TouchableOpacity } from "react-native";
import { Colors } from "../../theme/colors";
import { Spacing, Radius, Shadows } from "../../theme/spacing";

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  elevation?: "sm" | "md" | "lg" | "xl";
  padding?: number | "none" | "sm" | "md" | "lg";
  borderRadius?: number;
  backgroundColor?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  style,
  elevation = "md",
  padding = "md",
  borderRadius = Radius.lg,
  backgroundColor = Colors.background.card,
}) => {
  const paddingMap = {
    none: 0,
    sm: Spacing.sm,
    md: Spacing.md,
    lg: Spacing.lg,
  };

  const shadowMap = {
    sm: Shadows.sm,
    md: Shadows.md,
    lg: Shadows.lg,
    xl: Shadows.xl,
  };

  const containerStyle: ViewStyle = {
    backgroundColor,
    borderRadius,
    padding: typeof padding === "number" ? padding : paddingMap[padding],
    overflow: "hidden",
    ...shadowMap[elevation],
    ...style,
  };

  const content = <View style={containerStyle}>{children}</View>;

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.card,
    borderRadius: Radius.lg,
    overflow: "hidden",
  },
});
