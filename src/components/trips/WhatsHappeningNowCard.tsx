import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePowerSync } from '@powersync/react-native';
import { useTripStore } from '../../store/tripStore';
import { differenceInDays, parseISO, format } from 'date-fns';
import { Colors, Typography, Spacing, Shadows } from '../../constants/theme';

interface Activity {
  place_name: string; start_time: string;
  duration_mins: number; status: string;
}

type CardState = 
  | { type: 'before_trip'; daysLeft: number }
  | { type: 'no_activities' }
  | { type: 'delayed'; message: string }
  | { type: 'in_progress'; placeName: string; durationHrs: number }
  | { type: 'upcoming'; timeStr: string; placeName: string }
  | { type: 'complete'; tomorrowStart: string }
  | null;

export function WhatsHappeningNowCard() {
  const db = usePowerSync();
  const { activeTripId } = useTripStore();
  const [state, setState] = useState<CardState>(null);

  const compute = async () => {
    if (!activeTripId) return;
    
    const now = new Date();
    const nowMins = now.getHours() * 60 + now.getMinutes();

    const rows = await db.getAll(`SELECT start_date FROM trips WHERE id=?`, [activeTripId]) as any[];
    const trip = rows[0];
    if (!trip) return;

    const dayNum = differenceInDays(now, parseISO(trip.start_date)) + 1;
    if (dayNum < 1) {
      const daysLeft = Math.abs(dayNum) + 1;
      setState({ type: 'before_trip', daysLeft });
      return;
    }

    const activities: Activity[] = await db.getAll(
      `SELECT place_name, start_time, duration_mins, status FROM itinerary
       WHERE trip_id=? AND day=? ORDER BY start_time`,
      [activeTripId, dayNum]
    );
    if (!activities.length) {
      setState({ type: 'no_activities' });
      return;
    }

    // Check if any is delayed
    const delayed = activities.find((a) => a.status === 'delayed');
    if (delayed) {
      setState({ type: 'delayed', message: `Delayed — Organiser updated departure time` });
      return;
    }

    // Find in-progress
    const inProgress = activities.find((a) => {
      const [h, m] = a.start_time.split(':').map(Number);
      const startMins = h * 60 + m;
      return nowMins >= startMins && nowMins < startMins + (a.duration_mins ?? 60);
    });
    if (inProgress) { 
      setState({ 
        type: 'in_progress', 
        placeName: inProgress.place_name, 
        durationHrs: Math.round((inProgress.duration_mins ?? 60) / 60) 
      }); 
      return; 
    }

    // Find next upcoming
    const next = activities.find((a) => {
      const [h, m] = a.start_time.split(':').map(Number);
      return (h * 60 + m) > nowMins;
    });
    if (next) {
      const [h, m] = next.start_time.split(':').map(Number);
      const nextDate = new Date();
      nextDate.setHours(h, m);
      const timeStr = format(nextDate, 'h:mm a');
      setState({ type: 'upcoming', timeStr, placeName: next.place_name });
      return;
    }

    // All done for today
    const tomorrow = activities[0]?.start_time ?? '7:00';
    setState({ type: 'complete', tomorrowStart: tomorrow });
  };

  useEffect(() => {
    compute();
    const t = setInterval(compute, 60_000);
    return () => clearInterval(t);
  }, [activeTripId]);

  if (!state) return null;

  const getIconName = (): keyof typeof Ionicons.glyphMap => {
    switch (state.type) {
      case 'before_trip': return 'calendar-outline';
      case 'no_activities': return 'sunny-outline';
      case 'delayed': return 'alert-circle-outline';
      case 'in_progress': return 'location-outline';
      case 'upcoming': return 'time-outline';
      case 'complete': return 'moon-outline';
      default: return 'location-outline';
    }
  };

  const renderMessage = () => {
    switch (state.type) {
      case 'before_trip':
        return (
          <Text style={styles.bodyText}>
            Trip begins in <Text style={styles.boldText}>{state.daysLeft} day{state.daysLeft !== 1 ? 's' : ''}</Text> — check your itinerary to prepare
          </Text>
        );
      case 'no_activities':
        return (
          <Text style={styles.bodyText}>No activities scheduled today</Text>
        );
      case 'delayed':
        return (
          <Text style={[styles.bodyText, { color: Colors.urgent.main }]}>{state.message}</Text>
        );
      case 'in_progress':
        return (
          <Text style={styles.bodyText}>
            Now at <Text style={styles.boldText}>{state.placeName}</Text> — expected stay: <Text style={styles.semiboldText}>{state.durationHrs} hr</Text>
          </Text>
        );
      case 'upcoming':
        return (
          <Text style={styles.bodyText}>
            Next activity at <Text style={styles.semiboldText}>{state.timeStr}</Text> — {state.placeName}
          </Text>
        );
      case 'complete':
        return (
          <Text style={styles.bodyText}>
            Today's schedule complete. Tomorrow starts at <Text style={styles.semiboldText}>{state.tomorrowStart}</Text>
          </Text>
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.card, Shadows.sm]}>
      <View style={styles.iconCircle}>
        <Ionicons name={getIconName()} size={20} color={Colors.primary.main} />
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>RIGHT NOW</Text>
        {renderMessage()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.neutral.cardBackground,
    borderRadius: Spacing.cardRadius,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary.main,
    marginHorizontal: Spacing.screenPaddingH,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary.lightBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: Typography.fontSizes.sectionLabel,
    fontWeight: '700',
    color: Colors.primary.medium,
    fontFamily: Typography.fontFamilies.bold,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  bodyText: {
    fontSize: Typography.fontSizes.body,
    color: '#222222',
    fontFamily: Typography.fontFamilies.regular,
    lineHeight: 20,
  },
  boldText: {
    fontWeight: '700',
    color: Colors.neutral.textPrimary,
    fontFamily: Typography.fontFamilies.bold,
  },
  semiboldText: {
    fontWeight: '600',
    color: Colors.neutral.textPrimary,
    fontFamily: Typography.fontFamilies.semibold,
  },
});
