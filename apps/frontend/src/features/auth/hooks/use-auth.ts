import { authApi } from "@/services/api";
import { useAuthStore } from "@/store";
import { useMutation } from "@tanstack/react-query";
import type { LoginFormValues, RegisterFormValues } from "../schemas/auth.schema";

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: LoginFormValues) => authApi.login(data),
    onSuccess: (response) => {
      if (response.data) {
        const { auth, user } = response.data;
        setAuth(user, auth.accessToken, auth.refreshToken);
        document.location = "/admin"
      }
    },
  });
};

export const useRegister = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: RegisterFormValues) => authApi.register(data),
    onSuccess: (response) => {
      if (response.data) {
        const { auth, user } = response.data;
        setAuth(user, auth.accessToken, auth.refreshToken);
      }
    },
  });
};

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);

  return { logout };
};
