// Mirrors app/schemas/payment.py exactly

export interface CreatePaymentIntentPayload {
  order_id: string;
  return_url?: string | null;
}

export interface PaymentIntentResponse {
  payment_id: string;
  order_id: string;
  client_secret?: string | null;
  stripe_payment_id?: string | null;
  amount: string;
  currency: string;
  status: string;
  demo_mode: boolean;
  message: string;
}

export interface PaymentResponse {
  id: string;
  order_id: string;
  amount: string;
  currency: string;
  stripe_payment_id?: string | null;
  status: string; // pending | processing | succeeded | failed | refunded | partially_refunded
  payment_method?: string | null;
  receipt_url?: string | null;
  refund_amount: string;
  paid_at?: string | null;
  created_at: string;
}

export interface DemoConfirmPaymentPayload {
  order_id: string;
  payment_id?: string | null;
}
