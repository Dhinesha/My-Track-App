import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { usePowerSync } from '@powersync/react-native';
import { useEffect, useState } from 'react';
import { useTripStore } from '../../store/tripStore';
import { useAuthStore } from '../../store/authStore';

interface Props { isSelfCheckedIn: boolean; }

export function QuickActionsRow({ isSelfCheckedIn }: Props) {
  const navigation = useNavigation<any>();
  const db = usePowerSync();
  const { activeTripId } = useTripStore();
  const { user } = useAuthStore();
  const [driverPhone, setDriverPhone] = useState<string | null>(null);

  useEffect(() => {
    if (!activeTripId || !user?.id) return;
    
    db.getAll(
      `SELECT v.driver_phone FROM vehicles v
       JOIN pax_vehicles pv ON pv.vehicle_id = v.id
       JOIN pax p ON p.id = pv.pax_id
       WHERE p.user_id = ? AND v.trip_id = ? LIMIT 1`,
      [user?.id, activeTripId]
    ).then((rows: any[]) => {
      if (rows && rows.length > 0) {
        setDriverPhone(rows[0]?.driver_phone ?? null);
      }
    }).catch(err => console.error("Error fetching driver phone:", err));
  }, [activeTripId, user?.id]);

  const actions = [
    {
      icon: isSelfCheckedIn ? '✓' : '🚌',
      label: isSelfCheckedIn ? 'Checked In' : 'Check In',
      color: isSelfCheckedIn ? 'bg-green-100' : 'bg-teal-50',
      textColor: isSelfCheckedIn ? 'text-green-700' : 'text-teal-700',
      onPress: () => navigation.navigate('VehicleAttendance'),
    },
    {
      icon: '📅',
      label: 'View Today',
      color: 'bg-blue-50',
      textColor: 'text-blue-700',
      onPress: () => navigation.navigate('Itinerary', { scrollToToday: true }),
    },
    {
      icon: '📞',
      label: 'Call Driver',
      color: driverPhone ? 'bg-orange-50' : 'bg-gray-50',
      textColor: driverPhone ? 'text-orange-700' : 'text-gray-400',
      onPress: () => driverPhone && Linking.openURL(`tel:${driverPhone}`),
    },
  ];

  return (
    <View className="flex-row gap-3 justify-between px-4 my-3">
      {actions.map((a, i) => (
        <TouchableOpacity
          key={i} onPress={a.onPress}
          className={`flex-1 items-center gap-1.5 py-3 rounded-2xl ${a.color}`}
        >
          <Text className="text-2xl">{a.icon}</Text>
          <Text className={`text-xs font-semibold ${a.textColor}`}>{a.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
