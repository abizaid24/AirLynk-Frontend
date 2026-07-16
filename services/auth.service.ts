import { apiClient } from "@/lib/api-client";
import type {
  EmailVerifyPayload,
  ForgotPasswordPayload,
  LoginResponse,
  MessageResponse,
  RefreshTokenPayload,
  RegisterResponse,
  ResetPasswordPayload,
  TokenResponse,
  UserLoginPayload,
  UserRegisterPayload,
  UserResponse,
  UserUpdatePayload,
  LoyaltySummary,
} from "@/types/user";

export const authService = {
  register: (payload: UserRegisterPayload) =>
    apiClient
      .post<RegisterResponse>("/auth/register", payload)
      .then((r) => r.data),

  verifyEmail: (payload: EmailVerifyPayload) =>
    apiClient
      .post<MessageResponse>("/auth/verify-email", payload)
      .then((r) => r.data),

  login: (payload: UserLoginPayload) =>
    apiClient.post<LoginResponse>("/auth/login", payload).then((r) => r.data),

  refresh: (payload: RefreshTokenPayload) =>
    apiClient
      .post<TokenResponse>("/auth/refresh", payload)
      .then((r) => r.data),

  logout: (payload: RefreshTokenPayload) =>
    apiClient
      .post<MessageResponse>("/auth/logout", payload)
      .then((r) => r.data),

  forgotPassword: (payload: ForgotPasswordPayload) =>
    apiClient
      .post<MessageResponse>("/auth/forgot-password", payload)
      .then((r) => r.data),

  resetPassword: (payload: ResetPasswordPayload) =>
    apiClient
      .post<MessageResponse>("/auth/reset-password", payload)
      .then((r) => r.data),

  me: () => apiClient.get<UserResponse>("/users/me").then((r) => r.data),

  updateMe: (payload: UserUpdatePayload) =>
    apiClient.put<UserResponse>("/users/me", payload).then((r) => r.data),

  deleteMe: () =>
    apiClient.delete<MessageResponse>("/users/me").then((r) => r.data),

  myLoyalty: () =>
    apiClient.get<LoyaltySummary>("/users/me/loyalty").then((r) => r.data),
};
