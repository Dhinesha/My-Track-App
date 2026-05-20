import { useEffect, useState } from "react";
import { usePowerSync } from "@powersync/react-native";
import { useTripStore } from "../store/tripStore";
import { differenceInDays, parseISO } from "date-fns";

export interface Hotel {
  id: string;
  trip_id: string;
  name: string;
  address: string;
  phone: string;
  image_url: string;
  stars: number;
  check_in_day: number;
  check_out_day: number;
  check_in_time: string;
  check_out_time: string;
  room_number?: string;
  room_type?: string;
  floor?: number;
}

export function useHotel() {
  const db = usePowerSync();
  const { activeTripId } = useTripStore();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [currentHotel, setCurrentHotel] = useState<Hotel | null>(null);
  const [transitionDay, setTransitionDay] = useState<boolean>(false);
  const [nextHotel, setNextHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!activeTripId) {
      setLoading(false);
      return;
    }

    const loadHotelData = async () => {
      try {
        // 1. Fetch trip start date to calculate currentDay dynamically
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

        // 2. Fetch all hotels sorted by check_in_day
        const hotelRows = (await db.getAll(
          `SELECT h.*, pr.room_number 
           FROM hotels h 
           LEFT JOIN pax_rooms pr ON pr.hotel_id = h.id 
           WHERE h.trip_id = ? 
           ORDER BY h.check_in_day ASC`,
          [activeTripId]
        )) as Hotel[];

        setHotels(hotelRows);

        // 3. Derive currentHotel, transitionDay, nextHotel
        // Find hotel active today: check_in_day <= day AND check_out_day >= day
        // Note: if checkout day is today, the traveller checks out of the current hotel and might check into a new one.
        // Usually checkout is morning and checkin is afternoon.
        // Let's check which hotel they are staying at tonight (which would be check_in_day <= day AND check_out_day > day)
        // Or if it's checkout day, they check out. Let's see: the user prompt logic says:
        // "Find hotel where check_in_day <= currentDay AND check_out_day >= currentDay"
        // Let's implement that exact query criteria:
        const active = hotelRows.find(
          (h) => day >= h.check_in_day && day < h.check_out_day
        ) || hotelRows.find((h) => day === h.check_out_day); // Fallback to checkout hotel if day matches exactly

        setCurrentHotel(active || null);

        // Check if there is no active hotel today (transition day)
        const hasActiveToday = hotelRows.some(
          (h) => day >= h.check_in_day && day <= h.check_out_day
        );
        setTransitionDay(!hasActiveToday && hotelRows.length > 0);

        // Find the next upcoming hotel
        const upcoming = hotelRows.find((h) => h.check_in_day > day);
        setNextHotel(upcoming || null);
      } catch (error) {
        console.error("Error loading hotel data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHotelData();
  }, [activeTripId]);

  return {
    hotels,
    currentDay,
    currentHotel,
    transitionDay,
    nextHotel,
    loading,
  };
}
