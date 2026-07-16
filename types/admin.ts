import type { FlightListItem } from "./flight";
import type { UserResponse } from "./user";
import type { OrderResponse } from "./order";

// Mirrors app/schemas/admin.py

export interface RevenueByDate {
  date: string;
  revenue: number;
  count: number;
}

export interface RevenueAnalytics {
  total_revenue: string;
  total_orders: number;
  average_order_value: string;
  by_route: Record<string, unknown>[];
  by_date: RevenueByDate[];
  currency: string;
}

export interface OccupancyItem {
  flight_id: string;
  flight_number: string;
  route: string;
  departure_time: string;
  total_seats: number;
  booked_seats: number;
  occupancy_rate: number;
}

export interface OccupancyAnalytics {
  items: OccupancyItem[];
  overall_occupancy_rate: number;
}

export interface DashboardStats {
  total_users: number;
  total_flights: number;
  total_orders: number;
  confirmed_orders: number;
  total_revenue: string;
  active_price_alerts: number;
}

// Mirrors FlightCreate / FlightUpdate in app/schemas/flight.py

export interface FlightCreatePayload {
  flight_number: string;
  airline_code?: string;
  origin_iata: string;
  destination_iata: string;
  departure_time: string; // ISO datetime
  arrival_time: string;
  aircraft_type?: string;
  base_price: number;
  currency?: string;
  distance_km?: number;
  stops?: number;
  gate?: string | null;
  terminal?: string | null;
  generate_seats?: boolean;
}

export interface FlightUpdatePayload {
  departure_time?: string;
  arrival_time?: string;
  base_price?: number;
  status?: string;
  gate?: string | null;
  terminal?: string | null;
  is_active?: boolean;
  aircraft_type?: string;
}

export interface AdminUserStatusUpdatePayload {
  is_active: boolean;
}

export interface PaginatedUsers {
  items: UserResponse[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface PaginatedAdminOrders {
  items: OrderResponse[];
  total: number;
  page: number;
  page_size: number;
}

export type PaginatedAdminFlights = FlightListItem[];

export const FLIGHT_STATUS_OPTIONS = [
  "scheduled",
  "boarding",
  "departed",
  "arrived",
  "delayed",
  "cancelled",
] as const;
