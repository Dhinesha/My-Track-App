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
      icon: <MaterialIcons name="check-circle" size={28} color="#10B981" />,
      label: 'Checked In',
      color: 'bg-[#F0FDF4]',
      textColor: 'text-[#065F46]',
      onPress: () => navigation.navigate('VehicleAttendance'),
    },
    {
      icon: <MaterialCommunityIcons name="calendar-month" size={28} color="#0EA5E9" />,
      label: 'View Today',
      color: 'bg-[#F0F9FF]',
      textColor: 'text-[#0369A1]',
      onPress: () => navigation.navigate('Itinerary', { scrollToToday: true }),
    },
    {
      icon: <MaterialIcons name="call" size={28} color="#F59E0B" />,
      label: 'Call Driver',
      color: 'bg-[#FFFBEB]',
      textColor: 'text-[#92400E]',
      onPress: () => Linking.openURL(`tel:${driverPhone || '+91 9876543210'}`),
    },
  ];

  return (
    <View className="flex-row gap-4 justify-between my-6">
      {actions.map((a, i) => (
        <TouchableOpacity
          key={i} onPress={a.onPress}
          activeOpacity={0.8}
          className={`flex-1 items-center justify-center py-6 rounded-[28px] shadow-sm border border-slate-50 ${a.color}`}
        >
          <View className="mb-2">{a.icon}</View>
          <Text className={`text-[12px] font-jakarta-extrabold ${a.textColor}`}>{a.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
