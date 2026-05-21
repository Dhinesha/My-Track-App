import { useEffect, useState, useCallback } from 'react';
import { usePowerSync } from '@powersync/react-native';
import { useAuthStore } from '@/store/authStore';
import { useTripStore } from '@/store/tripStore';
import type { FamilyMember, AttendanceStatus } from '@/types/attendance';

export function useFamilyAttendance(vehicleId: string) {
  const db = usePowerSync();
  const { user } = useAuthStore();
  const { activeTripId } = useTripStore();

  const [myPaxId, setMyPaxId] = useState<string | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // ✅ CORRECT — db NOT in dependency array (prevents infinite loop)
  const loadFamily = useCallback(async () => {
    if (!user?.id || !activeTripId || !vehicleId) return;
    setLoading(true);
    try {
      // Get own pax record
      const selfPaxRes = await db.getAll(
        `SELECT id FROM pax WHERE user_id = ? AND trip_id = ?`,
        [user.id, activeTripId]
      ).catch(() => []);
      if (!selfPaxRes || selfPaxRes.length === 0) return;
      const selfPax = selfPaxRes[0] as any;
      setMyPaxId(selfPax.id);

      // Get ALL family members:
      // PRIMARY: linked where primary_id = selfPax.id
      // SECONDARY: further dependents
      const rawMembers = await db.getAll(
        `SELECT
          p.id           AS paxId,
          p.name,
          p.phone,
          p.primary_id,
          pv.seat_number AS seatNumber,
          pv.berth_number AS berthNumber,
          pv.pnr_number  AS pnrNumber,
          pv.meal_preference AS meal,
          CASE WHEN p.primary_id IS NULL THEN 'PRIMARY' ELSE 'SECONDARY' END AS role,
          a.status       AS attendanceStatus,
          a.checked_in_at AS checkedInAt,
          a.via_rep      AS viaRep
        FROM pax p
        LEFT JOIN pax_vehicles pv
          ON pv.pax_id = p.id AND pv.vehicle_id = ?
        LEFT JOIN attendance a
          ON a.pax_id = p.id AND a.vehicle_id = ?
        WHERE (p.primary_id = ? OR p.id = ?) AND p.trip_id = ?
        ORDER BY
          CASE WHEN p.primary_id IS NULL THEN 0 ELSE 1 END,
          p.name ASC`,
        [vehicleId, vehicleId, selfPax.id, selfPax.id, activeTripId]
      ).catch(() => []);

      const members: FamilyMember[] = rawMembers.map((m: any) => {
        const status = (m.attendanceStatus || 'Not Boarded') as AttendanceStatus;
        return {
          paxId: m.paxId,
          name: m.name || "Family Member",
          phone: m.phone,
          role: m.role ?? 'SECONDARY',
          seatNumber: m.seatNumber || "",
          berthNumber: m.berthNumber || "",
          pnrNumber: m.pnrNumber || "",
          attendanceStatus: status,
          checkedInAt: m.checkedInAt || "",
          viaRep: m.viaRep === 1,
          primary_id: m.primary_id || "",
          meal: m.meal || "",
        };
      });

      setFamilyMembers(members);

      // ✅ Default: ALL members selected (checked) by default
      // Organiser unchecks absent members
      const allIds = new Set(
        members
          .filter((m) => m.attendanceStatus !== 'Absent')
          .map((m) => m.paxId)
      );
      setSelectedIds(allIds);
    } catch (e) {
      console.error('loadFamily error:', e);
    } finally {
      setLoading(false);
    }
  }, [activeTripId, vehicleId, user?.id]); // ✅ NO db here

  useEffect(() => {
    loadFamily();
  }, [loadFamily]);

  // Toggle one member selection
  const toggleSelect = useCallback((paxId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(paxId)) {
        next.delete(paxId);
      } else {
        next.add(paxId);
      }
      return next;
    });
  }, []);

  // Select all
  const selectAll = useCallback(() => {
    setSelectedIds(new Set(familyMembers.map((m) => m.paxId)));
  }, [familyMembers]);

  // Deselect all
  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // Check in selected members (present travelers)
  const checkInSelected = useCallback(async () => {
    const toCheckIn = [...selectedIds];
    const toMarkAbsent = familyMembers
      .filter((m) => !selectedIds.has(m.paxId))
      .map((m) => m.paxId);

    try {
      // Check in selected as "Checked In"
      for (const paxId of toCheckIn) {
        const isSelf = paxId === myPaxId;
        const viaRepVal = isSelf ? 0 : 1;

        await db.execute(
          `INSERT OR REPLACE INTO attendance
           (pax_id, vehicle_id, checked_in_at, status, via_rep)
           VALUES (?, ?, ?, 'Checked In', ?)`,
          [paxId, vehicleId, new Date().toISOString(), viaRepVal]
        );
      }

      // Mark unselected as "Absent"
      for (const paxId of toMarkAbsent) {
        await db.execute(
          `INSERT OR REPLACE INTO attendance
           (pax_id, vehicle_id, checked_in_at, status, via_rep)
           VALUES (?, ?, NULL, 'Absent', 0)`,
          [paxId, vehicleId]
        );
      }

      await loadFamily(); // Refresh
    } catch (e) {
      console.error('checkInSelected error:', e);
    }
  }, [selectedIds, familyMembers, vehicleId, loadFamily, myPaxId]);

  // Mark one member with specific status
  const updateMemberStatus = useCallback(
    async (paxId: string, status: AttendanceStatus) => {
      try {
        const isSelf = paxId === myPaxId;
        const viaRepVal = isSelf ? 0 : 1;

        await db.execute(
          `INSERT OR REPLACE INTO attendance
           (pax_id, vehicle_id, checked_in_at, status, via_rep)
           VALUES (?, ?, ?, ?, ?)`,
          [
            paxId,
            vehicleId,
            status === 'Checked In' ? new Date().toISOString() : null,
            status,
            status === 'Checked In' ? viaRepVal : 0,
          ]
        );
        await loadFamily();
      } catch (e) {
        console.error('updateMemberStatus error:', e);
      }
    },
    [vehicleId, loadFamily, myPaxId]
  );

  const primaryMembers = familyMembers.filter((m) => m.role === 'PRIMARY');
  const secondaryMembers = familyMembers.filter((m) => m.role === 'SECONDARY');
  const checkedCount = familyMembers.filter(
    (m) => m.attendanceStatus === 'Checked In'
  ).length;

  return {
    myPaxId,
    familyMembers,
    primaryMembers,
    secondaryMembers,
    selectedIds,
    loading,
    checkedCount,
    totalCount: familyMembers.length,
    toggleSelect,
    selectAll,
    deselectAll,
    checkInSelected,
    updateMemberStatus,
    refresh: loadFamily,
  };
}
