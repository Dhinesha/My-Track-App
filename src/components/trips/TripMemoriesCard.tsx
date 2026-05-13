import { View, Text, TouchableOpacity, Share } from 'react-native';
import { useEffect, useState } from 'react';
import { usePowerSync } from '@powersync/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { differenceInDays, parseISO } from 'date-fns';

interface Props { tripId: string; tripName: string; startDate: string; endDate: string; paxId: string; }

export function TripMemoriesCard({ tripId, tripName, startDate, endDate, paxId }: Props) {
  const [stats, setStats] = useState<any>(null);
  const [visible, setVisible] = useState(false);
  const db = usePowerSync();

  useEffect(() => {
    (async () => {
      const seen = await AsyncStorage.getItem(`memories_seen_${tripId}`);
      if (seen) return;
      setVisible(true);
      await AsyncStorage.setItem(`memories_seen_${tripId}`, 'true');

      const placesRows = await db.getAll(`SELECT COUNT(*) as cnt FROM itinerary WHERE trip_id=?`, [tripId]);
      const checkinsRows = await db.getAll(`SELECT COUNT(*) as cnt FROM attendance WHERE pax_id=?`, [paxId]);
      // Assuming hotel_checkins table exists based on snippet
      const hotelsRows = await db.getAll(`SELECT COUNT(DISTINCT hotel_id) as cnt FROM hotel_checkins WHERE pax_id=?`, [paxId]);
      const notifsRows = await db.getAll(`SELECT COUNT(*) as cnt FROM notifications WHERE trip_id=?`, [tripId]);
      const days = differenceInDays(parseISO(endDate), parseISO(startDate)) + 1;

      setStats({
        places: placesRows[0]?.cnt ?? 0, 
        days,
        checkins: checkinsRows[0]?.cnt ?? 0,
        hotels: hotelsRows[0]?.cnt ?? 0,
        notifs: notifsRows[0]?.cnt ?? 0,
      });
    })();
  }, [tripId, paxId]);

  if (!visible || !stats) return null;

  const shareText = `I just completed my ${tripName} with MyTripGuide! 🎉\n${stats.days} days • ${stats.places} places • ${stats.checkins} departures on time 🙏`;

  return (
    <View className="bg-teal-600 rounded-2xl overflow-hidden mx-4 my-4">
      <View className="px-5 pt-5 pb-3">
        <Text className="text-white text-xl font-bold">Your Journey is Complete 🎉</Text>
        <Text className="text-teal-200 text-sm mt-1">{tripName}</Text>
      </View>
      <View className="bg-white mx-3 mb-3 rounded-xl p-4 gap-2">
        {[
          { icon: '🗺️', label: 'Places visited', val: stats.places },
          { icon: '📅', label: 'Days on the road', val: stats.days },
          { icon: '✅', label: 'Departures on time', val: `${stats.checkins}` },
          { icon: '🏨', label: 'Hotels stayed', val: stats.hotels },
          { icon: '🔔', label: 'Messages received', val: stats.notifs },
        ].map((s, i) => (
          <View key={i} className="flex-row items-center justify-between">
            <Text className="text-sm text-gray-600">{s.icon} {s.label}</Text>
            <Text className="text-sm font-bold text-gray-900">{s.val}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity onPress={() => Share.share({ message: shareText })}
        className="mx-3 mb-4 bg-white/20 rounded-xl py-3 items-center">
        <Text className="text-white font-semibold text-sm">Share your journey 🌟</Text>
      </TouchableOpacity>
    </View>
  );
}
