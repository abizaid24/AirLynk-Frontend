import { apiClient } from "@/lib/api-client";
import type {
  CreatePaymentIntentPayload,
  DemoConfirmPaymentPayload,
  PaymentIntentResponse,
  PaymentResponse,
} from "@/types/payment";

export const paymentsService = {
  createIntent: (payload: CreatePaymentIntentPayload) =>
    apiClient
      .post<PaymentIntentResponse>("/payments/create-intent", payload)
      .then((r) => r.data),

  demoConfirm: (payload: DemoConfirmPaymentPayload) =>
    apiClient
      .post<PaymentResponse>("/payments/demo-confirm", payload)
      .then((r) => r.data),

  statusForOrder: (orderId: string) =>
    apiClient
      .get<PaymentResponse>(`/payments/${orderId}`)
      .then((r) => r.data),
};
