import { differenceInDays, parseISO } from 'date-fns';

// ─── In-memory attendance store so check-ins persist within a session ───────
const _attendanceStore: Record<string, {
  pax_id: string; vehicle_id: string; checked_in_at: string | null;
  status: string; via_rep: number;
}> = {};

const _attendanceKey = (paxId: string, vehicleId: string) => `${paxId}::${vehicleId}`;

export const usePowerSync = () => {
  return {
    getAll: async (query: string, params: any[] = []): Promise<any[]> => {
      const q = query.toLowerCase().trim();
      const now = new Date();
      
      // Calculate start dates dynamically relative to current date so it is always current/future-proof
      const day2StartDate = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // 1. Trips query
      if (q.includes('select start_date') && q.includes('from trips')) {
        const id = params[0] || 'kyoto-1';
        const start_date = id === 'kyoto-1' ? day2StartDate : '2023-10-12';
        return [{ 
          id,
          name: 'Kyoto Spring Adventure',
          start_date,
          destination: 'Kyoto',
          destination_city: 'Kyoto'
        }];
      }

      // 2. First itinerary activity time (for countdown)
      if (q.includes('select start_time') && q.includes('from itinerary') && q.includes('limit 1')) {
        const departureTime = new Date(now.getTime() + 45 * 60 * 1000);
        const depHours = String(departureTime.getHours()).padStart(2, '0');
        const depMins = String(departureTime.getMinutes()).padStart(2, '0');
        return [{ start_time: `${depHours}:${depMins}` }];
      }

      // 3. Itinerary activities
      if (q.includes('select place_name') || q.includes('from itinerary')) {
        // Set first departure to be exactly 45 minutes in the future for active countdown display
        const departureTime = new Date(now.getTime() + 45 * 60 * 1000);
        const depHours = String(departureTime.getHours()).padStart(2, '0');
        const depMins = String(departureTime.getMinutes()).padStart(2, '0');
        const firstActivityTime = `${depHours}:${depMins}`;

        const nextHour1 = String((departureTime.getHours() + 1) % 24).padStart(2, '0');
        const nextHour2 = String((departureTime.getHours() + 3) % 24).padStart(2, '0');
        const nextHour3 = String((departureTime.getHours() + 5) % 24).padStart(2, '0');
        const nextHour4 = String((departureTime.getHours() + 7) % 24).padStart(2, '0');

        return [
          { 
            place_name: 'Breakfast & Briefing', 
            start_time: firstActivityTime, 
            duration_mins: 45, 
            status: 'upcoming',
            entry_fee_type: 'free',
            entry_fee_amount: 0,
            day_note: 'Bring your passport for the museum entry and comfortable walking shoes.' 
          },
          { 
            place_name: 'Fushimi Inari Shrine', 
            start_time: `${nextHour1}:30`, 
            duration_mins: 180, 
            status: 'upcoming',
            entry_fee_type: 'self',
            entry_fee_amount: 1500
          },
          { 
            place_name: 'Traditional Kaiseki Lunch', 
            start_time: `${nextHour2}:00`, 
            duration_mins: 90, 
            status: 'upcoming',
            entry_fee_type: 'self',
            entry_fee_amount: 3000
          },
          { 
            place_name: 'Bamboo Forest Walk', 
            start_time: `${nextHour3}:30`, 
            duration_mins: 120, 
            status: 'upcoming',
            entry_fee_type: 'free',
            entry_fee_amount: 0
          },
          { 
            place_name: 'Dinner at Kyoto Station', 
            start_time: `${nextHour4}:30`, 
            duration_mins: 90, 
            status: 'upcoming',
            entry_fee_type: 'free',
            entry_fee_amount: 0
          }
        ];
      }

      // 4. Pax query — simple id lookup (used by SmartCheckInBanner etc.)
      if (q.includes('select id') && q.includes('from pax') && !q.includes('left join')) {
        return [{ id: 'pax-1', primary_id: null, trip_id: 'kyoto-1' }];
      }

      // 4b. Family-attendance JOIN query used by useFamilyAttendance hook
      //     SELECT p.id AS paxId, p.name, ... FROM pax p
      //     LEFT JOIN pax_vehicles pv ... LEFT JOIN attendance a ...
      //     WHERE (p.primary_id = ? OR p.id = ?) AND p.trip_id = ?
      if (
        q.includes('from pax p') &&
        q.includes('left join pax_vehicles') &&
        q.includes('left join attendance')
      ) {
        const vehicleId: string = (params[0] as string) ?? 'leg-1-2';

        // Build seat data per vehicle
        const isFlight = vehicleId.includes('1-2');
        const isTrain  = vehicleId.includes('2-1');

        const seats = isFlight
          ? ['12A', '12B', '12C', '12D', '12E']
          : isTrain
          ? ['Seat 24', 'Seat 25', 'Seat 26', 'Seat 27', 'Seat 28']
          : ['Seat 1', 'Seat 2', 'Seat 3', 'Seat 4', 'Seat 5'];

        const pnr = isFlight ? 'FLIGHT123' : isTrain ? 'TRAIN456' : '';

        const memberDefs = [
          // PRIMARY members (primary_id = null)
          { paxId: 'pax-1', name: 'Raj G',     phone: '+91 98765 43210', primary_id: null,    seat: seats[0] },
          { paxId: 'pax-2', name: 'Priya G',   phone: '+91 98765 43211', primary_id: null,    seat: seats[1] },
          // SECONDARY members
          { paxId: 'pax-3', name: 'Dhinesha G',phone: '+91 98765 43212', primary_id: 'pax-1', seat: seats[2] },
          { paxId: 'pax-4', name: 'Ananya G',  phone: '+91 98765 43213', primary_id: 'pax-2', seat: seats[3] },
          { paxId: 'pax-5', name: 'Rahul G',   phone: '+91 98765 43214', primary_id: 'pax-1', seat: seats[4] },
        ];

        return memberDefs.map((m) => {
          const stored = _attendanceStore[_attendanceKey(m.paxId, vehicleId)];
          return {
            paxId:            m.paxId,
            name:             m.name,
            phone:            m.phone,
            primary_id:       m.primary_id,
            seatNumber:       m.seat,
            berthNumber:      isTrain ? 'Upper' : null,
            pnrNumber:        pnr,
            meal:             'Veg Meal',
            role:             m.primary_id === null ? 'PRIMARY' : 'SECONDARY',
            attendanceStatus: stored?.status ?? 'Not Boarded',
            checkedInAt:      stored?.checked_in_at ?? null,
            viaRep:           stored?.via_rep ?? 0,
          };
        });
      }

      // 5. Attendance query — simple id lookup (SmartCheckInBanner)
      if (q.includes('select id') && q.includes('from attendance')) {
        // Return empty so the user is not checked in yet (shows warning/boarding timer)
        return [];
      }

      // 6. Generic COUNT queries
      if (q.includes('count(*)')) {
        if (q.includes('itinerary')) return [{ cnt: 15 }];
        if (q.includes('attendance')) return [{ cnt: 0 }];
        if (q.includes('notifications')) return [{ cnt: 2 }];
        return [{ cnt: 5 }];
      }

      // 7. Hotel check-ins
      if (q.includes('from hotel_checkins') || q.includes('hotel_checkins')) {
        return [
          { pax_id: 'demo-pax-1', hotel_id: 'hotel-1', status: 'confirmed', checked_in_at: '4:35 PM' },
          { pax_id: 'demo-pax-2', hotel_id: 'hotel-1', status: 'confirmed', checked_in_at: '4:40 PM' },
          { pax_id: 'demo-pax-3', hotel_id: 'hotel-1', status: 'pending', checked_in_at: null },
          { pax_id: 'demo-pax-1', hotel_id: 'hotel-2', status: 'pending', checked_in_at: null },
          { pax_id: 'demo-pax-2', hotel_id: 'hotel-2', status: 'pending', checked_in_at: null },
          { pax_id: 'demo-pax-3', hotel_id: 'hotel-2', status: 'pending', checked_in_at: null },
        ];
      }

      // 7b. Hotels query
      if (q.includes('from hotels') || q.includes('hotels h')) {
        return [
          {
            id: 'hotel-1',
            trip_id: 'kyoto-1',
            name: 'Grand Kyoto Inn',
            address: '123 Kyoto St, Kyoto, Japan',
            phone: '+81-75-123-4567',
            image_url: 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=800&q=80',
            stars: 4,
            check_in_day: 1,
            check_out_day: 3,
            check_in_time: '15:00',
            check_out_time: '11:00',
            room_number: '304',
            room_type: 'Deluxe Room',
            floor: 3
          },
          {
            id: 'hotel-2',
            trip_id: 'kyoto-1',
            name: 'Osaka Palace Hotel',
            address: '456 Osaka Rd, Osaka, Japan',
            phone: '+81-6-123-4567',
            image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
            stars: 5,
            check_in_day: 3,
            check_out_day: 5,
            check_in_time: '14:00',
            check_out_time: '10:00',
            room_number: '512',
            room_type: 'Executive Suite',
            floor: 5
          },
          {
            id: 'hotel-3',
            trip_id: 'kyoto-1',
            name: 'Nara Ryokan',
            address: '789 Nara Blvd, Nara, Japan',
            phone: '+81-742-123-4567',
            image_url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
            stars: 3,
            check_in_day: 5,
            check_out_day: 7,
            check_in_time: '16:00',
            check_out_time: '12:00',
            room_number: '201',
            room_type: 'Traditional Tatami',
            floor: 2
          }
        ];
      }

      // 7c. Roommates / sharing / pax_rooms query
      if (q.includes('pax_rooms') || q.includes('sharing') || q.includes('roommates')) {
        return [
          { id: 'pax-1', name: 'Dhinesha G', initials: 'DG', color: '#2B8CEE', role: 'Primary', room_number: '304', status: 'confirmed' },
          { id: 'pax-2', name: 'Ananya G', initials: 'AG', color: '#1D9E75', role: 'Family', room_number: '304', status: 'confirmed' },
          { id: 'pax-3', name: 'Rahul G', initials: 'RG', color: '#BA7517', role: 'Family', room_number: '304', status: 'pending' },
        ];
      }

      // 8. Vehicle & transport info
      if (q.includes('from vehicles') || q.includes('vehicles') || q.includes('driver_phone')) {
        return [
          {
            id: 'leg-1-1',
            trip_id: 'kyoto-1',
            transport_type: 'cab',
            trip_day: 1,
            leg_order: 1,
            departure_place: 'Hotel Grand Kyoto',
            arrival_place: 'Kansai Airport T1',
            departure_time: '04:00',
            arrival_time: '05:30',
            cab_company: 'Ola Outstation',
            cab_type: 'Sedan',
            cab_number: 'MH-12-AB-1234',
            cab_driver_name: 'Ramesh Kumar',
            cab_driver_phone: '+919876543210',
            cab_sharing: 1,
            driver_phone: '+919876543210'
          },
          {
            id: 'leg-1-2',
            trip_id: 'kyoto-1',
            transport_type: 'flight',
            trip_day: 1,
            leg_order: 2,
            departure_place: 'Kansai Airport (KIX)',
            arrival_place: 'Haneda Airport (HND)',
            departure_time: '06:30',
            arrival_time: '08:45',
            airline_name: 'IndiGo',
            flight_number: '6E-204',
            terminal: 'Terminal 2',
            gate: 'Gate 14B',
            driver_phone: ''
          },
          {
            id: 'leg-2-1',
            trip_id: 'kyoto-1',
            transport_type: 'train',
            trip_day: 2,
            leg_order: 1,
            departure_place: 'Tokyo Station',
            arrival_place: 'Kyoto Station',
            departure_time: '07:00',
            arrival_time: '09:15',
            train_number: '12301',
            train_name: 'Shinkansen Nozomi',
            coach: 'Car 4',
            berth_type: 'Reserved Seat',
            driver_phone: ''
          },
          {
            id: 'leg-2-2',
            trip_id: 'kyoto-1',
            transport_type: 'cab',
            trip_day: 2,
            leg_order: 2,
            departure_place: 'Kyoto Station',
            arrival_place: 'Grand Kyoto Inn',
            departure_time: '09:45',
            arrival_time: '10:15',
            cab_company: 'Uber Premium',
            cab_type: 'SUV',
            cab_number: 'DL-1C-CD-5678',
            cab_driver_name: 'Suresh Singh',
            cab_driver_phone: '+918765432109',
            cab_sharing: 0,
            driver_phone: '+918765432109'
          },
          {
            id: 'leg-3-1',
            trip_id: 'kyoto-1',
            transport_type: 'bus',
            trip_day: 3,
            leg_order: 1,
            departure_place: 'Grand Kyoto Inn',
            arrival_place: 'Kinkaku-ji Temple',
            departure_time: '09:00',
            arrival_time: '09:45',
            driver_name: 'Kenji Tanaka',
            driver_phone: '+819012345678',
            vehicle_number: 'KYOTO-304-BUS'
          }
        ];
      }

      // 8b. pax_vehicles query
      if (q.includes('pax_vehicles') || q.includes('pax_name')) {
        if (q.includes('totalrows') || q.includes('count(*)')) {
          return [{ cnt: 4 }];
        }
        
        // Return structured passengers matching the requested vehicle_id
        let vehicleId = 'leg-1-2';
        if (q.includes('leg-1-1')) vehicleId = 'leg-1-1';
        else if (q.includes('leg-1-2')) vehicleId = 'leg-1-2';
        else if (q.includes('leg-2-1')) vehicleId = 'leg-2-1';
        else if (q.includes('leg-2-2')) vehicleId = 'leg-2-2';
        else if (q.includes('leg-3-1')) vehicleId = 'leg-3-1';

        const pnr = vehicleId.includes('flight') || vehicleId.includes('1-2') ? 'FLIGHT123' : 
                    vehicleId.includes('train') || vehicleId.includes('2-1') ? 'TRAIN456' : '';

        return [
          {
            id: 'pax-1',
            pax_id: 'pax-1',
            pax_name: 'Raj G',
            name: 'Raj G',
            primary_id: null,
            seat_number: vehicleId.includes('flight') || vehicleId.includes('1-2') ? '12A' :
                         vehicleId.includes('train') || vehicleId.includes('2-1') ? 'Seat 24' : 'Seat 1',
            berth_number: 'Upper',
            pnr_number: pnr,
            status: 'Checked In',
            checked_in_at: '09:45 AM',
            phone: '+91 98765 43210',
            pax_phone: '+91 98765 43210',
            meal_preference: 'Veg Meal',
            meal: 'Veg Meal'
          },
          {
            id: 'pax-2',
            pax_id: 'pax-2',
            pax_name: 'Priya G',
            name: 'Priya G',
            primary_id: null,
            seat_number: vehicleId.includes('flight') || vehicleId.includes('1-2') ? '12B' :
                         vehicleId.includes('train') || vehicleId.includes('2-1') ? 'Seat 25' : 'Seat 2',
            berth_number: 'Lower',
            pnr_number: pnr,
            status: 'Checked In',
            checked_in_at: '09:50 AM',
            phone: '+91 98765 43211',
            pax_phone: '+91 98765 43211',
            meal_preference: 'Veg Meal',
            meal: 'Veg Meal'
          },
          {
            id: 'pax-3',
            pax_id: 'pax-3',
            pax_name: 'Dhinesha G',
            name: 'Dhinesha G',
            primary_id: 'pax-1',
            seat_number: vehicleId.includes('flight') || vehicleId.includes('1-2') ? '12C' :
                         vehicleId.includes('train') || vehicleId.includes('2-1') ? 'Seat 26' : 'Seat 3',
            berth_number: 'Upper',
            pnr_number: pnr,
            status: 'Checked In',
            checked_in_at: '10:15 AM',
            phone: '+91 98765 43212',
            pax_phone: '+91 98765 43212',
            meal_preference: 'Veg Meal',
            meal: 'Veg Meal'
          },
          {
            id: 'pax-4',
            pax_id: 'pax-4',
            pax_name: 'Ananya G',
            name: 'Ananya G',
            primary_id: 'pax-2',
            seat_number: vehicleId.includes('flight') || vehicleId.includes('1-2') ? '12D' :
                         vehicleId.includes('train') || vehicleId.includes('2-1') ? 'Seat 27' : 'Seat 4',
            berth_number: 'Middle',
            pnr_number: pnr,
            status: 'Checked In',
            checked_in_at: '10:30 AM',
            phone: '+91 98765 43213',
            pax_phone: '+91 98765 43213',
            meal_preference: 'Veg Meal',
            meal: 'Veg Meal'
          },
          {
            id: 'pax-5',
            pax_id: 'pax-5',
            pax_name: 'Rahul G',
            name: 'Rahul G',
            primary_id: 'pax-1',
            seat_number: vehicleId.includes('flight') || vehicleId.includes('1-2') ? '12E' :
                         vehicleId.includes('train') || vehicleId.includes('2-1') ? 'Seat 28' : 'Seat 5',
            berth_number: 'Lower',
            pnr_number: pnr,
            status: 'Checked In',
            checked_in_at: '10:35 AM',
            phone: '+91 98765 43214',
            pax_phone: '+91 98765 43214',
            meal_preference: 'Veg Meal',
            meal: 'Veg Meal'
          }
        ];
      }

      return [];
    },
    watch: () => ({
      subscribe: (callback: any) => {
        callback();
        return () => {};
      }
    }),
    execute: async (sql: string, params: any[] = []) => {
      const s = sql.toLowerCase().trim();
      // Persist attendance inserts/replaces so the UI reflects check-in state.
      // The hook uses 3 different INSERT patterns — we detect which by reading
      // the hardcoded literal in the SQL string rather than guessing param index.
      if (s.includes('insert') && s.includes('into attendance')) {
        const pax_id    = params[0] as string | undefined;
        const vehicle_id = params[1] as string | undefined;

        if (pax_id && vehicle_id) {
          let status: string;
          let checked_in_at: string | null;
          let via_rep: number;

          if (s.includes("'checked in'")) {
            // Pattern: VALUES (?, ?, ?, 'Checked In', ?)  ← 4 params
            // [pax_id, vehicle_id, timestamp, viaRepVal]
            status        = 'Checked In';
            checked_in_at = (params[2] as string) ?? null;
            via_rep       = (params[3] as number) ?? 0;

          } else if (s.includes("'absent'")) {
            // Pattern: VALUES (?, ?, NULL, 'Absent', 0)   ← 2 params
            // [pax_id, vehicle_id]
            status        = 'Absent';
            checked_in_at = null;
            via_rep       = 0;

          } else {
            // Pattern: VALUES (?, ?, ?, ?, ?)             ← 5 params (updateMemberStatus)
            // [pax_id, vehicle_id, checked_in_at, status, viaRepVal]
            checked_in_at = (params[2] as string) ?? null;
            status        = (params[3] as string) ?? 'Not Boarded';
            via_rep       = (params[4] as number) ?? 0;
          }

          _attendanceStore[_attendanceKey(pax_id, vehicle_id)] = {
            pax_id, vehicle_id, checked_in_at, status, via_rep,
          };
        }
      }
      return {};
    },
  };
};
