import { useCallback } from "react";
import { useAuth } from "./authorization";

export function useBackend() {
  const { token } = useAuth();
  const baseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
  const request = useCallback(
    async (url: string, options: RequestInit = {}) => {
      if (!baseUrl) {
        throw new Error("backend base url not available yet");
      }

      try {
        const requestInit: RequestInit = {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            ...options.headers,
          },
        };

        Object.assign(requestInit, options);

        const response = await fetch(baseUrl + url, requestInit);
        return response;
      } catch (error) {
        throw new Error("NETWORK_ERROR");
      }
    },
    [baseUrl, token],
  );
  const get = useCallback(async (url: string, options?: RequestInit) => request(url, options), [request, token]);

  const del = useCallback(
    async (url: string, options?: RequestInit) =>
      request(url, {
        method: "delete",
        ...options,
      }),
    [request],
  );

  const put = useCallback(
    async (url: string, data: unknown, options: RequestInit = {}) => {
      const requestInit: RequestInit = {
        method: "put",
        // credentials: "include",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      };

      Object.assign(requestInit, options);
      return request(url, requestInit);
    },
    [request, token],
  );

  const post = useCallback(
    async (url: string, data: unknown, options: RequestInit = {}) => {
      const requestInit: RequestInit = {
        method: "post",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
          ...options.headers,
        },
      };

      Object.assign(requestInit, options);
      return request(url, requestInit);
    },
    [request, token],
  );

  return { request, get, post, put, del };
}
