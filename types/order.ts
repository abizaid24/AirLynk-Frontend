// Mirrors app/schemas/order.py exactly

export interface PassengerCreatePayload {
  full_name: string;
  passport_no?: string | null;
  dob?: string | null;
  nationality?: string | null;
  passenger_type: "adult" | "child" | "infant";
  seat_id?: string | null;
  email?: string | null;
  phone?: string | null;
}

export interface AncillaryCreatePayload {
  type: string;
  quantity: number;
  description?: string | null;
  booking_id?: string | null;
}

export interface BookingLegCreatePayload {
  flight_id: string;
  class_id: string;
  passengers: PassengerCreatePayload[];
}

export interface OrderCreatePayload {
  legs: BookingLegCreatePayload[];
  ancillaries: AncillaryCreatePayload[];
  guest_email?: string | null;
  guest_name?: string | null;
  loyalty_points_to_redeem?: number;
  currency?: string;
  notes?: string | null;
}

export interface SeatInfo {
  id: string;
  seat_number: string;
  status: string;
}

export interface PassengerResponse {
  id: string;
  full_name: string;
  passport_no?: string | null;
  dob?: string | null;
  nationality?: string | null;
  passenger_type: string;
  seat?: SeatInfo | null;
  email?: string | null;
  phone?: string | null;
}

export interface AncillaryResponse {
  id: string;
  type: string;
  description?: string | null;
  quantity: number;
  unit_price: string;
  price: string;
  currency: string;
}

export interface BookingResponse {
  id: string;
  flight_id: string;
  class_id: string;
  pnr_code: string;
  status: string;
  fare_amount: string;
  tax_amount: string;
  passenger_count: number;
  passengers: PassengerResponse[];
  flight_number?: string | null;
  class_type?: string | null;
  departure_time?: string | null;
  arrival_time?: string | null;
  origin_code?: string | null;
  destination_code?: string | null;
}

export interface PaymentBrief {
  id: string;
  amount: string;
  currency: string;
  status: string;
  stripe_payment_id?: string | null;
  paid_at?: string | null;
}

export interface OrderResponse {
  id: string;
  order_reference: string;
  status: string;
  subtotal: string;
  taxes: string;
  fees: string;
  discount: string;
  total_amount: string;
  currency: string;
  loyalty_points_earned: number;
  loyalty_points_redeemed: number;
  carbon_kg_total?: number | null;
  notes?: string | null;
  guest_email?: string | null;
  guest_name?: string | null;
  bookings: BookingResponse[];
  ancillary_services: AncillaryResponse[];
  payments: PaymentBrief[];
  created_at: string;
  updated_at: string;
  cancelled_at?: string | null;
}

export interface OrderCancelPayload {
  reason?: string | null;
}

export interface OrderListResponse {
  items: OrderResponse[];
  total: number;
  page: number;
  page_size: number;
}

// Mirrors app/utils/constants.py AncillaryType enum + ANCILLARY_PRICES (USD)
export const ANCILLARY_TYPES = [
  { value: "baggage", label: "Extra Baggage", price: 45, icon: "luggage" },
  { value: "meal", label: "Meal Selection", price: 18, icon: "utensils" },
  { value: "lounge", label: "Lounge Access", price: 55, icon: "sofa" },
  { value: "priority_boarding", label: "Priority Boarding", price: 25, icon: "zap" },
  { value: "extra_legroom", label: "Extra Legroom", price: 35, icon: "move-vertical" },
  { value: "travel_insurance", label: "Travel Insurance", price: 29, icon: "shield-check" },
  { value: "wifi", label: "In-flight Wi-Fi", price: 12, icon: "wifi" },
] as const;

// Mirrors app/utils/constants.py OrderStatus / BookingStatus / PaymentStatus
export const ORDER_STATUS = {
  DRAFT: "draft",
  PENDING_PAYMENT: "pending_payment",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
  COMPLETED: "completed",
} as const;
