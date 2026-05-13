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
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

interface SyncIndicatorProps {
  syncing: boolean;
  pendingCount?: number;
  style?: ViewStyle;
}

export const SyncIndicator: React.FC<SyncIndicatorProps> = ({
  syncing,
  pendingCount,
  style,
}) => {
  if (!syncing && !pendingCount) return null;

  return (
    <View style={[styles.container, style]}>
      {syncing ? (
        <>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.text}>
            {pendingCount ? `Syncing ${pendingCount} items...` : "Syncing..."}
          </Text>
        </>
      ) : (
        <>
          <MaterialCommunityIcons
            name="alert-circle"
            size={16}
            color={Colors.status.warning}
          />
          <Text style={styles.text}>{pendingCount} actions pending sync</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background.card,
    borderRadius: 4,
  },
  text: {
    marginLeft: Spacing.md,
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Medium",
    color: Colors.text.secondary,
  },
});
