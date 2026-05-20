import { useEffect, useState } from "react";
import { usePowerSync } from "@powersync/react-native";
import { useTripStore } from "../store/tripStore";
import { differenceInDays, parseISO } from "date-fns";

export interface TransportLeg {
  id: string;
  trip_id: string;
  transport_type: "bus" | "flight" | "train" | "cab";
  trip_day: number;
  leg_order: number;
  departure_place: string;
  arrival_place: string;
  departure_time: string;
  arrival_time: string;

  // BUS
  driver_name?: string;
  driver_phone?: string;
  vehicle_number?: string;

  // FLIGHT
  airline_name?: string;
  flight_number?: string;
  terminal?: string;
  gate?: string;

  // TRAIN
  train_number?: string;
  train_name?: string;
  coach?: string;
  berth_type?: string;

  // CAB
  cab_company?: string;
  cab_type?: string;
  cab_number?: string;
  cab_driver_name?: string;
  cab_driver_phone?: string;
  cab_sharing?: number;

  // GENERAL
  pnr_number?: string;
}

export function useAttendance() {
  const db = usePowerSync();
  const { activeTripId } = useTripStore();
  const [allLegs, setAllLegs] = useState<TransportLeg[]>([]);
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [currentLeg, setCurrentLeg] = useState<TransportLeg | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!activeTripId) {
      setLoading(false);
      return;
    }

    const loadAttendanceData = async () => {
      try {
        // 1. Calculate currentDay from trip start_date
        const tripRows = (await db.getAll(
          "SELECT start_date FROM trips WHERE id = ? LIMIT 1",
          [activeTripId]
        )) as any[];

        let day = 1;
        if (tripRows && tripRows.length > 0) {
          const startDateStr = tripRows[0].start_date;
          if (startDateStr) {
            const start = parseISO(startDateStr);
            const diff = differenceInDays(new Date(), start);
            day = Math.max(1, diff + 1);
          }
        }
        setCurrentDay(day);

        // 2. Fetch all legs sorted by day and leg order
        const legRows = (await db.getAll(
          `SELECT * FROM vehicles 
           WHERE trip_id = ? 
           ORDER BY trip_day ASC, leg_order ASC`,
          [activeTripId]
        )) as TransportLeg[];

        setAllLegs(legRows);

        // 3. Derive currentLeg:
        // Find legs for the current day
        const dayLegs = legRows.filter((l) => l.trip_day === day);
        if (dayLegs.length > 0) {
          // Find the leg that is happening closest to now or fallback to the first leg of today
          const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
          const matchingLeg = dayLegs.find(l => l.departure_time >= nowStr);
          setCurrentLeg(matchingLeg || dayLegs[0]);
        } else if (legRows.length > 0) {
          // If no legs today, default to the first leg in the trip
          setCurrentLeg(legRows[0]);
        } else {
          setCurrentLeg(null);
        }
      } catch (error) {
        console.error("Error loading attendance transport data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAttendanceData();
  }, [activeTripId]);

  return {
    allLegs,
    currentDay,
    currentLeg,
    loading,
  };
}
