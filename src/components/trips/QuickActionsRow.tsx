import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { usePowerSync } from '@powersync/react-native';
import { useEffect, useState } from 'react';
import { useTripStore } from '../../store/tripStore';
import { useAuthStore } from '../../store/authStore';
import { Colors, Typography, Spacing, Shadows } from '../../constants/theme';

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
      icon: <Ionicons name="checkmark-circle" size={28} color={Colors.success.checkIcon} />,
      label: 'Checked In',
      bg: Colors.success.lightBg,
      textColor: Colors.success.text,
      onPress: () => navigation.navigate('VehicleAttendance'),
    },
    {
      icon: <Ionicons name="calendar-outline" size={28} color={Colors.info.main} />,
      label: 'View Today',
      bg: Colors.info.lightBg,
      textColor: Colors.info.text,
      onPress: () => navigation.navigate('Itinerary', { scrollToToday: true }),
    },
    {
      icon: <Ionicons name="call-outline" size={28} color={Colors.warning.main} />,
      label: 'Call Driver',
      bg: Colors.warning.lightBg,
      textColor: Colors.warning.textOnAmber,
      onPress: () => Linking.openURL(`tel:${driverPhone || '+91 9876543210'}`),
    },
  ];

  return (
    <View style={styles.container}>
      {actions.map((a, i) => (
        <TouchableOpacity
          key={i} 
          onPress={a.onPress}
          activeOpacity={0.8}
          style={[styles.card, { backgroundColor: a.bg }, Shadows.sm]}
        >
          <View style={styles.iconContainer}>{a.icon}</View>
          <Text style={[styles.label, { color: a.textColor }]}>{a.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: Spacing.screenPaddingH,
    marginVertical: 16,
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    height: 90,
    borderRadius: Spacing.cardRadius,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Typography.fontFamilies.semibold,
    textAlign: 'center',
  },
});
