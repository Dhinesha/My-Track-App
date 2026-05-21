import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  StatusBar,
  StyleSheet,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../store/authStore';
import { useTripStore } from '../../store/tripStore';
import { useProfileStore } from '../../store/profileStore';
import { Colors, Typography, Spacing, Shadows, fonts, textStyles } from '../../constants/theme';
import { EmergencyFAB } from '../../components/common';

export const TripHomeScreen = () => {
  const { user } = useAuthStore();
  const navigation = useNavigation<any>();
  const { setActiveTrip, activeTripId } = useTripStore();
  const profile = useProfileStore();
  
  const [loading, setLoading] = useState(true);
  const [ongoingTrip, setOngoingTrip] = useState<any>(null);

  useEffect(() => {
    profile.loadProfile();
    const trip = {
      id: 'kyoto-1',
      name: 'Kyoto Spring Adventure',
      departure_city: 'Osaka',
      destination_city: 'Kyoto',
      current_day: 9,
      total_days: 9,
      progress: 100,
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAF3zCS6btqNZMelf0lJdzX-H_fJ9p6fdz5_CS7se8XKtsDOlN7JfSb7tD-o_X9RCgeWMHN48QmoY3DcAzd3u01NIffCACoUdjhjWpxJkjVNMkXRaewwYmdMVEZi1K8gDmp52Z9Au96Li8xUYqHT_7-2Jw9EQqOLjpnBNHOdU3voC2IPBPdu3gNb475ulRAXJ-WHy7Po4Kzptiqz_FgwBdYdfOV_qt4wdtFsW4YzBr59LP0K3-wo7U7NPD48IxJ04iEp0ZetTbg8fM',
    };
    setOngoingTrip(trip);
    
    if (!activeTripId) {
      setActiveTrip(trip.id, trip.name);
    }
    
    setLoading(false);
  }, [activeTripId, setActiveTrip]);

  if (loading || !ongoingTrip) return null;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MyTripGuide</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Profile')} 
            style={styles.profileBtn}
            activeOpacity={0.7}
          >
            <Image 
              source={{ uri: profile.photo }} 
              style={styles.profileImg}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {/* Quick Actions Row */}
        <View style={styles.quickActionsRow}>
          {[
            { id: 'itinerary', label: 'Itinerary', icon: 'calendar-outline', color: Colors.info.main, bg: Colors.info.lightBg },
            { id: 'vehicle', label: 'Vehicle', icon: 'bus', color: Colors.warning.main, bg: Colors.warning.lightBg },
            { id: 'notifications', label: 'Notifications', icon: 'notifications', color: Colors.info.main, bg: Colors.info.lightBg, count: 2 },
            { id: 'emergency', label: 'Emergency', icon: 'warning', color: Colors.info.main, bg: Colors.info.lightBg },
          ].map((action) => (
            <TouchableOpacity 
              key={action.id}
              style={styles.quickActionItem}
              activeOpacity={0.75}
              onPress={() => {
                if (action.id === 'emergency') navigation.navigate('Emergency');
                else if (action.id === 'itinerary') navigation.navigate('Itinerary', { tripId: ongoingTrip.id, tripName: ongoingTrip.name });
                else if (action.id === 'vehicle') navigation.navigate('VehicleAttendance', { tripId: ongoingTrip.id });
                else if (action.id === 'notifications') navigation.navigate('Notifications');
              }}
            >
              <View style={[styles.quickActionIconContainer, { backgroundColor: action.bg }, Shadows.sm]}>
                <Ionicons name={action.icon as any} size={26} color={action.color} />
                {action.count !== undefined && action.count > 0 && (
                  <View style={styles.quickActionBadge}>
                    <Text style={styles.quickActionBadgeText}>{action.count}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Ongoing Trip Hero Card */}
        <View style={styles.heroWrapper}>
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => navigation.navigate('TripDetail', { tripId: ongoingTrip.id, tripName: ongoingTrip.name })}
            style={[styles.heroCard, Shadows.md]}
          >
            <Image
              source={{ uri: ongoingTrip.image_url }}
              style={StyleSheet.absoluteFill}
            />
            <LinearGradient
              colors={['transparent', 'rgba(15, 110, 86, 0.9)']}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.heroCardContent}>
              <View>
                <View style={styles.ongoingBadge}>
                  <Text style={styles.ongoingBadgeText}>ONGOING</Text>
                </View>
                <Text style={styles.heroTripTitle}>
                  Kyoto Spring Adventure
                </Text>
                <View style={styles.heroDayBadge}>
                  <Text style={styles.heroDayText}>Day 9 of 9</Text>
                </View>
                <View style={styles.heroDivider} />
              </View>
              
              <View style={styles.heroFooter}>
                <View style={styles.cityRow}>
                  <Text style={styles.cityText}>Osaka</Text>
                  <Ionicons name="arrow-forward-outline" size={18} color="white" style={{ marginHorizontal: 8 }} />
                  <Text style={styles.cityText}>Kyoto</Text>
                </View>
                <View style={styles.heroArrowBtn}>
                  <Ionicons name="arrow-forward" size={18} color={Colors.primary.main} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Upcoming Trips Section */}
        <View style={styles.upcomingSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeading}>Upcoming Trips</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.seeAllText}>See All ›</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.upcomingScrollContent}
            style={styles.upcomingScrollView}
            decelerationRate="fast"
            snapToInterval={272}
            snapToAlignment="start"
          >
            <View style={[styles.upcomingCard, Shadows.sm]}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80' }} 
                style={styles.upcomingCardImg}
              />
              <View style={styles.upcomingCardBody}>
                <Text style={styles.upcomingCardTitle}>Kyoto Spring Adventure</Text>
                <Text style={styles.upcomingCardDate}>12 Oct - 20 Oct 2023</Text>
                <View style={styles.upcomingBadge}>
                  <Text style={styles.upcomingBadgeText}>UPCOMING</Text>
                </View>
              </View>
            </View>

            <View style={[styles.upcomingCard, Shadows.sm]}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80' }} 
                style={styles.upcomingCardImg}
              />
              <View style={styles.upcomingCardBody}>
                <Text style={styles.upcomingCardTitle}>Goa Beach Party</Text>
                <Text style={styles.upcomingCardDate}>15 Dec - 22 Dec 2023</Text>
                <View style={styles.upcomingBadge}>
                  <Text style={styles.upcomingBadgeText}>UPCOMING</Text>
                </View>
              </View>
            </View>
            
            <View style={[styles.upcomingCard, Shadows.sm]}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80' }} 
                style={styles.upcomingCardImg}
              />
              <View style={styles.upcomingCardBody}>
                <Text style={styles.upcomingCardTitle}>Paris Getaway</Text>
                <Text style={styles.upcomingCardDate}>05 Jan - 12 Jan 2024</Text>
                <View style={styles.upcomingBadge}>
                  <Text style={styles.upcomingBadgeText}>UPCOMING</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.neutral.pageBackground,
  },
  header: {
    height: Spacing.headerHeight,
    backgroundColor: Colors.neutral.headerBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenPaddingH,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.neutral.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary.main,
    fontFamily: fonts.bold,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E53935',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  profileBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: Colors.neutral.border,
  },
  profileImg: {
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenPaddingH,
    paddingVertical: 18,
    backgroundColor: Colors.neutral.cardBackground,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.neutral.border,
  },
  quickActionItem: {
    alignItems: 'center',
    width: '22%',
  },
  quickActionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    position: 'relative',
    borderWidth: 0.5,
    borderColor: Colors.neutral.border,
  },
  quickActionBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#D94040',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingHorizontal: 2,
  },
  quickActionBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '700',
    fontFamily: fonts.bold,
  },
  quickActionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.neutral.textSecondary,
    fontFamily: fonts.semiBold,
    textAlign: 'center',
  },
  heroWrapper: {
    paddingHorizontal: Spacing.screenPaddingH,
    marginTop: 20,
  },
  heroCard: {
    height: 240,
    borderRadius: Spacing.cardRadius,
    overflow: 'hidden',
    position: 'relative',
  },
  heroCardContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  ongoingBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  ongoingBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: fonts.bold,
    letterSpacing: 1.2,
  },
  heroTripTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    fontFamily: fonts.bold,
    marginBottom: 4,
  },
  heroDayBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  heroDayText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: fonts.semiBold,
  },
  heroDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    width: '100%',
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
    fontFamily: fonts.bold,
  },
  heroArrowBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upcomingSection: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenPaddingH,
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.neutral.textPrimary,
    fontFamily: fonts.bold,
  },
  seeAllText: {
    color: Colors.primary.medium,
    fontWeight: '600',
    fontSize: 14,
    fontFamily: fonts.semiBold,
  },
  upcomingScrollView: {
    width: '100%',
  },
  upcomingScrollContent: {
    paddingHorizontal: Spacing.screenPaddingH,
    paddingBottom: 16,
  },
  upcomingCard: {
    width: 256,
    backgroundColor: Colors.neutral.cardBackground,
    borderRadius: Spacing.cardRadius,
    overflow: 'hidden',
    marginRight: 16,
    borderWidth: 0.5,
    borderColor: Colors.neutral.border,
  },
  upcomingCardImg: {
    width: '100%',
    height: 130,
  },
  upcomingCardBody: {
    padding: 14,
  },
  upcomingCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.neutral.textPrimary,
    fontFamily: fonts.bold,
    marginBottom: 4,
  },
  upcomingCardDate: {
    fontSize: 12,
    color: Colors.neutral.textMuted,
    fontFamily: fonts.regular,
    marginBottom: 10,
  },
  upcomingBadge: {
    backgroundColor: Colors.info.lightBg,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  upcomingBadgeText: {
    color: Colors.info.text,
    fontSize: 9,
    fontWeight: '700',
    fontFamily: fonts.bold,
    letterSpacing: 1,
  },
});
