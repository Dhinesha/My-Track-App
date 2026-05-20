import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePowerSync } from '@powersync/react-native';
import { useTripStore } from '../../store/tripStore';
import { differenceInDays, parseISO, format } from 'date-fns';
import { Colors, Typography, Spacing, Shadows } from '../../constants/theme';

export function TodaySummaryCard() {
  const [expanded, setExpanded] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const heightAnim = useRef(new Animated.Value(0)).current;
  const db = usePowerSync();
  const { activeTripId } = useTripStore();

  useEffect(() => {
    (async () => {
      if (!activeTripId) return;
      
      const rows = await db.getAll(`SELECT start_date FROM trips WHERE id=?`, [activeTripId]) as any[];
      const trip = rows[0];
      if (!trip) return;
      
      const dayNum = differenceInDays(new Date(), parseISO(trip.start_date)) + 1;
      const activities = await db.getAll(
        `SELECT place_name, start_time, entry_fee_type, entry_fee_amount, day_note FROM itinerary
         WHERE trip_id=? AND day=? ORDER BY start_time`,
        [activeTripId, dayNum]
      ) as any[];
      
      if (activities.length === 0) {
        setSummary(null);
        return;
      }

      const selfPaid = activities.filter((a: any) => a.entry_fee_type === 'self');
      const totalFee = selfPaid.reduce((s: number, a: any) => s + (Number(a.entry_fee_amount) || 0), 0);
      const first = activities[0];
      
      let firstTimeStr = '';
      if (first) {
        const [h, m] = first.start_time.split(':').map(Number);
        const d = new Date();
        d.setHours(h, m, 0, 0);
        firstTimeStr = format(d, 'h:mm a');
      }

      setSummary({
        count: activities.length,
        firstTime: firstTimeStr,
        firstName: first?.place_name,
        selfCount: selfPaid.length,
        totalFee,
        note: activities.find((a: any) => a.day_note)?.day_note,
      });
    })();
  }, [activeTripId]);

  const toggle = () => {
    const toValue = expanded ? 0 : 1;
    setExpanded(!expanded);
    Animated.spring(heightAnim, { 
      toValue, 
      useNativeDriver: false 
    }).start();
  };

  const maxHeight = heightAnim.interpolate({ 
    inputRange: [0, 1], 
    outputRange: [0, 320] 
  });

  if (!summary) return null;

  return (
    <View style={[styles.card, Shadows.sm]}>
      <TouchableOpacity onPress={toggle} style={styles.headerRow} activeOpacity={0.8}>
        <View style={styles.headerLeft}>
          <Text style={styles.sunEmoji}>🌤</Text>
          <Text style={styles.headerTitle}>Today at a glance</Text>
        </View>
        <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={20} color={Colors.warning.main} />
      </TouchableOpacity>
      
      <Animated.View style={{ maxHeight, overflow: 'hidden' }}>
        <View style={styles.divider} />
        <View style={styles.content}>
          
          <View style={styles.row}>
            <Ionicons name="location-outline" size={18} color="#555555" />
            <Text style={styles.rowText}>
              Destinations: <Text style={styles.boldText}>{summary.count} places</Text>
            </Text>
          </View>

          {summary.firstName && (
            <View style={styles.row}>
              <Ionicons name="time-outline" size={18} color="#555555" />
              <Text style={styles.rowText}>
                Starts at <Text style={styles.boldText}>{summary.firstTime}</Text> — {summary.firstName}
              </Text>
            </View>
          )}

          <View style={styles.row}>
            <Ionicons name="ticket-outline" size={18} color="#555555" />
            <Text style={styles.rowText}>
              Entry fees: <Text style={styles.boldText}>{summary.selfCount} self-paid{summary.totalFee ? ` (₹${summary.totalFee} est.)` : ''}</Text>
            </Text>
          </View>

          {summary.note && (
            <View style={styles.noteCard}>
              <Ionicons name="pin" size={16} color={Colors.warning.main} style={styles.notePin} />
              <Text style={styles.noteText}>{summary.note}</Text>
            </View>
          )}
          
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FEF9F0',
    borderRadius: Spacing.cardRadius,
    borderWidth: 1,
    borderColor: '#F0D9A8',
    marginHorizontal: Spacing.screenPaddingH,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sunEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: Typography.fontSizes.cardTitle,
    fontWeight: '600',
    color: Colors.warning.textOnAmber,
    fontFamily: Typography.fontFamilies.semibold,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0D9A8',
    marginHorizontal: 16,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 12,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowText: {
    fontSize: 14,
    color: '#333333',
    fontFamily: Typography.fontFamilies.regular,
  },
  boldText: {
    fontWeight: '700',
    color: '#111111',
    fontFamily: Typography.fontFamilies.bold,
  },
  noteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 4,
  },
  notePin: {
    marginTop: 2,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    color: Colors.warning.textOnAmber,
    fontFamily: Typography.fontFamilies.regular,
    fontStyle: 'italic',
    lineHeight: 18,
  },
});
