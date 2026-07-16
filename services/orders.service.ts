import { apiClient } from "@/lib/api-client";
import { API_URL } from "@/lib/config";
import { tokenStorage } from "@/lib/token-storage";
import type {
  AncillaryCreatePayload,
  OrderCancelPayload,
  OrderCreatePayload,
  OrderListResponse,
  OrderResponse,
} from "@/types/order";

export const ordersService = {
  create: (payload: OrderCreatePayload) =>
    apiClient.post<OrderResponse>("/orders", payload).then((r) => r.data),

  list: (params?: { page?: number; page_size?: number; status?: string }) =>
    apiClient
      .get<OrderListResponse>("/orders", { params })
      .then((r) => r.data),

  getById: (orderId: string) =>
    apiClient.get<OrderResponse>(`/orders/${orderId}`).then((r) => r.data),

  cancel: (orderId: string, payload?: OrderCancelPayload) =>
    apiClient
      .patch<OrderResponse>(`/orders/${orderId}/cancel`, payload ?? {})
      .then((r) => r.data),

  addAncillary: (orderId: string, payload: AncillaryCreatePayload) =>
    apiClient
      .post<OrderResponse>(`/orders/${orderId}/ancillary`, payload)
      .then((r) => r.data),

  /** Downloads the e-ticket PDF and triggers a browser save. */
  downloadTicket: async (orderId: string, orderReference: string) => {
    const token = tokenStorage.getAccessToken();
    const res = await fetch(`${API_URL}/orders/${orderId}/ticket`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!res.ok) throw new Error("Could not generate the ticket PDF");
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `eticket_${orderReference}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },
};
