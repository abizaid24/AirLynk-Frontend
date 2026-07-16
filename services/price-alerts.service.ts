import { apiClient } from "@/lib/api-client";
import type {
  PriceAlertCreatePayload,
  PriceAlertList,
  PriceAlertResponse,
} from "@/types/price-alert";
import type { MessageResponse } from "@/types/user";

export const priceAlertsService = {
  create: (payload: PriceAlertCreatePayload) =>
    apiClient
      .post<PriceAlertResponse>("/price-alerts", payload)
      .then((r) => r.data),

  list: () =>
    apiClient.get<PriceAlertList>("/price-alerts").then((r) => r.data),

  remove: (alertId: string) =>
    apiClient
      .delete<MessageResponse>(`/price-alerts/${alertId}`)
      .then((r) => r.data),
};
