import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Typography, Spacing, Shadows } from "../../constants/theme";
import { Hotel } from "../../hooks/useHotel";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Props {
  hotels: Hotel[];
  currentDay: number;
}

export function HotelTimeline({ hotels, currentDay }: Props) {
  const [expanded, setExpanded] = useState<boolean>(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const renderStars = (count: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= count ? "star" : "star-outline"}
          size={12}
          color="#F5A623"
        />
      );
    }
    return <View style={styles.starsRow}>{stars}</View>;
  };

  return (
    <View style={[styles.card, Shadows.sm]}>
      <TouchableOpacity
        onPress={toggleExpand}
        activeOpacity={0.7}
        style={styles.header}
      >
        <View style={styles.headerLeft}>
          <Ionicons name="calendar-outline" size={20} color={Colors.primary.main} />
          <Text style={styles.headerTitle}>Full Trip Accommodation</Text>
        </View>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={Colors.neutral.textSecondary}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.timelineContainer}>
          {hotels.map((hotel, index) => {
            const isCurrent = currentDay >= hotel.check_in_day && currentDay <= hotel.check_out_day;
            const isPast = currentDay > hotel.check_out_day;
            const isFuture = currentDay < hotel.check_in_day;

            let cardStyle: any = styles.hotelBlock;
            if (isCurrent) {
              cardStyle = [styles.hotelBlock, styles.currentBlock];
            } else if (isPast) {
              cardStyle = [styles.hotelBlock, styles.pastBlock];
            }

            const isLast = index === hotels.length - 1;

            return (
              <View key={hotel.id} style={styles.timelineRow}>
                {/* Left side Timeline graphics */}
                <View style={styles.graphicsColumn}>
                  <View style={styles.dayDotCircle}>
                    <Text style={styles.dayDotText}>D{hotel.check_in_day}</Text>
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

                {/* Right side hotel details */}
                <View style={[cardStyle, { flex: 1, marginBottom: isLast ? 0 : 20 }]}>
                  <View style={styles.hotelHeaderRow}>
                    <Text style={styles.hotelName}>{hotel.name}</Text>
                    {renderStars(hotel.stars)}
                  </View>

                  <View style={styles.metaRow}>
                    <Ionicons name="key-outline" size={14} color={Colors.neutral.textSecondary} />
                    <Text style={styles.metaText}>
                      Room {hotel.room_number || "TBD"}
                    </Text>
                  </View>

                  <View style={styles.timingsGrid}>
                    <View style={styles.timingCol}>
                      <Text style={styles.timingLabel}>CHECK-IN</Text>
                      <Text style={styles.timingValue}>
                        Day {hotel.check_in_day} @ {hotel.check_in_time}
                      </Text>
                    </View>
                    <View style={styles.timingDivider} />
                    <View style={styles.timingCol}>
                      <Text style={styles.timingLabel}>CHECK-OUT</Text>
                      <Text style={styles.timingValue}>
                        Day {hotel.check_out_day} @ {hotel.check_out_time}
                      </Text>
                    </View>
                  </View>

                  {isCurrent && (
                    <View style={styles.currentBadge}>
                      <Text style={styles.currentBadgeText}>CURRENT STAY</Text>
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
    marginHorizontal: Spacing.screenPaddingH,
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
  dayDotCircle: {
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
  dayDotText: {
    fontSize: 11,
    fontWeight: "800",
    color: Colors.primary.main,
    fontFamily: Typography.fontFamilies.bold,
  },
  connectorLine: {
    width: 2,
    position: "absolute",
    top: 32,
    bottom: -20,
    zIndex: 1,
  },
  activeConnector: {
    backgroundColor: Colors.primary.main,
  },
  pastConnector: {
    backgroundColor: Colors.neutral.border,
  },
  hotelBlock: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
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
  hotelHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: 8,
  },
  hotelName: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.neutral.textPrimary,
    fontFamily: Typography.fontFamilies.bold,
  },
  starsRow: {
    flexDirection: "row",
    gap: 2,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  metaText: {
    fontSize: 12,
    color: Colors.neutral.textSecondary,
    fontFamily: Typography.fontFamilies.regular,
  },
  timingsGrid: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 0.5,
    borderTopColor: Colors.neutral.border,
    paddingTop: 10,
  },
  timingCol: {
    flex: 1,
  },
  timingLabel: {
    fontSize: 9,
    color: Colors.neutral.textMuted,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  timingValue: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.neutral.textSecondary,
    marginTop: 2,
  },
  timingDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.neutral.border,
    marginHorizontal: 12,
  },
  currentBadge: {
    backgroundColor: Colors.primary.main,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 10,
  },
  currentBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
    fontFamily: Typography.fontFamilies.bold,
  },
});
