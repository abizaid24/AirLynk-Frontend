// Mirrors app/schemas/review.py exactly

export interface ReviewCreatePayload {
  flight_id: string;
  booking_id?: string | null;
  rating: number;
  comment?: string | null;
  service_rating?: number | null;
  comfort_rating?: number | null;
  value_rating?: number | null;
}

export interface ReviewResponse {
  id: string;
  user_id: string;
  flight_id: string;
  rating: number;
  comment?: string | null;
  service_rating?: number | null;
  comfort_rating?: number | null;
  value_rating?: number | null;
  created_at: string;
  user_name?: string | null;
}

export interface ReviewListResponse {
  items: ReviewResponse[];
  average_rating: number;
  total: number;
}
