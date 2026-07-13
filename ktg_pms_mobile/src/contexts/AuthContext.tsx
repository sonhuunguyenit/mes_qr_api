import { STORAGE_KEYS } from "~/constants/storage";
import useRefreshToken from "~/hooks/useRefreshToken";
import { authEvents } from "~/utils/events";
import StorageHelper from "~/utils/storage";
import { useQueryClient } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { LstPermission } from "~/services/auth/auth.type";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export type UserStorage = {
  name: string;
  isAdmin: boolean;
  employeeId: string;
  employeeOrgPosition: string;
  departmentId: string | null;
  companyId: string;
  lstPermission?: LstPermission[];
  listCompany?: { id: string; name: string; code?: string }[];
  userId?: string;
};

interface AuthContextProps {
  user: UserStorage | null;
  token: string | null;
  isLogged: boolean;
  isLoadingUser: boolean;
  onSetUser: (updatedUser: Partial<UserStorage>) => Promise<void>;
  onSetToken: (token: string) => Promise<void>;
  onLogout: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

const DEFAULT_USER: UserStorage = {
  name: "",
  isAdmin: false,
  employeeId: "",
  employeeOrgPosition: "",
  departmentId: null,
  companyId: "",
  lstPermission: [],
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<UserStorage | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const { mutateAsync: refreshToken } = useRefreshToken();

  const onLogout = useCallback(async () => {
    setToken(null);
    setUser(null);
    queryClient.clear();
    await Promise.all([
      StorageHelper.remove(STORAGE_KEYS.ACCESS_TOKEN),
      StorageHelper.remove(STORAGE_KEYS.USER_DATA),
    ]);
  }, [queryClient]);

  // Initialize Auth State
  useEffect(() => {
    const initAuth = async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          StorageHelper.get<string>(STORAGE_KEYS.ACCESS_TOKEN),
          StorageHelper.get<UserStorage>(STORAGE_KEYS.USER_DATA),
        ]);

        if (!storedToken) {
          setIsLoadingUser(false);
          return;
        }

        const decoded: { exp: number } = jwtDecode(storedToken);
        const isExpired = Date.now() >= decoded.exp * 1000;

        if (isExpired) {
          try {
            const response = await refreshToken({ accessToken: storedToken });
            const newToken = response?.data?.accessToken;

            if (newToken) {
              await StorageHelper.set(STORAGE_KEYS.ACCESS_TOKEN, newToken);
              setToken(newToken);
            } else {
              throw new Error("Refresh failed");
            }
          } catch {
            await onLogout();
          }
        } else {
          setToken(storedToken);
        }

        if (storedUser) {
          setUser({ ...DEFAULT_USER, ...storedUser });
        }
      } catch (error) {
        console.error("Auth Initialization Error:", error);
        await onLogout();
      } finally {
        setIsLoadingUser(false);
      }
    };

    initAuth();
  }, [refreshToken, onLogout]);

  const onSetToken = useCallback(async (newToken: string) => {
    await StorageHelper.set(STORAGE_KEYS.ACCESS_TOKEN, newToken);
    setToken(newToken);
  }, []);

  const onSetUser = useCallback(async (updatedUser: Partial<UserStorage>) => {
    setUser((prev) => {
      const merged = { ...DEFAULT_USER, ...(prev || {}), ...updatedUser };
      StorageHelper.set(STORAGE_KEYS.USER_DATA, JSON.stringify(merged));
      return merged;
    });
  }, []);

  useEffect(() => {
    const subscription = authEvents.addListener(() => {
      onLogout();
    });

    return () => {
      subscription.remove();
    };
  }, [onLogout]);

  const value = useMemo(
    () => ({
      user,
      token,
      isLogged: !!token,
      isLoadingUser,
      onSetUser,
      onSetToken,
      onLogout,
      signOut: onLogout,
    }),
    [user, token, isLoadingUser, onSetUser, onSetToken, onLogout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
