import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { API_URL } from "./config";
import { tokenStorage } from "./token-storage";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function flushQueue(error: unknown, token: string | null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (token) resolve(token);
    else reject(error);
  });
  pendingQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/")
    ) {
      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) {
        tokenStorage.clear();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(apiClient(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(`${API_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });
        tokenStorage.setTokens(data.access_token, data.refresh_token);
        flushQueue(null, data.access_token);
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        flushQueue(refreshError, null);
        tokenStorage.clear();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export interface ApiErrorShape {
  // AirLynk backend's actual error shape (see app/core/exceptions.py):
  // { success: false, error: { code, message, status_code, details? } }
  error?: { code?: string; message?: string; details?: unknown };
  // FastAPI's default shape for errors that bypass the custom handlers
  // (e.g. raised directly as HTTPException in middleware) — kept as a
  // fallback so nothing regresses if that ever happens.
  detail?: string | { message?: string };
  message?: string;
}

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorShape | undefined;
    if (typeof data?.error?.message === "string") return data.error.message;
    if (typeof data?.detail === "string") return data.detail;
    if (typeof data?.detail === "object" && data.detail?.message)
      return data.detail.message;
    if (data?.message) return data.message;
    if (error.message) return error.message;
  }
  return "Something went wrong. Please try again.";
}
