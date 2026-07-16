import { apiClient } from "@/lib/api-client";
import type { SeatLockResponse } from "@/types/seat";
import type { MessageResponse } from "@/types/user";

export const seatsService = {
  lock: (seatId: string) =>
    apiClient
      .post<SeatLockResponse>(`/seats/${seatId}/lock`)
      .then((r) => r.data),

  unlock: (seatId: string) =>
    apiClient
      .delete<MessageResponse>(`/seats/${seatId}/lock`)
      .then((r) => r.data),
};
