import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Share, ImageBackground } from 'react-native';
import { usePowerSync } from '@powersync/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { differenceInDays, parseISO } from 'date-fns';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Props { 
  tripId: string; 
  tripName: string; 
  startDate: string; 
  endDate: string; 
  paxId: string; 
}

export function TripMemoriesCard({ tripId, tripName, startDate, endDate, paxId }: Props) {
  const [stats, setStats] = useState<any>(null);
  const [visible, setVisible] = useState(false);
  const db = usePowerSync();

  useEffect(() => {
    (async () => {
      // Check if trip is actually completed before showing memories
      const now = new Date();
      const end = parseISO(endDate);
      if (now < end) return;

      const seen = await AsyncStorage.getItem(`memories_seen_${tripId}`);
      if (seen) return;
      
      setVisible(true);
      // We'll keep it visible for now, but usually we mark as seen
      // await AsyncStorage.setItem(`memories_seen_${tripId}`, 'true');

      const placesRows = await db.getAll(`SELECT COUNT(*) as cnt FROM itinerary WHERE trip_id=?`, [tripId]) as any[];
      const checkinsRows = await db.getAll(`SELECT COUNT(*) as cnt FROM attendance WHERE pax_id=?`, [paxId]) as any[];
      const hotelsRows = await db.getAll(`SELECT COUNT(DISTINCT hotel_id) as cnt FROM hotel_checkins WHERE pax_id=?`, [paxId]) as any[];
      const notifsRows = await db.getAll(`SELECT COUNT(*) as cnt FROM notifications WHERE trip_id=?`, [tripId]) as any[];
      
      const days = differenceInDays(parseISO(endDate), parseISO(startDate)) + 1;

      setStats({
        places: placesRows[0]?.cnt ?? 0, 
        days,
        checkins: checkinsRows[0]?.cnt ?? 0,
        hotels: hotelsRows[0]?.cnt ?? 0,
        notifs: notifsRows[0]?.cnt ?? 0,
      });
    })();
  }, [tripId, endDate]);

  if (!visible || !stats) return null;

  const shareText = `I just completed my ${tripName} with MyTripGuide!\n${stats.days} days • ${stats.places} places • ${stats.checkins} departures on time`;

  const handleShare = async () => {
    try {
      await Share.share({ message: shareText });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  return (
    <View className="bg-[#0F766E] rounded-[32px] overflow-hidden shadow-2xl shadow-[#0F766E]/30 mb-8 mt-4">
      <View className="px-6 pt-8 pb-5">
        <View className="w-12 h-12 bg-white/20 rounded-2xl items-center justify-center mb-4">
          <MaterialCommunityIcons name="medal-outline" size={28} color="white" />
        </View>
        <Text className="text-white text-2xl font-jakarta-extrabold leading-tight">Journey Completed</Text>
        <Text className="text-teal-200 font-jakarta-bold text-sm mt-1 uppercase tracking-widest">{tripName}</Text>
      </View>

      <View className="bg-white/10 mx-6 mb-2 h-[1px]" />

      <View className="px-6 py-6 gap-4">
        {[
          { icon: 'map-marker-radius', label: 'Places visited', val: stats.places, color: '#2DD4BF' },
          { icon: 'calendar-range', label: 'Days on the road', val: stats.days, color: '#38BDF8' },
          { icon: 'check-decagram', label: 'Departures on time', val: stats.checkins, color: '#34D399' },
          { icon: 'office-building-marker', label: 'Hotels stayed', val: stats.hotels, color: '#FB923C' },
          { icon: 'bell-ring', label: 'Messages received', val: stats.notifs, color: '#F472B6' },
        ].map((s, i) => (
          <View key={i} className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <MaterialCommunityIcons name={s.icon as any} size={20} color={s.color} />
              <Text className="text-white/80 font-jakarta-bold text-sm ml-3">{s.label}</Text>
            </View>
            <Text className="text-white font-jakarta-extrabold text-lg">{s.val}</Text>
          </View>
        ))}
      </View>

      <View className="px-6 pb-8 pt-2">
        <TouchableOpacity 
          onPress={handleShare}
          activeOpacity={0.8}
          className="bg-white rounded-2xl py-4 items-center justify-center shadow-lg"
        >
          <View className="flex-row items-center gap-2">
            <Feather name="share-2" size={18} color="#0F766E" />
            <Text className="text-[#0F766E] font-jakarta-extrabold text-[15px]">Share Your Journey</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => setVisible(false)}
          className="mt-4 self-center"
        >
          <Text className="text-teal-200/50 font-jakarta-bold text-[10px] uppercase tracking-[2px]">Dismiss Recap</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

