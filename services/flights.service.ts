import { apiClient } from "@/lib/api-client";
import type {
  FlightDetail,
  FlightSearchQuery,
  PaginatedFlights,
  PriceHistoryPoint,
  SeatMapResponse,
} from "@/types/flight";

export const flightsService = {
  search: (query: FlightSearchQuery) =>
    apiClient
      .get<PaginatedFlights>("/flights", {
        params: {
          origin: query.origin,
          destination: query.destination,
          date: query.date,
          flexible_days: query.flexible_days ?? 0,
          class_type: query.class_type,
          passengers: query.passengers ?? 1,
          max_stops: query.max_stops,
          max_price: query.max_price,
          sort_by: query.sort_by ?? "price",
          sort_order: query.sort_order ?? "asc",
          page: query.page ?? 1,
          page_size: query.page_size ?? 20,
        },
      })
      .then((r) => r.data),

  getById: (flightId: string) =>
    apiClient.get<FlightDetail>(`/flights/${flightId}`).then((r) => r.data),

  getSeatMap: (flightId: string) =>
    apiClient
      .get<SeatMapResponse>(`/flights/${flightId}/seats`)
      .then((r) => r.data),

  getPriceHistory: (flightId: string) =>
    apiClient
      .get<PriceHistoryPoint[]>(`/flights/${flightId}/price-history`)
      .then((r) => r.data),
};
