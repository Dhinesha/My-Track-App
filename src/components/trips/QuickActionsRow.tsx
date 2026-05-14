import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons, MaterialIcons, Feather } from '@expo/vector-icons';
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
      icon: <MaterialCommunityIcons name="bus-clock" size={26} color="#3B82F6" />,
      label: 'Check In',
      color: 'bg-[#EFF6FF]',
      textColor: 'text-[#3B82F6]',
      onPress: () => navigation.navigate('VehicleAttendance'),
    },
    {
      icon: <MaterialCommunityIcons name="calendar-month" size={26} color="#3B82F6" />,
      label: 'View Today',
      color: 'bg-[#EFF6FF]',
      textColor: 'text-[#3B82F6]',
      onPress: () => navigation.navigate('Itinerary', { scrollToToday: true }),
    },
    {
      icon: <MaterialIcons name="call" size={26} color="#F59E0B" />,
      label: 'Call Driver',
      color: 'bg-[#FFF7ED]',
      textColor: 'text-[#F59E0B]',
      onPress: () => driverPhone && Linking.openURL(`tel:${driverPhone}`),
    },
  ];

  return (
    <View className="flex-row gap-4 justify-between my-4">
      {actions.map((a, i) => (
        <TouchableOpacity
          key={i} onPress={a.onPress}
          activeOpacity={0.8}
          className={`flex-1 items-center gap-2.5 py-5 rounded-[24px] shadow-sm border border-slate-50 ${a.color}`}
        >
          <View className="mb-1">{a.icon}</View>
          <Text className={`text-[13px] font-jakarta-bold ${a.textColor}`}>{a.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
