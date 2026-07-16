// Mirrors app/schemas/seat.py exactly

export interface SeatLockResponse {
  id: string;
  seat_number: string;
  status: string; // available | locked | booked | blocked
  locked_until?: string | null;
  message: string;
}

export interface SeatResponse {
  id: string;
  flight_id: string;
  class_id: string;
  seat_number: string;
  row: string;
  column: string;
  status: string;
  locked_until?: string | null;
  is_window: boolean;
  is_aisle: boolean;
  is_exit_row: boolean;
}

// Mirrors app/utils/constants.py SeatStatus enum
export const SEAT_STATUS = {
  AVAILABLE: "available",
  LOCKED: "locked",
  BOOKED: "booked",
  BLOCKED: "blocked",
} as const;
