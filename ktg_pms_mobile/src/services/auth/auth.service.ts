import { CONFIG } from "~/constants/config";
import { apiClient } from "../axios/client";
import {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "./auth.type";

const ENDPOINTS = {
  LOGIN: `${CONFIG.API_URL}/auth/login`,
  REFRESH_TOKEN: `${CONFIG.API_URL}/auth/refresh`,
};

export const authService = {
  login: (body: LoginRequest) => {
    return apiClient.post<LoginResponse>(`${ENDPOINTS.LOGIN}`, {
      ...body,
    });
  },
  refreshToken: (body: RefreshTokenRequest) => {
    return apiClient.post<RefreshTokenResponse>(`${ENDPOINTS.REFRESH_TOKEN}`, {
      ...body,
    });
  },
};
