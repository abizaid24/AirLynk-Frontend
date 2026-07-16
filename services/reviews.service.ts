import { apiClient } from "@/lib/api-client";
import type {
  ReviewCreatePayload,
  ReviewListResponse,
  ReviewResponse,
} from "@/types/review";

export const reviewsService = {
  submit: (payload: ReviewCreatePayload) =>
    apiClient.post<ReviewResponse>("/reviews", payload).then((r) => r.data),

  listForFlight: (flightId: string, page = 1, pageSize = 20) =>
    apiClient
      .get<ReviewListResponse>(`/flights/${flightId}/reviews`, {
        params: { page, page_size: pageSize },
      })
      .then((r) => r.data),
};
