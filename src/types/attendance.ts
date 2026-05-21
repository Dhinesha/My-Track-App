export type AttendanceStatus =
  | 'Checked In'
  | 'Not Boarded'
  | 'Gone / Missing'
  | 'Absent';

export type PaxRole = 'PRIMARY' | 'SECONDARY';

export interface FamilyMember {
  paxId: string;
  name: string;
  phone?: string;
  role: PaxRole;
  relation?: string;
  seatNumber?: string;
  berthNumber?: string;
  pnrNumber?: string;
  attendanceStatus: AttendanceStatus;
  checkedInAt?: string;
  viaRep: boolean;
  primary_id?: string;
  meal?: string;
}

export interface AttendanceRecord {
  paxId: string;
  vehicleId: string;
  checkedInAt?: string;
  status: AttendanceStatus;
  viaRep?: number; // 0 = self check-in, 1 = checked in by primary traveler on behalf
}
