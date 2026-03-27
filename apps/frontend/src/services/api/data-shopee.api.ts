import { axiosInstance } from "@/lib/axios";
import type { ApiResponse, DataDetailShopee, DataShopee } from "@setlement-shopee/types";

export const dataShopeeApi = {
  getAllDataShopee: async (): Promise<ApiResponse<DataShopee[]>> => {
    return await axiosInstance.get("/data-shopee");
  },

  getDataShopeeById: async (id: number): Promise<DataDetailShopee> => {
    return await axiosInstance.get(`/data-shopee/${id}`);
  },

  createDataShopee: async (
    formData: FormData,
  ): Promise<ApiResponse<DataShopee>> => {
    return await axiosInstance.post("/data-shopee", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  updateDataShopee: async (
    id: number,
    formData: FormData,
  ): Promise<ApiResponse<DataShopee>> => {
    return await axiosInstance.put(`/data-shopee/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  deleteDataShopee: async (id: number): Promise<ApiResponse<null>> => {
    return await axiosInstance.delete(`/data-shopee/${id}`);
  },
};
