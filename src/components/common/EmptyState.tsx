import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { fonts, textStyles } from '../../constants/theme';
import { Colors } from "../../theme/colors";
import { Spacing, Radius } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {icon && (
        <MaterialCommunityIcons
          name={icon as any}
          size={48}
          color={Colors.text.muted}
          style={styles.icon}
        />
      )}

      <Text style={[Typography.screenTitle, styles.title]}>{title}</Text>

      {description && (
        <Text style={[Typography.body, styles.description]}>{description}</Text>
      )}

      {actionLabel && onAction && (
        <TouchableOpacity style={styles.button} onPress={onAction}>
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  icon: {
    marginBottom: Spacing.xl,
  },
  title: {
    marginBottom: Spacing.md,
    textAlign: "center",
    fontFamily: fonts.regular,},
  description: {
    marginBottom: Spacing.xl,
    textAlign: "center",
    color: Colors.text.secondary,
    fontFamily: fonts.regular,},
  button: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.md,
  },
  buttonText: {
    color: Colors.white,
    fontFamily: fonts.semiBold,
    fontSize: 14,
  },
});
