import { hppProdukApi } from "@/services/api/hpp-produk.api";
import type { CreateHppProdukBulkRequest, CreateHppProdukRequest, UpdateHppProdukRequest } from "@setlement-shopee/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const hppProdukKeys = {
  all: ["hpp-produk"] as const,
  list: (params: any) => ["hpp-produk", "list", params] as const,
  detail: (id: number) => ["hpp-produk", id] as const,
};

export const useGetHppProdukList = (params?: { page?: number; limit?: number; search?: string; id_brand?: number }) => {
  return useQuery({
    queryKey: hppProdukKeys.list(params),
    queryFn: async () => {
      const response = await hppProdukApi.getAllHppProduk(params);
      return response;
    },
  });
};

export const useCreateHppProduk = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateHppProdukRequest) => hppProdukApi.createHppProduk(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hppProdukKeys.all });
    },
  });
};

export const useBulkCreateHppProduk = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateHppProdukBulkRequest) => hppProdukApi.bulkCreateHppProduk(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hppProdukKeys.all });
    },
  });
};

export const useUpdateHppProduk = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateHppProdukRequest }) =>
      hppProdukApi.updateHppProduk(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: hppProdukKeys.all });
      queryClient.invalidateQueries({ queryKey: hppProdukKeys.detail(variables.id) });
    },
  });
};

export const useDeleteHppProduk = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idBrand, id }: { idBrand: number; id: number }) => hppProdukApi.deleteHppProduk(idBrand, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hppProdukKeys.all });
    },
  });
};

export const useClearHppProdukByBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (idBrand: number) => hppProdukApi.clearHppProdukByBrand(idBrand),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hppProdukKeys.all });
    },
  });
};
