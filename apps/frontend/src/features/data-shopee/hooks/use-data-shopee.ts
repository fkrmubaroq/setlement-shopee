import { dataShopeeApi } from "@/services/api/data-shopee.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const dataShopeeKeys = {
  all: ["data-shopee"] as const,
};

export const useGetDataShopeeList = () => {
  return useQuery({
    queryKey: dataShopeeKeys.all,
    queryFn: async () => {
      const response = await dataShopeeApi.getAllDataShopee();
      return response.data || [];
    },
  });
};

export const useGetDataShopeeById = (id: number) => {
  return useQuery({
    queryKey: [...dataShopeeKeys.all, id],
    queryFn: async () => {
      const response = await dataShopeeApi.getDataShopeeById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateDataShopee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      dataShopeeApi.createDataShopee(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dataShopeeKeys.all });
    },
  });
};

export const useUpdateDataShopee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      dataShopeeApi.updateDataShopee(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dataShopeeKeys.all });
    },
  });
};

export const useDeleteDataShopee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => dataShopeeApi.deleteDataShopee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dataShopeeKeys.all });
    },
  });
};
