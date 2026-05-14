import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
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
    <View className="bg-[#FFFBEB] border border-[#FEF3C7] rounded-[32px] overflow-hidden shadow-sm">
      <TouchableOpacity onPress={toggle} className="flex-row items-center justify-between px-6 py-5">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 bg-[#FEF3C7] rounded-xl items-center justify-center">
            <MaterialCommunityIcons name="weather-sunny" size={24} color="#92400E" />
          </View>
          <Text className="text-[15px] font-jakarta-extrabold text-[#92400E]">Today at a glance</Text>
        </View>
        <Feather name={expanded ? "chevron-up" : "chevron-down"} size={24} color="#92400E" />
      </TouchableOpacity>
      
      <Animated.View style={{ maxHeight }} className="px-6 pb-6 gap-3">
        <View className="h-[1px] bg-[#FEF3C7] w-full mb-1" />
        <Text className="text-sm text-[#92400E]/80 font-jakarta-medium">📍 Destinations today: <Text className="font-jakarta-extrabold text-[#92400E]">{summary.count} places</Text></Text>
        {summary.firstName && (
          <Text className="text-sm text-[#92400E]/80 font-jakarta-medium">⏰ Day starts at <Text className="font-jakarta-extrabold text-[#92400E]">{summary.firstTime}</Text> — {summary.firstName}</Text>
        )}
        <Text className="text-sm text-[#92400E]/80 font-jakarta-medium">💰 Entry fees: <Text className="font-jakarta-extrabold text-[#92400E]">{summary.selfCount} self-paid{summary.totalFee ? ` (₹${summary.totalFee} est.)` : ''}</Text></Text>
        {summary.note && (
          <View className="bg-white/50 p-3 rounded-2xl mt-1">
            <Text className="text-sm text-[#92400E] font-jakarta-medium italic">📌 {summary.note}</Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
}
