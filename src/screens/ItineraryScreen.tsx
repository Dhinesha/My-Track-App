import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Colors, Typography, Spacing, Shadows, fonts, textStyles } from '../constants/theme';

export default function ItineraryScreen() {
  const navigation = useNavigation<any>();
  const [activeDay, setActiveDay] = useState(0);

  const days = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"];
  
  const dailyActivities: Record<number, any[]> = {
    0: [ // Day 1
      {
        id: "1-1",
        time: "08:00 AM",
        title: "Breakfast at Hotel",
        location: "Main Lobby",
        icon: "restaurant-outline",
        iconBg: Colors.info.lightBg,
        iconColor: Colors.info.text,
        note: "Meet near the concierge desk.",
      },
      {
        id: "1-2",
        time: "10:00 AM",
        title: "Sightseeing Bus Tour",
        location: "Station A, Pickup Point",
        icon: "bus-outline",
        iconBg: Colors.warning.lightBg,
        iconColor: Colors.warning.main,
        alert: "Note: Bring water bottles & sunscreen.",
      },
      {
        id: "1-3",
        time: "01:00 PM",
        title: "Lunch at Ramen Street",
        location: "Tokyo Station",
        icon: "restaurant-outline",
        iconBg: Colors.warning.lightBg,
        iconColor: Colors.warning.textOnAmber,
      },
      {
        id: "1-4",
        time: "04:00 PM",
        title: "Check-in to Ryokan",
        location: "Hakone",
        icon: "bed-outline",
        iconBg: Colors.primary.lightBg,
        iconColor: Colors.primary.main,
        note: "Booking Ref: #JP-8829",
      },
    ],
    1: [ // Day 2
      {
        id: "2-1",
        time: "09:00 AM",
        title: "Fushimi Inari Shrine",
        location: "Kyoto",
        icon: "location-outline",
        iconBg: Colors.urgent.lightBg,
        iconColor: Colors.urgent.main,
        note: "Wear comfortable walking shoes.",
      },
      {
        id: "2-2",
        time: "12:30 PM",
        title: "Traditional Kaiseki Lunch",
        location: "Gion District",
        icon: "restaurant-outline",
        iconBg: Colors.primary.lightBg,
        iconColor: Colors.primary.medium,
      },
      {
        id: "2-3",
        time: "03:00 PM",
        title: "Bamboo Forest Walk",
        location: "Arashiyama",
        icon: "leaf-outline",
        iconBg: Colors.success.lightBg,
        iconColor: Colors.success.text,
      },
    ],
    2: [ // Day 3
      {
        id: "3-1",
        time: "10:00 AM",
        title: "Universal Studios Japan",
        location: "Osaka",
        icon: "star-outline",
        iconBg: Colors.warning.lightBg,
        iconColor: Colors.warning.main,
        alert: "Express Passes are in your digital vault.",
      },
      {
        id: "3-2",
        time: "07:00 PM",
        title: "Street Food Tour",
        location: "Dotonbori",
        icon: "fast-food-outline",
        iconBg: Colors.warning.lightBg,
        iconColor: Colors.warning.textOnAmber,
      },
    ],
    3: [ // Day 4
      {
        id: "4-1",
        time: "09:00 AM",
        title: "Nara Deer Park",
        location: "Nara",
        icon: "heart-outline",
        iconBg: Colors.urgent.lightBg,
        iconColor: Colors.urgent.main,
        note: "Purchase deer crackers at the entrance.",
      },
      {
        id: "4-2",
        time: "01:00 PM",
        title: "Todai-ji Temple Visit",
        location: "Nara",
        icon: "business-outline",
        iconBg: Colors.info.lightBg,
        iconColor: Colors.info.main,
      },
    ],
    4: [ // Day 5
      {
        id: "5-1",
        time: "08:00 AM",
        title: "Last Minute Shopping",
        location: "Shinjuku",
        icon: "cart-outline",
        iconBg: Colors.neutral.divider,
        iconColor: Colors.neutral.textSecondary,
      },
      {
        id: "5-2",
        time: "02:00 PM",
        title: "Airport Transfer",
        location: "Narita Airport",
        icon: "airplane-outline",
        iconBg: Colors.info.lightBg,
        iconColor: Colors.info.text,
        note: "Flight departs at 05:30 PM",
      },
    ],
  };

  const activities = dailyActivities[activeDay] || [];

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.headerBackBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.neutral.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Itinerary</Text>
        {/* Spacer to keep title centered */}
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {/* Trip Headline */}
        <View style={styles.headlineRow}>
          <View style={styles.headlineLeft}>
            <Text style={styles.tripTitle}>Tokyo Family Adventure</Text>
            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={16} color={Colors.warning.main} />
              <Text style={styles.dateText}>Oct 12 - Oct 20, 2023</Text>
            </View>
          </View>
          <LinearGradient
            colors={[Colors.info.main, Colors.primary.main]}
            style={styles.takeoffIconContainer}
          >
            <Ionicons name="airplane-outline" size={24} color="white" />
          </LinearGradient>
        </View>

        {/* Day Selector Chips */}
        <View style={styles.daySelectorWrapper}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.daySelectorContent}
          >
            {days.map((day, index) => {
              const isActive = activeDay === index;
              return (
                <TouchableOpacity
                  key={day}
                  onPress={() => setActiveDay(index)}
                  activeOpacity={0.8}
                  style={[
                    styles.dayChip,
                    isActive ? styles.dayChipActive : styles.dayChipInactive,
                    isActive && Shadows.sm
                  ]}
                >
                  <Text style={[
                    styles.dayChipText,
                    isActive ? styles.dayChipTextActive : styles.dayChipTextInactive
                  ]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Timeline Schedule Section */}
        <View style={styles.timelineSection}>
          <Text style={styles.scheduleLabel}>
            {activeDay === 0 ? "OCTOBER 12TH" : activeDay === 1 ? "OCTOBER 13TH" : activeDay === 2 ? "OCTOBER 14TH" : activeDay === 3 ? "OCTOBER 15TH" : "OCTOBER 16TH"} SCHEDULE
          </Text>

          {activities.map((activity, index) => (
            <View key={activity.id} style={styles.timelineRow}>
              {/* Left Timeline Indicator */}
              <View style={styles.timelineIndicatorColumn}>
                <View style={styles.timelineLineTop} />
                <View 
                  style={[styles.timelineIconCircle, { backgroundColor: activity.iconBg }]}
                >
                  <Ionicons 
                    name={activity.icon as any} 
                    size={18} 
                    color={activity.iconColor} 
                  />
                </View>
                <View style={[
                  styles.timelineLineBottom,
                  index === activities.length - 1 && styles.transparentLine
                ]} />
              </View>

              {/* Right Activity Card */}
              <View style={styles.activityCardColumn}>
                <View style={[styles.activityCard, Shadows.sm]}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{activity.title}</Text>
                    <View style={styles.timeBadge}>
                      <Text style={styles.timeBadgeText}>{activity.time}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.locationRow}>
                    <Ionicons name="location-outline" size={14} color={Colors.neutral.textMuted} />
                    <Text style={styles.locationText}>{activity.location}</Text>
                  </View>

                  {activity.note && (
                    <Text style={styles.noteText}>{activity.note}</Text>
                  )}

                  {activity.alert && (
                    <View style={styles.alertCard}>
                      <Ionicons name="information-circle" size={15} color={Colors.warning.main} style={styles.alertIcon} />
                      <Text style={styles.alertText}>{activity.alert}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Nav Mockup */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Main', { screen: 'My Trips' })} 
          style={styles.navItem}
          activeOpacity={0.7}
        >
          <Ionicons name="map-outline" size={22} color={Colors.neutral.textMuted} />
          <Text style={styles.navLabelInactive}>My Trips</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Main', { screen: 'Home' })} 
          style={styles.navItem}
          activeOpacity={0.7}
        >
          <View style={styles.navActiveWrapper}>
            <Ionicons name="grid" size={22} color={Colors.primary.main} />
            <View style={styles.navActiveDot} />
          </View>
          <Text style={styles.navLabelActive}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Main', { screen: 'Profile' })} 
          style={styles.navItem}
          activeOpacity={0.7}
        >
          <Ionicons name="person-outline" size={22} color={Colors.neutral.textMuted} />
          <Text style={styles.navLabelInactive}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.neutral.pageBackground,
  },
  headerBar: {
    height: Spacing.headerHeight,
    backgroundColor: Colors.neutral.headerBg,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.neutral.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenPaddingH,
  },
  headerBackBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSizes.screenTitle,
    fontWeight: '600',
    color: Colors.neutral.textPrimary,
    fontFamily: fonts.semiBold,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 160,
  },
  headlineRow: {
    paddingHorizontal: Spacing.screenPaddingH,
    paddingTop: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headlineLeft: {
    flex: 1,
    marginRight: 16,
  },
  tripTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral.textPrimary,
    fontFamily: fonts.bold,
    lineHeight: 28,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  dateText: {
    fontSize: 14,
    color: Colors.neutral.textSecondary,
    fontFamily: fonts.regular,
  },
  takeoffIconContainer: {
    height: 50,
    width: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: { boxShadow: '0 4px 8px rgba(0,0,0,0.1)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
    }) as any,
  },
  daySelectorWrapper: {
    marginVertical: 12,
  },
  daySelectorContent: {
    paddingHorizontal: Spacing.screenPaddingH,
  },
  dayChip: {
    marginRight: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 0.5,
  },
  dayChipActive: {
    backgroundColor: Colors.primary.main,
    borderColor: Colors.primary.main,
  },
  dayChipInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: Colors.neutral.border,
  },
  dayChipText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: fonts.bold,},
  dayChipTextActive: {
    color: '#FFFFFF',
    fontFamily: fonts.bold,
  },
  dayChipTextInactive: {
    color: Colors.neutral.textSecondary,
    fontFamily: fonts.regular,
  },
  timelineSection: {
    paddingHorizontal: Spacing.screenPaddingH,
    marginTop: 16,
  },
  scheduleLabel: {
    fontSize: Typography.fontSizes.sectionLabel,
    fontWeight: '700',
    color: Colors.primary.medium,
    fontFamily: fonts.bold,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 20,
    paddingLeft: 4,
  },
  timelineRow: {
    flexDirection: 'row',
  },
  timelineIndicatorColumn: {
    alignItems: 'center',
    width: 40,
  },
  timelineLineTop: {
    height: 4,
    width: 2,
    backgroundColor: Colors.neutral.border,
  },
  timelineIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderWidth: 3,
    borderColor: Colors.neutral.pageBackground,
  },
  timelineLineBottom: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.neutral.border,
  },
  transparentLine: {
    backgroundColor: 'transparent',
  },
  activityCardColumn: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 24,
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.cardRadius,
    padding: 16,
    borderWidth: 0.5,
    borderColor: Colors.neutral.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  cardTitle: {
    flex: 1,
    fontSize: Typography.fontSizes.cardTitle,
    fontWeight: '700',
    color: Colors.neutral.textPrimary,
    fontFamily: fonts.bold,
    lineHeight: 20,
  },
  timeBadge: {
    backgroundColor: Colors.info.lightBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#C5DDF5',
  },
  timeBadgeText: {
    color: Colors.info.text,
    fontSize: 10,
    fontWeight: '700',
    fontFamily: fonts.bold,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  locationText: {
    fontSize: Typography.fontSizes.smallLabel,
    color: Colors.neutral.textSecondary,
    fontFamily: fonts.regular,
  },
  noteText: {
    fontSize: Typography.fontSizes.smallLabel,
    color: Colors.neutral.textMuted,
    fontFamily: fonts.regular,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: Colors.warning.lightBg,
    borderWidth: 0.5,
    borderColor: Colors.warning.border,
    padding: 10,
    borderRadius: 10,
    marginTop: 8,
  },
  alertIcon: {
    marginTop: 1,
  },
  alertText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: Colors.warning.textOnAmber,
    lineHeight: 16,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0.5,
    borderTopColor: Colors.neutral.border,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 64,
    paddingBottom: Platform.OS === 'ios' ? 12 : 0,
    ...Platform.select({
      web: { boxShadow: '0 -4px 12px rgba(0,0,0,0.05)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 10,
      },
    }) as any,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  navActiveWrapper: {
    position: 'relative',
    alignItems: 'center',
  },
  navActiveDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary.main,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  navLabelActive: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: Colors.primary.main,
  },
  navLabelInactive: {
    fontSize: 10,
    fontWeight: '500',
    fontFamily: fonts.regular,
    color: Colors.neutral.textMuted,
  },
});
