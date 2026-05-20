import React, { useRef, useEffect } from "react";
import { ScrollView, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Typography, Spacing, Shadows } from "../../constants/theme";
import { Hotel } from "../../hooks/useHotel";

interface Props {
  hotels: Hotel[];
  activeDay: number;
  currentDay: number;
  onSelectDay: (day: number) => void;
}

export function HotelDayTabs({ hotels, activeDay, currentDay, onSelectDay }: Props) {
  const scrollViewRef = useRef<ScrollView>(null);

  // Compute total days from the highest check_out_day
  const maxDay = hotels.reduce((max, h) => Math.max(max, h.check_out_day), 7);
  const days = Array.from({ length: maxDay }, (_, i) => i + 1);

  // Auto-scroll to the current day tab on mount
  useEffect(() => {
    if (scrollViewRef.current) {
      // Approximate position of each tab (margin + padding + width)
      const tabWidth = 140; 
      const index = currentDay - 1;
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: Math.max(0, index * tabWidth - 20),
          animated: true,
        });
      }, 300);
    }
  }, [currentDay]);

  const getHotelForDay = (day: number): Hotel | null => {
    // Find hotel covering the day: check_in_day <= day AND check_out_day >= day
    // (If checkout is day D, and next checkin is day D, prioritize check-in or show checkout)
    const active = hotels.find(h => day >= h.check_in_day && day < h.check_out_day) ||
                   hotels.find(h => day === h.check_out_day);
    return active || null;
  };

  const getTruncatedName = (name: string) => {
    if (!name) return "";
    // Truncate to max 10 chars per specification
    return name.length > 10 ? name.substring(0, 10) + "..." : name;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {days.map((day) => {
          const hotel = getHotelForDay(day);
          const isActive = activeDay === day;
          const isToday = currentDay === day;
          const hotelName = hotel ? getTruncatedName(hotel.name) : "Transit";

          return (
            <TouchableOpacity
              key={day}
              onPress={() => onSelectDay(day)}
              activeOpacity={0.8}
              style={[
                styles.tabChip,
                isActive ? styles.tabChipActive : styles.tabChipInactive,
                isActive && Shadows.sm,
              ]}
            >
              <View style={styles.tabContent}>
                <Ionicons
                  name={hotel ? "business-outline" : "bus-outline"}
                  size={14}
                  color={isActive ? "#FFFFFF" : Colors.neutral.textSecondary}
                />
                <Text
                  style={[
                    styles.tabText,
                    isActive ? styles.tabTextActive : styles.tabTextInactive,
                  ]}
                >
                  Day {day} · {hotelName}
                </Text>
                {isToday && (
                  <View style={styles.todayIndicator} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screenPaddingH,
  },
  tabChip: {
    marginRight: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 0.5,
  },
  tabChipActive: {
    backgroundColor: Colors.primary.main,
    borderColor: Colors.primary.main,
  },
  tabChipInactive: {
    backgroundColor: "#FFFFFF",
    borderColor: Colors.neutral.border,
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#FFFFFF",
    fontFamily: Typography.fontFamilies.semibold,
  },
  tabTextInactive: {
    color: Colors.neutral.textSecondary,
    fontFamily: Typography.fontFamilies.regular,
  },
  todayIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#1D9E75", // Green dot indicator
    marginLeft: 2,
  },
});
