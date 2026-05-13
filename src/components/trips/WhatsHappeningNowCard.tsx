import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { usePowerSync } from '@powersync/react-native';
import { useTripStore } from '../../store/tripStore';
import { useAuthStore } from '../../store/authStore';
import { differenceInDays, parseISO, format } from 'date-fns';

interface Activity {
  place_name: string; start_time: string;
  duration_mins: number; status: string;
}

export function WhatsHappeningNowCard() {
  const db = usePowerSync();
  const { activeTripId } = useTripStore();
  const [message, setMessage] = useState('');
  const [icon, setIcon] = useState('⚡');

  const compute = async () => {
    if (!activeTripId) return;
    
    const now = new Date();
    const nowMins = now.getHours() * 60 + now.getMinutes();

    const rows = await db.getAll(`SELECT start_date FROM trips WHERE id=?`, [activeTripId]);
    const trip = rows[0];
    if (!trip) return;

    const dayNum = differenceInDays(now, parseISO(trip.start_date)) + 1;
    if (dayNum < 1) {
      const daysLeft = Math.abs(dayNum) + 1;
      setIcon('🗓️'); setMessage(`Trip begins in ${daysLeft} day${daysLeft !== 1 ? 's' : ''} — check your itinerary to prepare`);
      return;
    }

    const activities: Activity[] = await db.getAll(
      `SELECT place_name, start_time, duration_mins, status FROM itinerary
       WHERE trip_id=? AND day=? ORDER BY start_time`,
      [activeTripId, dayNum]
    );
    if (!activities.length) { setIcon('☀️'); setMessage('No activities scheduled today'); return; }

    // Check if any is delayed
    const delayed = activities.find((a) => a.status === 'delayed');
    if (delayed) { setIcon('⚠️'); setMessage(`Delayed — Organiser updated departure time`); return; }

    // Find in-progress
    const inProgress = activities.find((a) => {
      const [h, m] = a.start_time.split(':').map(Number);
      const startMins = h * 60 + m;
      return nowMins >= startMins && nowMins < startMins + (a.duration_mins ?? 60);
    });
    if (inProgress) { setIcon('📍'); setMessage(`Now at ${inProgress.place_name} — expected stay: ${Math.round((inProgress.duration_mins ?? 60) / 60)} hr`); return; }

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
      setIcon('🕐'); setMessage(`Next activity at ${timeStr} — ${next.place_name}`);
      return;
    }

    // All done for today
    const tomorrow = activities[0]?.start_time ?? '7:00';
    setIcon('🌙'); setMessage(`Today's schedule complete. Tomorrow starts at ${tomorrow}`);
  };

  useEffect(() => {
    compute();
    const t = setInterval(compute, 60_000);
    return () => clearInterval(t);
  }, [activeTripId]);

  if (!message) return null;

  return (
    <View className="bg-white border border-gray-100 border-l-4 border-l-teal-500 rounded-xl px-4 py-3 mx-4 my-2 flex-row gap-3 items-start">
      <Text className="text-xl mt-0.5">{icon}</Text>
      <View className="flex-1">
        <Text className="text-xs font-semibold text-teal-700 uppercase tracking-wide mb-0.5">Right Now</Text>
        <Text className="text-sm text-gray-800 leading-5">{message}</Text>
      </View>
    </View>
  );
}
