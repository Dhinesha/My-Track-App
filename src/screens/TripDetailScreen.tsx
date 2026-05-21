import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  StyleSheet,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { RootStackParamList } from "../../App";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors, Typography, Spacing, Shadows } from "../constants/theme";

import {
  QuickActionsRow,
  TripProgressBar,
  WhatsHappeningNowCard,
  TodaySummaryCard,
  SmartCheckInBanner,
  InTripWeatherWidget,
  TripMemoriesCard,
  ReservationsAttachments,
} from "../components/trips";
import { EmergencyFAB } from "../components/common";

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, "TripDetail">;

export default function TripDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { tripId, tripName, tripStatus } = route.params;
  const isUpcoming = tripStatus === 'upcoming';
  const [isSelfCheckedIn, setIsSelfCheckedIn] = React.useState(false);

  React.useEffect(() => {
    const checkStatus = async () => {
      const saved = await AsyncStorage.getItem(`checkin_${tripId}`);
      if (saved) setIsSelfCheckedIn(true);
    };
    checkStatus();
  }, [tripId]);

  const menuItems = [
    {
      id: "itinerary",
      label: "Itinerary",
      sub: "View today's plan",
      icon: "calendar-outline",
      color: Colors.info.main,
      onPress: () => navigation.navigate("Itinerary", { tripId, tripName }),
    },
    {
      id: "vehicle",
      label: "Vehicle",
      sub: "Bus #2 - 12/15 here",
      icon: "bus-outline",
      color: Colors.warning.main,
      onPress: () => navigation.navigate("VehicleAttendance", { tripId }),
    },
    {
      id: "family",
      label: "Family",
      sub: "Manage Group",
      icon: "people-outline",
      color: Colors.success.checkIcon,
      onPress: () => navigation.navigate("FamilyMembers", { tripId }),
    },
    {
      id: "hotel",
      label: "Hotel Details",
      sub: "Hotel Granvia",
      icon: "business-outline",
      color: Colors.info.text,
      onPress: () => navigation.navigate("Hotel", { tripId }),
    },
    {
      id: "notifications",
      label: "Notifications",
      sub: "2 New",
      icon: "notifications-outline",
      color: Colors.info.main,
      badge: 2,
      onPress: () => navigation.navigate("Notifications"),
    },
    {
      id: "feedback",
      label: "Feedback",
      sub: "Rate your trip",
      icon: "star-outline",
      color: Colors.warning.main,
      onPress: () =>
        navigation.navigate("Feedback", {
          tripId,
          tripName,
          paxId: "demo-pax-1",
        }),
    },
    {
      id: "packing",
      label: "Packing List",
      sub: "Get ready for travel",
      icon: "briefcase-outline",
      color: Colors.primary.medium,
      onPress: () => navigation.navigate("PackingChecklist", { 
        tripId, 
        tripName, 
        tripType: "family" 
      }),
    },
  ];

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
        <Text style={styles.headerTitle}>Trip Dashboard</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {/* Hero Section (Edge to Edge) */}
        <View style={styles.heroContainer}>
          <Image
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAF3zCS6btqNZMelf0lJdzX-H_fJ9p6fdz5_CS7se8XKtsDOlN7JfSb7tD-o_X9RCgeWMHN48QmoY3DcAzd3u01NIffCACoUdjhjWpxJkjVNMkXRaewwYmdMVEZi1K8gDmp52Z9Au96Li8xUYqHT_7-2Jw9EQqOLjpnBNHOdU3voC2IPBPdu3gNb475ulRAXJ-WHy7Po4Kzptiqz_FgwBdYdfOV_qt4wdtFsW4YzBr59LP0K3-wo7U7NPD48IxJ04iEp0ZetTbg8fM",
            }}
            style={StyleSheet.absoluteFill}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.65)"]}
            style={StyleSheet.absoluteFill}
          />
          
          <View style={styles.heroContent}>
            {/* Top Row: Pill and status text */}
            <View style={styles.heroTopRow}>
              <View style={[styles.heroPill, isUpcoming && styles.heroPillUpcoming]}>
                <Text style={styles.heroPillText}>{isUpcoming ? 'Upcoming' : 'Day 2 of 9'}</Text>
              </View>
              <View style={styles.underwayContainer}>
                <View style={[styles.underwayDot, isUpcoming && styles.underwayDotUpcoming]} />
                <Text style={[styles.underwayText, isUpcoming && styles.underwayTextUpcoming]}>
                  {isUpcoming ? 'Not started yet' : 'Underway'}
                </Text>
              </View>
            </View>

            {/* Trip Name */}
            <Text style={styles.heroTripName}>{tripName}</Text>
            
            {/* Location Row */}
            <View style={styles.heroLocationRow}>
              <Ionicons name="location" size={18} color="#FFFFFF" />
              <Text style={styles.heroLocationText}>Kyoto, Japan</Text>
            </View>
            
            {/* Progress Bar & Track */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: "22%" }]} />
              </View>
              <Text style={styles.progressLabel}>Day 2 of 9</Text>
            </View>
          </View>
        </View>

        {/* Content wrapper for screen padding — only show banners for ongoing trips */}
        {!isUpcoming && (
          <View style={styles.paddedContent}>
            {/* Dynamic Banners */}
            <View style={styles.bannerContainer}>
              <TripMemoriesCard 
                tripId={tripId} 
                tripName={tripName} 
                startDate="2023-10-12" 
                endDate="2023-10-20" 
                paxId="demo-pax-1" 
              />
              <ReservationsAttachments tripId={tripId} tripName={tripName} />
              <SmartCheckInBanner />
              <InTripWeatherWidget />
              <WhatsHappeningNowCard />
              <TodaySummaryCard />
            </View>
          </View>
        )}

        {/* Quick Actions Row — only for ongoing trips */}
        {!isUpcoming && <QuickActionsRow isSelfCheckedIn={isSelfCheckedIn} />}

        <View style={styles.paddedContent}>
          {/* Upcoming Trip Info Banner */}
          {isUpcoming && (
            <View style={styles.upcomingBanner}>
              <Ionicons name="time-outline" size={20} color={Colors.info.text} />
              <View style={styles.upcomingBannerText}>
                <Text style={styles.upcomingBannerTitle}>Trip hasn't started yet</Text>
                <Text style={styles.upcomingBannerSub}>Check-in will be available when the trip begins. You can view and update other details now.</Text>
              </View>
            </View>
          )}

          {/* Self Check-In Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeading}>Self Check-In</Text>
              {!isUpcoming && isSelfCheckedIn && (
                <View style={styles.completedBadge}>
                  <Ionicons name="checkmark-circle" size={12} color={Colors.success.checkIcon} />
                  <Text style={styles.completedBadgeText}>Completed</Text>
                </View>
              )}
              {isUpcoming && (
                <View style={styles.upcomingChip}>
                  <Ionicons name="lock-closed-outline" size={11} color={Colors.neutral.textMuted} />
                  <Text style={styles.upcomingChipText}>Locked</Text>
                </View>
              )}
            </View>
            
            <TouchableOpacity 
              activeOpacity={isUpcoming ? 1 : 0.8}
              disabled={isUpcoming}
              style={[
                styles.primaryButton,
                isUpcoming || isSelfCheckedIn ? styles.disabledButton : styles.activeButton
              ]}
              onPress={async () => {
                if (!isSelfCheckedIn && !isUpcoming) {
                  await AsyncStorage.setItem(`checkin_${tripId}`, 'true');
                  setIsSelfCheckedIn(true);
                }
              }}
            >
              <Text style={[
                styles.primaryButtonText,
                isUpcoming || isSelfCheckedIn ? styles.disabledButtonText : styles.activeButtonText
              ]}>
                {isUpcoming ? 'Available when trip starts' : isSelfCheckedIn ? 'Already Checked In' : 'Check In'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Status Section */}
          <View style={styles.statusContainer}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>Day 1 of 8 — Wednesday 13 May</Text>
            </View>
            
            <View style={styles.statusPillsRow}>
              <View style={styles.statusPill}>
                <View style={styles.statusPillDot} />
                <Text style={styles.statusPillText}>My Check-in</Text>
              </View>
              <View style={styles.statusPill}>
                <View style={styles.statusPillDot} />
                <Text style={styles.statusPillText}>Family 2/4</Text>
              </View>
              <View style={styles.statusPill}>
                <View style={styles.statusPillDot} />
                <Text style={styles.statusPillText}>Hotel</Text>
              </View>
            </View>
          </View>

          {/* Menu Grid */}
          <View style={styles.menuGrid}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.85}
                onPress={item.onPress}
                style={[styles.menuCard, Shadows.sm]}
              >
                <View style={[styles.menuIconBg, { backgroundColor: item.color + '12' }]}>
                  <Ionicons name={item.icon as any} size={28} color={item.color} />
                  {item.badge && (
                    <View style={styles.menuBadge}>
                      <Text style={styles.menuBadgeText}>{item.badge}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuSub}>{item.sub}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
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
    fontFamily: Typography.fontFamilies.semibold,
  },
  headerRightPlaceholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroContainer: {
    height: Spacing.heroHeight,
    width: '100%',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  heroContent: {
    padding: 16,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  heroPill: {
    backgroundColor: Colors.primary.main,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  heroPillText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSizes.badgeText,
    fontWeight: '700',
    fontFamily: Typography.fontFamilies.bold,
  },
  underwayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  underwayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary.medium,
  },
  underwayText: {
    fontSize: Typography.fontSizes.smallLabel,
    color: Colors.primary.medium,
    fontFamily: Typography.fontFamilies.regular,
  },
  heroTripName: {
    fontSize: Typography.fontSizes.heroTripName,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: Typography.fontFamilies.bold,
    marginBottom: 4,
  },
  heroLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  heroLocationText: {
    fontSize: Typography.fontSizes.heroLoc,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: Typography.fontFamilies.regular,
  },
  progressContainer: {
    width: '100%',
  },
  progressBarTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  progressLabel: {
    fontSize: 13,
    color: Colors.primary.medium,
    fontFamily: Typography.fontFamilies.regular,
    marginTop: 6,
  },
  paddedContent: {
    paddingHorizontal: Spacing.screenPaddingH,
  },
  bannerContainer: {
    marginTop: 16,
    gap: 16,
  },
  sectionContainer: {
    marginTop: 24,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.neutral.textPrimary,
    fontFamily: Typography.fontFamilies.bold,
  },
  completedBadge: {
    backgroundColor: Colors.success.lightBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 0.5,
    borderColor: '#C2E7D9',
  },
  completedBadgeText: {
    color: Colors.success.text,
    fontSize: 10,
    fontWeight: '700',
    fontFamily: Typography.fontFamilies.bold,
    textTransform: 'uppercase',
  },
  primaryButton: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    ...Platform.select({
      web: { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
      },
    }) as any,
  },
  activeButton: {
    backgroundColor: Colors.primary.main,
  },
  disabledButton: {
    backgroundColor: Colors.neutral.border,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Typography.fontFamilies.semibold,
  },
  activeButtonText: {
    color: '#FFFFFF',
  },
  disabledButtonText: {
    color: Colors.neutral.textMuted,
  },
  statusContainer: {
    marginBottom: 16,
  },
  statusBadge: {
    backgroundColor: Colors.info.lightBg,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: '#C5DDF5',
  },
  statusBadgeText: {
    color: Colors.info.text,
    fontSize: 12,
    fontWeight: '700',
    fontFamily: Typography.fontFamilies.bold,
  },
  statusPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusPill: {
    backgroundColor: Colors.warning.lightBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: Colors.warning.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusPillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.warning.main,
  },
  statusPillText: {
    color: Colors.warning.textOnAmber,
    fontSize: 12,
    fontWeight: '700',
    fontFamily: Typography.fontFamilies.bold,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  menuCard: {
    width: '48%',
    backgroundColor: Colors.neutral.cardBackground,
    borderRadius: Spacing.cardRadius,
    padding: 16,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: Colors.neutral.border,
    alignItems: 'center',
  },
  menuIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  menuBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#D94040',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  menuBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    fontFamily: Typography.fontFamilies.bold,
  },
  menuLabel: {
    fontSize: Typography.fontSizes.boldInline,
    fontWeight: '700',
    color: Colors.neutral.textPrimary,
    fontFamily: Typography.fontFamilies.bold,
    marginBottom: 4,
    textAlign: 'center',
  },
  menuSub: {
    fontSize: Typography.fontSizes.sectionLabel,
    color: Colors.neutral.textMuted,
    fontFamily: Typography.fontFamilies.regular,
    textAlign: 'center',
  },

  // ── Upcoming trip styles ────────────────────────
  heroPillUpcoming: {
    backgroundColor: Colors.warning.main,
  },
  underwayDotUpcoming: {
    backgroundColor: Colors.warning.main,
  },
  underwayTextUpcoming: {
    color: '#FFFFFF',
  },
  upcomingBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: Colors.info.lightBg,
    borderWidth: 0.5,
    borderColor: '#C5DDF5',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  upcomingBannerText: {
    flex: 1,
  },
  upcomingBannerTitle: {
    fontFamily: Typography.fontFamilies.bold,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.info.text,
    marginBottom: 4,
  },
  upcomingBannerSub: {
    fontFamily: Typography.fontFamilies.regular,
    fontSize: 12,
    color: Colors.info.text,
    lineHeight: 18,
    opacity: 0.8,
  },
  upcomingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.neutral.divider,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: Colors.neutral.border,
  },
  upcomingChipText: {
    fontFamily: Typography.fontFamilies.bold,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.neutral.textMuted,
    textTransform: 'uppercase',
  },
});
