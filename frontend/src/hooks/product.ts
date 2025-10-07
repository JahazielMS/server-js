import type { Product } from "../types";
import { useBackend } from "./backend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const ModelKey = "Products";

export function useProductsAdd() {
  const { post } = useBackend();
  const client = useQueryClient();

  return useMutation({
    mutationKey: ["products", "add"],
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["products"], exact: true });
    },
    mutationFn: async (product: Omit<Product, "id">) => {
      const response = await post("/products", product);
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || `Error ${response.status}`);
      }

      const data = await response.json();
      return data.product;
    },
  });
}

export function useProductsUpdate() {
  const { put } = useBackend();
  const client = useQueryClient();

  return useMutation({
    mutationKey: [ModelKey, "update"],
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [ModelKey], exact: true });
    },
    mutationFn: async (product: Product) => {
      const response = await put(`/products/${product.id}`, product);
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || `Error ${response.status}`);
      }

      const data = await response.json();
      return data.product;
    },
  });
}

export function useProducts() {
  const { get } = useBackend();

  return useQuery({
    queryKey: [ModelKey],
    refetchOnWindowFocus: true,
    initialData: [],
    queryFn: async () => {
      const response = await get("/products");
      if (!response.ok) {
        throw new Error("No se cargaron las sucursales");
      }
      const data = await response.json();
      const productos = data.products as Product[];

      return productos;
    },
  });
}

export function useProductsDelete() {
  const { del } = useBackend();
  const client = useQueryClient();

  return useMutation({
    mutationKey: [ModelKey, "delete"],
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [ModelKey], exact: true });
    },
    mutationFn: async (productId: number) => {
      const response = await del(`/products/${productId}`);
      if (!response.ok) {
        throw new Error("No se pudo eliminar el producto");
      }
    },
  });
}
