import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Typography, Spacing, Shadows } from "../../constants/theme";
import { TransportLeg } from "../../hooks/useAttendance";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Props {
  legs: TransportLeg[];
  currentLegId: string | null;
  currentDay: number;
}

export function TransportTimeline({ legs, currentLegId, currentDay }: Props) {
  const [expanded, setExpanded] = useState<boolean>(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const getEmoji = (type: string) => {
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

  const getLegDescription = (leg: TransportLeg) => {
    const typeLabel = leg.transport_type.charAt(0).toUpperCase() + leg.transport_type.slice(1);
    switch (leg.transport_type) {
      case "flight":
        return `${typeLabel} ${leg.flight_number || ""}: ${leg.departure_place.substring(0, 3).toUpperCase()} → ${leg.arrival_place.substring(0, 3).toUpperCase()}`;
      case "train":
        return `${leg.train_name || "Express"}: ${leg.departure_place} → ${leg.arrival_place}`;
      default:
        return `${typeLabel}: ${leg.departure_place} → ${leg.arrival_place}`;
    }
  };

  return (
    <View style={[styles.card, Shadows.sm]}>
      <TouchableOpacity
        onPress={toggleExpand}
        activeOpacity={0.7}
        style={styles.header}
      >
        <View style={styles.headerLeft}>
          <Ionicons name="git-commit-outline" size={20} color={Colors.primary.main} />
          <Text style={styles.headerTitle}>Full Trip Transport Timeline</Text>
        </View>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={Colors.neutral.textSecondary}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.timelineContainer}>
          {legs.map((leg, index) => {
            const isCurrent = currentLegId === leg.id;
            const isPast = leg.trip_day < currentDay || (leg.trip_day === currentDay && currentLegId !== leg.id && index < legs.findIndex(l => l.id === currentLegId));
            const isFuture = leg.trip_day > currentDay || (leg.trip_day === currentDay && currentLegId !== leg.id && index > legs.findIndex(l => l.id === currentLegId));

            let blockStyle: any = styles.legBlock;
            if (isCurrent) {
              blockStyle = [styles.legBlock, styles.currentBlock];
            } else if (isPast) {
              blockStyle = [styles.legBlock, styles.pastBlock];
            }

            const isLast = index === legs.length - 1;

            return (
              <View key={leg.id} style={styles.timelineRow}>
                {/* Left graphics */}
                <View style={styles.graphicsColumn}>
                  <View style={styles.dayBadge}>
                    <Text style={styles.dayBadgeText}>D{leg.trip_day}</Text>
                  </View>
                  {!isLast && (
                    <View
                      style={[
                        styles.connectorLine,
                        isPast ? styles.pastConnector : styles.activeConnector,
                      ]}
                    />
                  )}
                </View>

                {/* Right details */}
                <View style={[blockStyle, { flex: 1, marginBottom: isLast ? 0 : 16 }]}>
                  <View style={styles.legDetailsRow}>
                    <Text style={styles.emojiText}>{getEmoji(leg.transport_type)}</Text>
                    <View style={styles.descriptionCol}>
                      <Text style={styles.legDesc}>{getLegDescription(leg)}</Text>
                      <Text style={styles.legTime}>Departure: {leg.departure_time}</Text>
                    </View>
                  </View>

                  {isCurrent && (
                    <View style={styles.currentIndicator}>
                      <Text style={styles.currentIndicatorText}>CURRENT LEG</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
    borderWidth: 0.5,
    borderColor: Colors.neutral.border,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.neutral.textPrimary,
    fontFamily: Typography.fontFamilies.bold,
  },
  timelineContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  timelineRow: {
    flexDirection: "row",
    position: "relative",
  },
  graphicsColumn: {
    alignItems: "center",
    width: 44,
  },
  dayBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary.lightBg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: Colors.primary.main,
    zIndex: 10,
  },
  dayBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: Colors.primary.main,
    fontFamily: Typography.fontFamilies.bold,
  },
  connectorLine: {
    width: 2,
    position: "absolute",
    top: 32,
    bottom: -16,
    zIndex: 1,
  },
  activeConnector: {
    backgroundColor: Colors.primary.main,
  },
  pastConnector: {
    backgroundColor: Colors.neutral.border,
  },
  legBlock: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.neutral.border,
  },
  currentBlock: {
    backgroundColor: Colors.primary.lightBg,
    borderColor: Colors.primary.main,
  },
  pastBlock: {
    opacity: 0.5,
    backgroundColor: "#FAFAFA",
  },
  legDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  emojiText: {
    fontSize: 20,
  },
  descriptionCol: {
    flex: 1,
  },
  legDesc: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.neutral.textPrimary,
    fontFamily: Typography.fontFamilies.bold,
  },
  legTime: {
    fontSize: 12,
    color: Colors.neutral.textSecondary,
    marginTop: 2,
    fontFamily: Typography.fontFamilies.regular,
  },
  currentIndicator: {
    backgroundColor: Colors.primary.main,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  currentIndicatorText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "800",
    fontFamily: Typography.fontFamilies.bold,
  },
});
