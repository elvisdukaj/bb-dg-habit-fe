import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { login as apiLogin, register as apiRegister } from "../api/auth";
import type { LoginRequest, RegisterRequest } from "../api/auth";

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(localStorage.getItem("access_token"))
  );

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(Boolean(token));
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    const { access_token } = await apiLogin(data);
    localStorage.setItem("access_token", access_token);
    setIsAuthenticated(true);
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    await apiRegister(data);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
