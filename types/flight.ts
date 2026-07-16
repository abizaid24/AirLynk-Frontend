// Mirrors app/schemas/flight.py exactly

export interface AirportResponse {
  id: string;
  iata_code: string;
  name: string;
  city: string;
  country: string;
  timezone: string;
}

export interface FlightClassResponse {
  id: string;
  class_type: string; // economy | premium_economy | business | first
  total_seats: number;
  available_seats: number;
  price_multiplier: number;
  current_price: string; // Decimal serialized as string by pydantic->json in most configs
  baggage_kg: number;
}

export interface FlightListItem {
  id: string;
  flight_number: string;
  airline_code: string;
  origin: AirportResponse;
  destination: AirportResponse;
  departure_time: string;
  arrival_time: string;
  duration_minutes: number;
  aircraft_type: string;
  base_price: string;
  currency: string;
  status: string;
  stops: number;
  distance_km: number;
  carbon_kg_per_passenger?: number | null;
  classes: FlightClassResponse[];
  lowest_price?: string | null;
}

export interface FlightDetail extends FlightListItem {
  gate?: string | null;
  terminal?: string | null;
  average_rating?: number | null;
  review_count: number;
}

export interface PaginatedFlights {
  items: FlightListItem[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface FlightSearchQuery {
  origin: string;
  destination: string;
  date?: string; // YYYY-MM-DD
  flexible_days?: number;
  class_type?: string;
  passengers?: number;
  max_stops?: number;
  max_price?: number;
  sort_by?: "price" | "duration" | "departure";
  sort_order?: "asc" | "desc";
  page?: number;
  page_size?: number;
}

export interface PriceHistoryPoint {
  price: string;
  currency: string;
  recorded_at: string;
  class_id?: string | null;
}

export interface SeatMapSeat {
  id: string;
  seat_number: string;
  row: string;
  column: string;
  status: string; // AVAILABLE | LOCKED | BOOKED
  is_window: boolean;
  is_aisle: boolean;
  is_exit_row: boolean;
  class_type?: string | null;
  is_available: boolean;
}

export interface SeatMapResponse {
  flight_id: string;
  seats: SeatMapSeat[];
  by_class: Record<string, unknown>;
}

// Mirrors app/utils/constants.py FareClass enum EXACTLY (lowercase values,
// only 4 classes — the backend has no "private jet" fare class).
export const FLIGHT_CLASSES = [
  { value: "economy", label: "Economy" },
  { value: "premium_economy", label: "Premium Economy" },
  { value: "business", label: "Business Class" },
  { value: "first", label: "First Class" },
] as const;
