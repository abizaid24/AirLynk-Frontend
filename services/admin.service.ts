import { apiClient } from "@/lib/api-client";
import type {
  AdminUserStatusUpdatePayload,
  DashboardStats,
  FlightCreatePayload,
  FlightUpdatePayload,
  OccupancyAnalytics,
  PaginatedAdminOrders,
  PaginatedUsers,
  RevenueAnalytics,
} from "@/types/admin";
import type { FlightListItem } from "@/types/flight";
import type { MessageResponse, UserResponse } from "@/types/user";

export const adminService = {
  createFlight: (payload: FlightCreatePayload) =>
    apiClient
      .post<FlightListItem>("/admin/flights", payload)
      .then((r) => r.data),

  updateFlight: (flightId: string, payload: FlightUpdatePayload) =>
    apiClient
      .put<FlightListItem>(`/admin/flights/${flightId}`, payload)
      .then((r) => r.data),

  deleteFlight: (flightId: string) =>
    apiClient
      .delete<MessageResponse>(`/admin/flights/${flightId}`)
      .then((r) => r.data),

  listUsers: (params: { page?: number; page_size?: number; q?: string }) =>
    apiClient
      .get<PaginatedUsers>("/admin/users", { params })
      .then((r) => r.data),

  setUserStatus: (userId: string, payload: AdminUserStatusUpdatePayload) =>
    apiClient
      .patch<UserResponse>(`/admin/users/${userId}/status`, payload)
      .then((r) => r.data),

  listOrders: (params: {
    page?: number;
    page_size?: number;
    status?: string;
  }) =>
    apiClient
      .get<PaginatedAdminOrders>("/admin/orders", { params })
      .then((r) => r.data),

  revenueAnalytics: (params?: { date_from?: string; date_to?: string }) =>
    apiClient
      .get<RevenueAnalytics>("/admin/analytics/revenue", { params })
      .then((r) => r.data),

  occupancyAnalytics: () =>
    apiClient
      .get<OccupancyAnalytics>("/admin/analytics/occupancy")
      .then((r) => r.data),

  dashboardStats: () =>
    apiClient
      .get<DashboardStats>("/admin/analytics/dashboard")
      .then((r) => r.data),
};
