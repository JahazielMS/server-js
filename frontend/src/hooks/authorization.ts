import { useCallback, useState } from "react";
import type { User } from "../types";
import { useNavigate } from "react-router-dom";

export function useAuth() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(() => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const authenticate = useCallback((user: User, token: string) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    setUser(user);
    setToken(token);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    navigate("/");
  }, []);

  const checkAuth = useCallback(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  return { user, token, authenticate, logout, checkAuth };
}
