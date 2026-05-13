import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { usePowerSync } from '@powersync/react-native';
import { useTripStore } from '../../store/tripStore';
import { differenceInDays, parseISO, format } from 'date-fns';

export function TodaySummaryCard() {
  const [expanded, setExpanded] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const heightAnim = useRef(new Animated.Value(0)).current;
  const db = usePowerSync();
  const { activeTripId } = useTripStore();

  useEffect(() => {
    (async () => {
      if (!activeTripId) return;
      
      const rows = await db.getAll(`SELECT start_date FROM trips WHERE id=?`, [activeTripId]);
      const trip = rows[0];
      if (!trip) return;
      const dayNum = differenceInDays(new Date(), parseISO(trip.start_date)) + 1;
      const activities = await db.getAll(
        `SELECT place_name, start_time, entry_fee_type, entry_fee_amount, day_note FROM itinerary
         WHERE trip_id=? AND day=? ORDER BY start_time`,
        [activeTripId, dayNum]
      );
      
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
        d.setHours(h, m);
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
    outputRange: [0, 200] 
  });

  if (!summary) return null;

  return (
    <View className="bg-amber-50 border border-amber-200 rounded-xl overflow-hidden mx-4 my-2">
      <TouchableOpacity onPress={toggle} className="flex-row items-center justify-between px-4 py-3">
        <Text className="text-sm font-semibold text-amber-800">☀️ Today at a glance</Text>
        <Text className="text-amber-600 text-sm">{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      <Animated.View style={{ maxHeight }} className="px-4 pb-3 gap-1.5">
        <Text className="text-sm text-gray-700">📍 Destinations today: <Text className="font-semibold">{summary.count} places</Text></Text>
        {summary.firstName && (
          <Text className="text-sm text-gray-700">⏰ Day starts at <Text className="font-semibold">{summary.firstTime}</Text> — {summary.firstName}</Text>
        )}
        <Text className="text-sm text-gray-700">💰 Entry fees: <Text className="font-semibold">{summary.selfCount} self-paid{summary.totalFee ? ` (₹${summary.totalFee} est.)` : ''}</Text></Text>
        {summary.note && (
          <Text className="text-sm text-gray-700">📌 <Text className="italic">{summary.note}</Text></Text>
        )}
      </Animated.View>
    </View>
  );
}
