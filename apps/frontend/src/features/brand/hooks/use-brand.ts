import { brandApi } from "@/services/api/brand.api";
import type { CreateBrandRequest, UpdateBrandRequest } from "@setlement-shopee/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const brandKeys = {
  all: ["brands"] as const,
  detail: (id: number) => ["brands", id] as const,
};

export const useGetBrands = () => {
  return useQuery({
    queryKey: brandKeys.all,
    queryFn: async () => {
      const response = await brandApi.getAllBrands();
      return response.data || [];
    },
  });
};

export const useGetBrand = (id: number) => {
  return useQuery({
    queryKey: brandKeys.detail(id),
    queryFn: async () => {
      const response = await brandApi.getBrandById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBrandRequest) => brandApi.createBrand(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.all });
    },
  });
};

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBrandRequest }) =>
      brandApi.updateBrand(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: brandKeys.all });
      queryClient.invalidateQueries({ queryKey: brandKeys.detail(variables.id) });
    },
  });
};

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => brandApi.deleteBrand(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.all });
    },
  });
};
