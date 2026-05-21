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
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Colors, Typography, Spacing, Shadows, fonts, textStyles } from '../constants/theme';

/* ── Per-trip itinerary data ─────────────────────── */
type Activity = {
  id: string;
  time: string;
  title: string;
  location: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  note?: string;
  alert?: string;
};

type TripItinerary = {
  title: string;
  dateLabel: string;
  days: string[];
  dailyActivities: Record<number, Activity[]>;
};

const TRIP_ITINERARIES: Record<string, TripItinerary> = {
  'kyoto-1': {
    title: 'Kyoto Spring Adventure',
    dateLabel: 'Oct 12 - Oct 20, 2023',
    days: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Day 9'],
    dailyActivities: {
      0: [
        { id: 'k1-1', time: '08:00 AM', title: 'Breakfast at Hotel', location: 'Main Lobby', icon: 'restaurant-outline', iconBg: Colors.info.lightBg, iconColor: Colors.info.text, note: 'Meet near the concierge desk.' },
        { id: 'k1-2', time: '10:00 AM', title: 'Sightseeing Bus Tour', location: 'Station A, Pickup Point', icon: 'bus-outline', iconBg: Colors.warning.lightBg, iconColor: Colors.warning.main, alert: 'Note: Bring water bottles & sunscreen.' },
        { id: 'k1-3', time: '01:00 PM', title: 'Lunch at Ramen Street', location: 'Tokyo Station', icon: 'restaurant-outline', iconBg: Colors.warning.lightBg, iconColor: Colors.warning.textOnAmber },
        { id: 'k1-4', time: '04:00 PM', title: 'Check-in to Ryokan', location: 'Hakone', icon: 'bed-outline', iconBg: Colors.primary.lightBg, iconColor: Colors.primary.main, note: 'Booking Ref: #JP-8829' },
      ],
      1: [
        { id: 'k2-1', time: '09:00 AM', title: 'Fushimi Inari Shrine', location: 'Kyoto', icon: 'location-outline', iconBg: Colors.urgent.lightBg, iconColor: Colors.urgent.main, note: 'Wear comfortable walking shoes.' },
        { id: 'k2-2', time: '12:30 PM', title: 'Traditional Kaiseki Lunch', location: 'Gion District', icon: 'restaurant-outline', iconBg: Colors.primary.lightBg, iconColor: Colors.primary.medium },
        { id: 'k2-3', time: '03:00 PM', title: 'Bamboo Forest Walk', location: 'Arashiyama', icon: 'leaf-outline', iconBg: Colors.success.lightBg, iconColor: Colors.success.text },
      ],
      2: [
        { id: 'k3-1', time: '10:00 AM', title: 'Universal Studios Japan', location: 'Osaka', icon: 'star-outline', iconBg: Colors.warning.lightBg, iconColor: Colors.warning.main, alert: 'Express Passes are in your digital vault.' },
        { id: 'k3-2', time: '07:00 PM', title: 'Street Food Tour', location: 'Dotonbori', icon: 'fast-food-outline', iconBg: Colors.warning.lightBg, iconColor: Colors.warning.textOnAmber },
      ],
      3: [
        { id: 'k4-1', time: '09:00 AM', title: 'Nara Deer Park', location: 'Nara', icon: 'heart-outline', iconBg: Colors.urgent.lightBg, iconColor: Colors.urgent.main, note: 'Purchase deer crackers at the entrance.' },
        { id: 'k4-2', time: '01:00 PM', title: 'Todai-ji Temple Visit', location: 'Nara', icon: 'business-outline', iconBg: Colors.info.lightBg, iconColor: Colors.info.main },
      ],
      4: [
        { id: 'k5-1', time: '08:00 AM', title: 'Kiyomizu-dera Temple', location: 'Kyoto', icon: 'location-outline', iconBg: Colors.urgent.lightBg, iconColor: Colors.urgent.main, note: 'Best morning light for photos.' },
        { id: 'k5-2', time: '12:00 PM', title: 'Nishiki Market Lunch', location: 'Kyoto', icon: 'restaurant-outline', iconBg: Colors.warning.lightBg, iconColor: Colors.warning.main },
        { id: 'k5-3', time: '03:00 PM', title: 'Tea Ceremony Experience', location: 'Kyoto', icon: 'cafe-outline', iconBg: Colors.success.lightBg, iconColor: Colors.success.text },
      ],
      5: [
        { id: 'k6-1', time: '09:00 AM', title: 'Kinkaku-ji Golden Temple', location: 'Kyoto', icon: 'star-outline', iconBg: Colors.warning.lightBg, iconColor: Colors.warning.main },
        { id: 'k6-2', time: '02:00 PM', title: 'Kimono Rental & Walk', location: 'Gion District', icon: 'shirt-outline', iconBg: Colors.primary.lightBg, iconColor: Colors.primary.main },
      ],
      6: [
        { id: 'k7-1', time: '07:00 AM', title: 'Tsukiji Fish Market', location: 'Tokyo', icon: 'fish-outline', iconBg: Colors.info.lightBg, iconColor: Colors.info.text },
        { id: 'k7-2', time: '11:00 AM', title: 'Senso-ji Temple', location: 'Asakusa', icon: 'location-outline', iconBg: Colors.urgent.lightBg, iconColor: Colors.urgent.main },
        { id: 'k7-3', time: '04:00 PM', title: 'Akihabara Electronics Tour', location: 'Tokyo', icon: 'hardware-chip-outline', iconBg: Colors.primary.lightBg, iconColor: Colors.primary.medium },
      ],
      7: [
        { id: 'k8-1', time: '09:00 AM', title: 'Mount Fuji Day Trip', location: 'Fuji-Hakone', icon: 'trail-sign-outline', iconBg: Colors.success.lightBg, iconColor: Colors.success.text, alert: 'Pack warm clothing — temperature drops.' },
        { id: 'k8-2', time: '06:00 PM', title: 'Farewell Dinner', location: 'Tokyo', icon: 'restaurant-outline', iconBg: Colors.warning.lightBg, iconColor: Colors.warning.main, note: 'Group photo at the restaurant.' },
      ],
      8: [
        { id: 'k9-1', time: '08:00 AM', title: 'Last Minute Shopping', location: 'Shinjuku', icon: 'cart-outline', iconBg: Colors.neutral.divider, iconColor: Colors.neutral.textSecondary },
        { id: 'k9-2', time: '02:00 PM', title: 'Airport Transfer', location: 'Narita Airport', icon: 'airplane-outline', iconBg: Colors.info.lightBg, iconColor: Colors.info.text, note: 'Flight departs at 05:30 PM' },
      ],
    },
  },
  'goa-1': {
    title: 'Goa Beach Party',
    dateLabel: 'Dec 15 - Dec 22, 2023',
    days: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8'],
    dailyActivities: {
      0: [
        { id: 'g1-1', time: '10:00 AM', title: 'Arrive at Goa Airport', location: 'Dabolim Airport', icon: 'airplane-outline', iconBg: Colors.info.lightBg, iconColor: Colors.info.text, note: 'Cab pickup arranged at Gate 3.' },
        { id: 'g1-2', time: '12:30 PM', title: 'Check-in to Beach Resort', location: 'Calangute', icon: 'bed-outline', iconBg: Colors.primary.lightBg, iconColor: Colors.primary.main, note: 'Booking Ref: #GOA-4421' },
        { id: 'g1-3', time: '04:00 PM', title: 'Sunset Beach Walk', location: 'Baga Beach', icon: 'sunny-outline', iconBg: Colors.warning.lightBg, iconColor: Colors.warning.main },
        { id: 'g1-4', time: '08:00 PM', title: 'Welcome Dinner at Shack', location: 'Tito\'s Lane', icon: 'restaurant-outline', iconBg: Colors.urgent.lightBg, iconColor: Colors.urgent.main },
      ],
      1: [
        { id: 'g2-1', time: '09:00 AM', title: 'Watersports Adventure', location: 'Calangute Beach', icon: 'water-outline', iconBg: Colors.info.lightBg, iconColor: Colors.info.main, alert: 'Jet ski, parasailing & banana ride included.' },
        { id: 'g2-2', time: '01:00 PM', title: 'Seafood Lunch', location: 'Fisherman\'s Wharf', icon: 'restaurant-outline', iconBg: Colors.warning.lightBg, iconColor: Colors.warning.textOnAmber },
        { id: 'g2-3', time: '04:00 PM', title: 'Fort Aguada Visit', location: 'North Goa', icon: 'business-outline', iconBg: Colors.primary.lightBg, iconColor: Colors.primary.medium },
      ],
      2: [
        { id: 'g3-1', time: '08:30 AM', title: 'Dudhsagar Waterfalls Trip', location: 'South Goa', icon: 'water-outline', iconBg: Colors.info.lightBg, iconColor: Colors.info.text, alert: 'Jeep ride — carry waterproof bags.' },
        { id: 'g3-2', time: '05:00 PM', title: 'Spice Plantation Visit', location: 'Ponda', icon: 'leaf-outline', iconBg: Colors.success.lightBg, iconColor: Colors.success.text },
      ],
      3: [
        { id: 'g4-1', time: '10:00 AM', title: 'Old Goa Heritage Walk', location: 'Old Goa', icon: 'location-outline', iconBg: Colors.urgent.lightBg, iconColor: Colors.urgent.main, note: 'Visit Basilica of Bom Jesus.' },
        { id: 'g4-2', time: '02:00 PM', title: 'Flea Market Shopping', location: 'Anjuna Market', icon: 'cart-outline', iconBg: Colors.warning.lightBg, iconColor: Colors.warning.main },
        { id: 'g4-3', time: '07:00 PM', title: 'Beach Bonfire Night', location: 'Vagator Beach', icon: 'bonfire-outline', iconBg: Colors.urgent.lightBg, iconColor: Colors.urgent.main },
      ],
      4: [
        { id: 'g5-1', time: '09:00 AM', title: 'Dolphin Watching Cruise', location: 'Sinquerim Jetty', icon: 'boat-outline', iconBg: Colors.info.lightBg, iconColor: Colors.info.main },
        { id: 'g5-2', time: '01:00 PM', title: 'Goan Thali Lunch', location: 'Panjim', icon: 'restaurant-outline', iconBg: Colors.warning.lightBg, iconColor: Colors.warning.main },
        { id: 'g5-3', time: '04:00 PM', title: 'Casino Evening', location: 'Casino Pride', icon: 'diamond-outline', iconBg: Colors.primary.lightBg, iconColor: Colors.primary.main },
      ],
      5: [
        { id: 'g6-1', time: '10:00 AM', title: 'Kayaking at Sal Backwaters', location: 'South Goa', icon: 'water-outline', iconBg: Colors.info.lightBg, iconColor: Colors.info.text },
        { id: 'g6-2', time: '03:00 PM', title: 'Palolem Beach Relax', location: 'Palolem', icon: 'sunny-outline', iconBg: Colors.warning.lightBg, iconColor: Colors.warning.main },
      ],
      6: [
        { id: 'g7-1', time: '09:00 AM', title: 'Pool Day at Resort', location: 'Calangute', icon: 'water-outline', iconBg: Colors.info.lightBg, iconColor: Colors.info.main, note: 'Pool-side DJ party at 11 AM.' },
        { id: 'g7-2', time: '07:00 PM', title: 'Farewell Gala Dinner', location: 'Taj Exotica', icon: 'restaurant-outline', iconBg: Colors.warning.lightBg, iconColor: Colors.warning.textOnAmber, note: 'Dress code: Smart casuals.' },
      ],
      7: [
        { id: 'g8-1', time: '08:00 AM', title: 'Souvenir Shopping', location: 'Mapusa Market', icon: 'cart-outline', iconBg: Colors.neutral.divider, iconColor: Colors.neutral.textSecondary },
        { id: 'g8-2', time: '01:00 PM', title: 'Airport Transfer', location: 'Dabolim Airport', icon: 'airplane-outline', iconBg: Colors.info.lightBg, iconColor: Colors.info.text, note: 'Flight departs at 04:15 PM' },
      ],
    },
  },
  'paris-1': {
    title: 'Paris Getaway',
    dateLabel: 'Jan 05 - Jan 12, 2024',
    days: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8'],
    dailyActivities: {
      0: [
        { id: 'p1-1', time: '09:00 AM', title: 'Arrive at Charles de Gaulle', location: 'CDG Airport', icon: 'airplane-outline', iconBg: Colors.info.lightBg, iconColor: Colors.info.text, note: 'Private shuttle to hotel arranged.' },
        { id: 'p1-2', time: '12:00 PM', title: 'Check-in & Freshen Up', location: 'Hotel Le Marais', icon: 'bed-outline', iconBg: Colors.primary.lightBg, iconColor: Colors.primary.main, note: 'Booking Ref: #PAR-9912' },
        { id: 'p1-3', time: '03:00 PM', title: 'Seine River Cruise', location: 'Pont Neuf', icon: 'boat-outline', iconBg: Colors.info.lightBg, iconColor: Colors.info.main },
        { id: 'p1-4', time: '07:30 PM', title: 'French Dinner Experience', location: 'Le Procope', icon: 'restaurant-outline', iconBg: Colors.warning.lightBg, iconColor: Colors.warning.main, note: 'Reservation confirmed for 8 guests.' },
      ],
      1: [
        { id: 'p2-1', time: '09:00 AM', title: 'Eiffel Tower Visit', location: 'Champ de Mars', icon: 'location-outline', iconBg: Colors.urgent.lightBg, iconColor: Colors.urgent.main, alert: 'Summit tickets — take warm jacket.' },
        { id: 'p2-2', time: '01:00 PM', title: 'Lunch at Café de Flore', location: 'Saint-Germain', icon: 'cafe-outline', iconBg: Colors.warning.lightBg, iconColor: Colors.warning.textOnAmber },
        { id: 'p2-3', time: '03:30 PM', title: 'Arc de Triomphe', location: 'Champs-Élysées', icon: 'business-outline', iconBg: Colors.primary.lightBg, iconColor: Colors.primary.medium },
      ],
      2: [
        { id: 'p3-1', time: '09:30 AM', title: 'Louvre Museum', location: 'Louvre', icon: 'image-outline', iconBg: Colors.info.lightBg, iconColor: Colors.info.text, alert: 'Skip-the-line passes in your wallet.' },
        { id: 'p3-2', time: '02:00 PM', title: 'Tuileries Garden Walk', location: 'Tuileries', icon: 'leaf-outline', iconBg: Colors.success.lightBg, iconColor: Colors.success.text },
        { id: 'p3-3', time: '06:00 PM', title: 'Montmartre Evening Walk', location: 'Sacré-Cœur', icon: 'walk-outline', iconBg: Colors.primary.lightBg, iconColor: Colors.primary.main },
      ],
      3: [
        { id: 'p4-1', time: '10:00 AM', title: 'Palace of Versailles', location: 'Versailles', icon: 'business-outline', iconBg: Colors.warning.lightBg, iconColor: Colors.warning.main, note: 'Coach departs from hotel at 9:30 AM.' },
        { id: 'p4-2', time: '05:00 PM', title: 'Versailles Garden Tour', location: 'Versailles', icon: 'leaf-outline', iconBg: Colors.success.lightBg, iconColor: Colors.success.text },
      ],
      4: [
        { id: 'p5-1', time: '09:00 AM', title: 'Musée d\'Orsay', location: 'Orsay', icon: 'image-outline', iconBg: Colors.info.lightBg, iconColor: Colors.info.main },
        { id: 'p5-2', time: '01:00 PM', title: 'Latin Quarter Food Tour', location: 'Latin Quarter', icon: 'restaurant-outline', iconBg: Colors.warning.lightBg, iconColor: Colors.warning.main },
        { id: 'p5-3', time: '04:00 PM', title: 'Notre-Dame Area Walk', location: 'Île de la Cité', icon: 'location-outline', iconBg: Colors.urgent.lightBg, iconColor: Colors.urgent.main },
      ],
      5: [
        { id: 'p6-1', time: '08:00 AM', title: 'Day Trip to Giverny', location: 'Giverny', icon: 'color-palette-outline', iconBg: Colors.success.lightBg, iconColor: Colors.success.text, note: 'Monet\'s Garden — cameras recommended.' },
        { id: 'p6-2', time: '06:00 PM', title: 'Paris Night Illuminations', location: 'Bus Tour', icon: 'moon-outline', iconBg: Colors.primary.lightBg, iconColor: Colors.primary.main },
      ],
      6: [
        { id: 'p7-1', time: '10:00 AM', title: 'Shopping at Galeries Lafayette', location: 'Boulevard Haussmann', icon: 'cart-outline', iconBg: Colors.warning.lightBg, iconColor: Colors.warning.main },
        { id: 'p7-2', time: '03:00 PM', title: 'Patisserie Workshop', location: 'Le Cordon Bleu', icon: 'restaurant-outline', iconBg: Colors.urgent.lightBg, iconColor: Colors.urgent.main, note: 'Learn to make macarons & croissants.' },
        { id: 'p7-3', time: '08:00 PM', title: 'Farewell Dinner Cruise', location: 'Seine River', icon: 'boat-outline', iconBg: Colors.info.lightBg, iconColor: Colors.info.text },
      ],
      7: [
        { id: 'p8-1', time: '09:00 AM', title: 'Final Souvenirs & Café', location: 'Le Marais', icon: 'cafe-outline', iconBg: Colors.warning.lightBg, iconColor: Colors.warning.textOnAmber },
        { id: 'p8-2', time: '01:00 PM', title: 'Airport Transfer', location: 'CDG Airport', icon: 'airplane-outline', iconBg: Colors.info.lightBg, iconColor: Colors.info.text, note: 'Flight departs at 04:45 PM' },
      ],
    },
  },
};

// Default fallback = Kyoto data
const DEFAULT_TRIP_ID = 'kyoto-1';

type ItineraryRouteParams = {
  Itinerary: { tripId: string; tripName: string };
};

export default function ItineraryScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<ItineraryRouteParams, 'Itinerary'>>();
  const { tripId, tripName } = route.params ?? { tripId: DEFAULT_TRIP_ID, tripName: '' };
  const [activeDay, setActiveDay] = useState(0);

  const tripData = TRIP_ITINERARIES[tripId] ?? TRIP_ITINERARIES[DEFAULT_TRIP_ID];
  const days = tripData.days;
  const activities = tripData.dailyActivities[activeDay] || [];

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
            <Text style={styles.tripTitle}>{tripData.title}</Text>
            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={16} color={Colors.warning.main} />
              <Text style={styles.dateText}>{tripData.dateLabel}</Text>
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
