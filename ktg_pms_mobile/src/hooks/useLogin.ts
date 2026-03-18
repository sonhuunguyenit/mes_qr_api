import { authService } from "~/services/auth/auth.service";
import { LoginRequest, LoginResponse } from "~/services/auth/auth.type";
import { useMutation } from "@tanstack/react-query";
import { showMessage } from "react-native-flash-message";
import { useAuth } from "./useAuth";

export const endpoint = {
  login: "auth/login",
};

const useLogin = () => {
  const { onSetToken, onSetUser } = useAuth();

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
      if (e?.message === "Network Error") {
        showMessage({
          message: "Không có kết nối mạng. Vui lòng kiểm tra lại",
          type: "danger",
        });
        return;
      }

      showMessage({
        message: "Lỗi đăng nhập",
        type: "danger",
      });
      console.log(e);
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
      } = data;

      await onSetToken(accessToken);
      await onSetUser({
        name,
        isAdmin,
        employeeId,
        employeeOrgPosition,
        departmentId,
        companyId,
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
