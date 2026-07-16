// Mirrors app/schemas/price_alert.py exactly

export interface PriceAlertCreatePayload {
  origin_code: string;
  destination_code: string;
  target_price: number;
  currency?: string;
  class_type?: string | null;
  travel_date_from?: string | null;
  travel_date_to?: string | null;
}

export interface PriceAlertResponse {
  id: string;
  origin_code: string;
  destination_code: string;
  target_price: string;
  currency: string;
  class_type?: string | null;
  travel_date_from?: string | null;
  travel_date_to?: string | null;
  is_active: boolean;
  last_lowest_price?: string | null;
  last_checked_at?: string | null;
  created_at: string;
}

export interface PriceAlertList {
  items: PriceAlertResponse[];
  total: number;
}
