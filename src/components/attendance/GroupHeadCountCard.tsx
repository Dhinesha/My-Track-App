import { View, Text } from 'react-native';
import { fonts, textStyles } from '../../constants/theme';
import { Svg, Circle } from 'react-native-svg';
import { useEffect, useState } from 'react';
import { usePowerSync } from '@powersync/react-native';
import { useTripStore } from '../../store/tripStore';
import { useAuthStore } from '../../store/authStore';

export function GroupHeadCountCard() {
  const [checked, setChecked] = useState(0);
  const [total, setTotal] = useState(0);
  const [familyChecked, setFamilyChecked] = useState(0);
  const [familyTotal, setFamilyTotal] = useState(0);
  const db = usePowerSync();
  const { activeTripId } = useTripStore();
  const { user } = useAuthStore();

  const load = async () => {
    if (!activeTripId || !user?.id) return;

    const paxRows = await db.getAll(`SELECT id FROM pax WHERE user_id=? AND trip_id=?`, [user.id, activeTripId]) as any[];
    const pax = paxRows[0];
    if (!pax) return;
    
    const pvRows = await db.getAll(`SELECT vehicle_id FROM pax_vehicles WHERE pax_id=?`, [pax.id]) as any[];
    const pv = pvRows[0];
    if (!pv) return;

    const totalRows = await db.getAll(`SELECT COUNT(*) as cnt FROM pax_vehicles WHERE vehicle_id=?`, [pv.vehicle_id]) as any[];
    const checkedRows = await db.getAll(
      `SELECT COUNT(*) as cnt FROM attendance a JOIN pax_vehicles pv ON pv.pax_id=a.pax_id WHERE pv.vehicle_id=? AND a.trip_id=?`,
      [pv.vehicle_id, activeTripId]
    ) as any[];
    
    setTotal(totalRows[0]?.cnt ?? 0); 
    setChecked(checkedRows[0]?.cnt ?? 0);

    const family = await db.getAll(`SELECT id FROM pax WHERE primary_id=? AND trip_id=?`, [pax.id, activeTripId]) as any[];
    if (family.length > 0) {
        const fc = await db.getAll(
          `SELECT COUNT(*) as cnt FROM attendance WHERE trip_id=? AND pax_id IN (${family.map(() => '?').join(',')})`,
          [activeTripId, ...family.map((f: any) => f.id)]
        ) as any[];
        setFamilyTotal(family.length + 1);
        setFamilyChecked((fc[0]?.cnt ?? 0) + 1);
    } else {
        // Just self
        const sc = await db.getAll(`SELECT COUNT(*) as cnt FROM attendance WHERE trip_id=? AND pax_id=?`, [activeTripId, pax.id]) as any[];
        setFamilyTotal(1);
        setFamilyChecked(sc[0]?.cnt ?? 0);
    }
  };

  useEffect(() => { 
    load(); 
  }, [activeTripId, user?.id]);

  const pct = total > 0 ? checked / total : 0;
  const R = 44; 
  const C = 2 * Math.PI * R;
  const remaining = total - checked;
  const statusText = remaining === 0 ? 'All aboard! ✓' : remaining === 1 ? 'Almost there — 1 person remaining!' : `${remaining} people still checking in`;
  const familyDone = familyChecked >= familyTotal;

  return (
    <View className="bg-white border border-gray-100 rounded-xl p-4 items-center gap-3 my-2 shadow-sm">
      <Text className="text-xs font-semibold text-gray-400 uppercase tracking-wide self-start">Vehicle Check-ins</Text>
      <View className="items-center justify-center">
        <Svg width={110} height={110}>
          <Circle cx={55} cy={55} r={R} stroke="#F3F4F6" strokeWidth={8} fill="none" />
          <Circle cx={55} cy={55} r={R} stroke="#2B8CEE" strokeWidth={8} fill="none"
            strokeDasharray={`${C}`} strokeDashoffset={`${C * (1 - pct)}`}
            strokeLinecap="round" transform="rotate(-90 55 55)" />
        </Svg>
        <View className="absolute items-center">
          <Text className="text-2xl text-gray-900" style={{ fontFamily: fonts.extraBold, fontSize: 28 }}>{checked}</Text>
          <Text className="text-xs text-gray-400" style={{ fontFamily: fonts.regular, fontSize: 13 }}>of {total}</Text>
        </View>
      </View>
      <Text className={`text-sm ${remaining === 0 ? 'text-green-700' : 'text-gray-600'}`} style={{ fontFamily: fonts.semiBold, fontSize: 14 }}>{statusText}</Text>
      <View className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border
        ${familyDone ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
        <Text className={`text-xs ${familyDone ? 'text-green-700' : 'text-amber-700'}`} style={{ fontFamily: fonts.semiBold, fontSize: 12 }}>
          Your family: {familyChecked}/{familyTotal} {familyDone ? '✓' : ''}
        </Text>
      </View>
    </View>
  );
}
