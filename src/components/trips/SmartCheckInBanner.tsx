import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { usePowerSync } from '@powersync/react-native';
import { useTripStore } from '../../store/tripStore';
import { useAuthStore } from '../../store/authStore';
import { differenceInMinutes, parseISO, differenceInDays } from 'date-fns';

type BannerType = 'urgent' | 'warning' | 'family' | 'missed' | null;

export function SmartCheckInBanner() {
  const [bannerType, setBannerType] = useState<BannerType>(null);
  const [minsLeft, setMinsLeft] = useState(0);
  const [familyCount, setFamilyCount] = useState(0);
  const navigation = useNavigation<any>();
  const db = usePowerSync();
  const { activeTripId } = useTripStore();
  const { user } = useAuthStore();

  useEffect(() => {
    (async () => {
      if (!activeTripId || !user?.id) return;
      
      const now = new Date();
      const rows = await db.getAll(`SELECT start_date FROM trips WHERE id=?`, [activeTripId]);
      const trip = rows[0];
      if (!trip) return;
      const dayNum = differenceInDays(now, parseISO(trip.start_date)) + 1;

      // Get today's departure time (first activity)
      const activities = await db.getAll(
        `SELECT start_time FROM itinerary WHERE trip_id=? AND day=? ORDER BY start_time LIMIT 1`,
        [activeTripId, dayNum]
      );
      const act = activities[0];
      if (!act) return;

      const [h, m] = act.start_time.split(':').map(Number);
      const departure = new Date(); 
      departure.setHours(h, m, 0);
      const mins = differenceInMinutes(departure, now);

      // Check own attendance
      const paxRows = await db.getAll(`SELECT id FROM pax WHERE user_id=? AND trip_id=?`, [user.id, activeTripId]);
      const pax = paxRows[0];
      if (!pax) return;
      
      const attRows = await db.getAll(`SELECT id FROM attendance WHERE pax_id=? AND trip_id=?`, [pax.id, activeTripId]);
      const att = attRows[0];

      if (att) {
        // Check family
        const family = await db.getAll(
          `SELECT p.id FROM pax p WHERE p.primary_id=? AND p.trip_id=?`, [pax.id, activeTripId]
        );
        
        if (family.length > 0) {
            const checkedFamily = await db.getAll(
              `SELECT a.pax_id FROM attendance a WHERE a.trip_id=? AND a.pax_id IN (${family.map(() => '?').join(',')})`,
              [activeTripId, ...family.map((f: any) => f.id)]
            );
            const missing = family.length - checkedFamily.length;
            if (missing > 0 && mins > 0 && mins < 60) {
              setFamilyCount(missing); 
              setBannerType('family'); 
              return;
            }
        }
        setBannerType(null); 
        return;
      }

      if (mins < 0) { setBannerType('missed'); return; }
      if (mins <= 15) { setMinsLeft(mins); setBannerType('urgent'); return; }
      if (mins <= 60) { setMinsLeft(mins); setBannerType('warning'); return; }
      setBannerType(null);
    })();
  }, [activeTripId, user?.id]);

  if (!bannerType) return null;

  const configMap: Record<string, any> = {
    urgent:  { bg: 'bg-[#FFFBEB] border-[#FEF3C7]', text: 'text-[#92400E]', msg: `⚠️ Bus departs in ${minsLeft} min — please check in immediately`, btn: true },
    warning: { bg: 'bg-[#FFFBEB] border-[#FEF3C7]', text: 'text-[#92400E]', msg: `Bus departs in ${minsLeft} min — check in now to confirm your seat`, btn: true },
    family:  { bg: 'bg-[#FFFBEB] border-[#FEF3C7]', text: 'text-[#92400E]', msg: `${familyCount} family member${familyCount > 1 ? 's' : ''} still not checked in — do it now before departure`, btn: true },
    missed:  { bg: 'bg-gray-50 border-gray-300',  text: 'text-gray-600', msg: `You didn't check in for today's departure. Contact your organiser.`, btn: false },
  };
  
  const configs = configMap[bannerType];

  return (
    <View className={`border-2 rounded-[24px] px-5 py-4 flex-row items-center gap-4 my-2 shadow-sm ${configs.bg}`}>
      <View className="w-10 h-10 bg-white/50 rounded-full items-center justify-center">
        <MaterialCommunityIcons name="bus" size={24} color="#92400E" />
      </View>
      <Text className={`flex-1 text-[13px] font-jakarta-medium leading-5 ${configs.text}`}>{configs.msg}</Text>
      {configs.btn && (
        <TouchableOpacity
          onPress={() => navigation.navigate('VehicleAttendance')}
          className="bg-[#0F6E56] px-4 py-2.5 rounded-xl shadow-md"
        >
          <Text className="text-white text-xs font-jakarta-bold">Check In</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
