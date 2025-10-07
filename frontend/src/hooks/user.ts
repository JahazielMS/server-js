import type { Register } from "../types";
import { useBackend } from "./backend";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const ModelKey = "Users";

export function useRegister() {
  const { post } = useBackend();
  const client = useQueryClient();

  return useMutation({
    mutationKey: [ModelKey, "register"],
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [ModelKey], exact: true });
    },
    mutationFn: async (user: Register) => {
      const response = await post("/auth/register", user);
      if (!response.ok) {
        const data = await response.json();
        throw data;
      }
      const data = await response.json();
      return data.user;
    },
  });
}
