import { authService } from "~/services/auth/auth.service";
import { LoginRequest, LoginResponse } from "~/services/auth/auth.type";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { useToast } from "./useToast";
import { apiClient } from "~/services/axios/client";

export const endpoint = {
  login: "auth/login",
};

const useLogin = () => {
  const { onSetToken, onSetUser } = useAuth();
  const { showToast } = useToast();

  const { isPending, isError, data, error, mutateAsync } = useMutation<
    LoginResponse,
    any,
    LoginRequest
  >({
    mutationFn: async (variables: LoginRequest) => {
      const response = await authService.login(variables);
      return response.data;
    },
    onError: (e: any) => {
      if (e?.code === "ERR_NETWORK") {
        showToast({
          message: "Không có kết nối mạng. Vui lòng kiểm tra lại",
          type: "danger",
        });
        return;
      }

      showToast({
        message: e.message || "Lỗi đăng nhập",
        type: "danger",
      });
    },
    async onSuccess(data, variables, context) {
      const {
        accessToken,
        name,
        isAdmin,
        employeeId,
        employeeOrgPosition,
        departmentId,
        companyId,
        lstPermission,
        listCompany,
        userId,
      } = data;

      await onSetToken(accessToken);

      let resolvedCompanies = [];
      if (listCompany && listCompany.length > 0) {
        try {
          const companyRes = await apiClient.post(
            "/company/find_by_id",
            listCompany,
          );
          resolvedCompanies = companyRes.data || [];
        } catch (companyError) {
          console.error("Failed to fetch company details", companyError);
        }
      }

      // Auto-update company context on backend when there is only 1 or 0 companies to choose from
      if (!listCompany || listCompany.length <= 1) {
        if (companyId) {
          try {
            await authService.updateCompany(companyId);
          } catch (companyError) {
            // Fail silently on auto-update
          }
        }
      }

      await onSetUser({
        name,
        isAdmin,
        employeeId,
        employeeOrgPosition,
        departmentId,
        companyId,
        lstPermission,
        listCompany:
          resolvedCompanies.length > 0 ? resolvedCompanies : listCompany,
        userId,
      });
    },
  });

  return {
    isPending,
    isError,
    data,
    error,
    onLogin: mutateAsync,
  };
};

export default useLogin;
