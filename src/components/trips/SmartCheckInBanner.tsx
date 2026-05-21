import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { usePowerSync } from '@powersync/react-native';
import { useTripStore } from '../../store/tripStore';
import { useAuthStore } from '../../store/authStore';
import { differenceInMinutes, parseISO, differenceInDays } from 'date-fns';
import { Colors, Typography, Spacing, Shadows, fonts, textStyles } from '../../constants/theme';

type BannerType = 'urgent' | 'warning' | 'family' | 'missed' | null;

export function SmartCheckInBanner() {
  const [bannerType, setBannerType] = useState<BannerType>(null);
  const [minsLeft, setMinsLeft] = useState(0);
  const [familyCount, setFamilyCount] = useState(0);
  const navigation = useNavigation<any>();
  const db = usePowerSync();
  const { activeTripId } = useTripStore();
  const { user } = useAuthStore();

  useEffect(() => {
    (async () => {
      if (!activeTripId || !user?.id) return;
      
      const now = new Date();
      const rows = await db.getAll(`SELECT start_date FROM trips WHERE id=?`, [activeTripId]) as any[];
      const trip = rows[0];
      if (!trip) return;
      const dayNum = differenceInDays(now, parseISO(trip.start_date)) + 1;

      // Get today's departure time (first activity)
      const activities = await db.getAll(
        `SELECT start_time FROM itinerary WHERE trip_id=? AND day=? ORDER BY start_time LIMIT 1`,
        [activeTripId, dayNum]
      ) as any[];
      const act = activities[0];
      if (!act) return;

      const [h, m] = act.start_time.split(':').map(Number);
      const departure = new Date(); 
      departure.setHours(h, m, 0);
      const mins = differenceInMinutes(departure, now);

      // Check own attendance
      const paxRows = await db.getAll(`SELECT id FROM pax WHERE user_id=? AND trip_id=?`, [user.id, activeTripId]) as any[];
      const pax = paxRows[0];
      if (!pax) return;
      
      const attRows = await db.getAll(`SELECT id FROM attendance WHERE pax_id=? AND trip_id=?`, [pax.id, activeTripId]) as any[];
      const att = attRows[0];

      if (att) {
        // Check family
        const family = await db.getAll(
          `SELECT p.id FROM pax p WHERE p.primary_id=? AND p.trip_id=?`, [pax.id, activeTripId]
        ) as any[];
        
        if (family.length > 0) {
            const checkedFamily = await db.getAll(
              `SELECT a.pax_id FROM attendance a WHERE a.trip_id=? AND a.pax_id IN (${family.map(() => '?').join(',')})`,
              [activeTripId, ...family.map((f: any) => f.id)]
            ) as any[];
            const missing = family.length - checkedFamily.length;
            if (missing > 0 && mins > 0 && mins < 60) {
              setFamilyCount(missing); 
              setBannerType('family'); 
              return;
            }
        }
        setBannerType(null); 
        return;
      }

      if (mins < 0) { setBannerType('missed'); return; }
      if (mins <= 15) { setMinsLeft(mins); setBannerType('urgent'); return; }
      if (mins <= 60) { setMinsLeft(mins); setBannerType('warning'); return; }
      setBannerType(null);
    })();
  }, [activeTripId, user?.id]);

  if (!bannerType) return null;

  const handlePress = () => {
    navigation.navigate('VehicleAttendance');
  };

  const renderContent = () => {
    switch (bannerType) {
      case 'urgent':
        return (
          <Text style={styles.bannerText}>
            ⚠️ Bus departs in <Text style={styles.boldText}>{minsLeft} min</Text> — please <Text style={styles.boldText}>check in immediately</Text>
          </Text>
        );
      case 'warning':
        return (
          <Text style={styles.bannerText}>
            Bus departs in <Text style={styles.boldText}>{minsLeft} min</Text> — <Text style={styles.boldText}>check in now</Text> to confirm your seat
          </Text>
        );
      case 'family':
        return (
          <Text style={styles.bannerText}>
            <Text style={styles.boldText}>{familyCount} family member{familyCount > 1 ? 's' : ''}</Text> still not checked in — <Text style={styles.boldText}>do it now</Text> before departure
          </Text>
        );
      case 'missed':
        return (
          <Text style={[styles.bannerText, { color: Colors.neutral.textSecondary }]}>
            You didn't check in for today's departure. Contact your organiser.
          </Text>
        );
      default:
        return null;
    }
  };

  const isMissed = bannerType === 'missed';

  return (
    <View style={[
      styles.container,
      isMissed ? styles.missedContainer : styles.warningContainer,
      Shadows.sm
    ]}>
      <View style={styles.iconContainer}>
        <Ionicons name="bus" size={24} color={isMissed ? Colors.neutral.textSecondary : Colors.warning.main} />
      </View>
      <View style={styles.textContainer}>
        {renderContent()}
      </View>
      {!isMissed && (
        <TouchableOpacity
          onPress={handlePress}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Check In</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.screenPaddingH,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: Spacing.cardRadius,
  },
  warningContainer: {
    backgroundColor: Colors.warning.lightBg,
    borderWidth: 1.5,
    borderColor: Colors.warning.border,
  },
  missedContainer: {
    backgroundColor: Colors.neutral.pageBackground,
    borderWidth: 1.5,
    borderColor: Colors.neutral.border,
  },
  iconContainer: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    fontFamily: fonts.regular,},
  bannerText: {
    fontSize: Typography.fontSizes.body,
    color: Colors.warning.textOnAmber,
    fontFamily: fonts.regular,
    lineHeight: 20,
  },
  boldText: {
    fontWeight: '700',
    color: '#7A3F00',
    fontFamily: fonts.bold,
  },
  button: {
    backgroundColor: Colors.primary.main,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: fonts.semiBold,
  },
});
