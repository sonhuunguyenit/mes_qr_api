import { ApiResponse } from "~/services/axios/api.types";
import { apiClient } from "~/services/axios/client";
import { useMutation } from "@tanstack/react-query";

interface RefreshTokenRequest {
  accessToken: string;
}

interface RefreshTokenResponse {
  accessToken: string;
}

export const endpoint = {
  refreshToken: "auth_app/refresh_token",
};

const useRefreshToken = () => {
  const { isPending, isError, data, error, mutateAsync } = useMutation({
    mutationFn: (variables: RefreshTokenRequest) =>
      apiClient.post<RefreshTokenRequest, ApiResponse<RefreshTokenResponse>>(
        endpoint.refreshToken,
        variables,
      ),
  });

  return {
    isLoading: isPending,
    isError,
    data,
    error,
    mutateAsync,
  };
};

export default useRefreshToken;
