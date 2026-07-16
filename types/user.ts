// Mirrors app/schemas/user.py exactly

export interface UserRegisterPayload {
  full_name: string;
  email: string;
  password: string;
  phone?: string | null;
}

export interface UserLoginPayload {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string; // "bearer"
  expires_in: number;
}

export interface RefreshTokenPayload {
  refresh_token: string;
}

export interface EmailVerifyPayload {
  email: string;
  otp_code: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp_code: string;
  new_password: string;
}

export interface UserUpdatePayload {
  full_name?: string;
  phone?: string;
  preferred_currency?: string;
  preferred_language?: string;
  date_of_birth?: string;
  passport_number?: string;
  nationality?: string;
  profile_picture?: string;
}

export interface UserResponse {
  id: string;
  full_name: string;
  email: string;
  role: string;
  phone?: string | null;
  is_verified: boolean;
  is_active: boolean;
  is_guest: boolean;
  profile_picture?: string | null;
  loyalty_points: number;
  loyalty_tier: string;
  preferred_currency: string;
  preferred_language: string;
  date_of_birth?: string | null;
  passport_number?: string | null;
  nationality?: string | null;
  created_at: string;
}

export interface LoyaltyTransactionResponse {
  id: string;
  points: number;
  type: string;
  description?: string | null;
  balance_after: number;
  created_at: string;
}

export interface LoyaltySummary {
  points: number;
  tier: string;
  next_tier?: string | null;
  points_to_next_tier?: number | null;
  transactions: LoyaltyTransactionResponse[];
}

export interface MessageResponse {
  success: boolean;
  message: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: UserResponse;
  debug_otp?: string | null;
}

export interface LoginResponse {
  success: boolean;
  user: UserResponse;
  tokens: TokenResponse;
}
