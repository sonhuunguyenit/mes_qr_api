import { CONFIG } from "~/constants/config";
import { STORAGE_KEYS } from "~/constants/storage";
import { authEvents } from "~/utils/events";
import {
  default as SecureHelper,
  default as StorageHelper,
} from "~/utils/storage";
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { ApiError } from "./api.types";

export class ApiClient {
  private client: AxiosInstance;

  constructor(url?: string, headers = {}) {
    this.client = axios.create({
      baseURL: url ?? CONFIG.API_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
        ...headers,
      },
    });

    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await SecureHelper.get(STORAGE_KEYS.ACCESS_TOKEN);

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        config.headers["x-lang"] = "vi";
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      },
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const apiError: ApiError = {
          message: error.message || "An error occurred",
          status: error.response?.status,
          code: error.code,
        };

        if (error.response?.data) {
          const data = error.response.data as any;
          apiError.message = data.message || apiError.message;
          apiError.errors = data.errors;
        }

        if (error.response?.status === 401) {
          await StorageHelper.set(STORAGE_KEYS.ACCESS_TOKEN, null);
          await StorageHelper.set(STORAGE_KEYS.USER_DATA, null);

          authEvents.emitLogout();
        }

        return Promise.reject(apiError);
      },
    );
  }

  public getInstance(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient().getInstance();
