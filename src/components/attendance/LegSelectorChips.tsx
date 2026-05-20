import React from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Colors, Typography, Spacing } from "../../constants/theme";
import { TransportLeg } from "../../hooks/useAttendance";

interface Props {
  legs: TransportLeg[];
  selectedLegId: string;
  onSelectLeg: (leg: TransportLeg) => void;
}

export function LegSelectorChips({ legs, selectedLegId, onSelectLeg }: Props) {
  // If the active day has only 1 leg or no legs, hide the chips row entirely
  if (legs.length <= 1) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case "flight":
        return "✈️";
      case "train":
        return "🚆";
      case "cab":
        return "🚖";
      case "bus":
      default:
        return "🚌";
    }
  };

  const getLabel = (type: string) => {
    switch (type) {
      case "flight":
        return "Flight";
      case "train":
        return "Train";
      case "cab":
        return "Cab";
      case "bus":
      default:
        return "Bus";
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {legs.map((leg) => {
          const isActive = selectedLegId === leg.id;
          return (
            <TouchableOpacity
              key={leg.id}
              onPress={() => onSelectLeg(leg)}
              activeOpacity={0.8}
              style={[
                styles.chip,
                isActive ? styles.chipActive : styles.chipInactive,
              ]}
            >
              <Text style={styles.icon}>{getIcon(leg.transport_type)}</Text>
              <Text
                style={[
                  styles.chipText,
                  isActive ? styles.chipTextActive : styles.chipTextInactive,
                ]}
              >
                Leg {leg.leg_order} · {getLabel(leg.transport_type)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screenPaddingH,
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    gap: 6,
  },
  chipActive: {
    backgroundColor: Colors.primary.main, // Royal blue theme color
  },
  chipInactive: {
    backgroundColor: "#F4F5F7",
  },
  icon: {
    fontSize: 14,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#FFFFFF",
    fontFamily: Typography.fontFamilies.semibold,
  },
  chipTextInactive: {
    color: Colors.neutral.textSecondary,
    fontFamily: Typography.fontFamilies.regular,
  },
});
