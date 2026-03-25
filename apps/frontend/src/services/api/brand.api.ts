import { axiosInstance } from "@/lib/axios";
import type { ApiResponse, Brand, CreateBrandRequest, UpdateBrandRequest } from "@setlement-shopee/types";

export const brandApi = {
  getAllBrands: async (): Promise<ApiResponse<Brand[]>> => {
    return await axiosInstance.get("/brand");
  },

  getBrandById: async (id: number): Promise<ApiResponse<Brand>> => {
    return await axiosInstance.get(`/brand/${id}`);
  },

  createBrand: async (data: CreateBrandRequest): Promise<ApiResponse<Brand>> => {
    return await axiosInstance.post("/brand", data);
  },

  updateBrand: async (id: number, data: UpdateBrandRequest): Promise<ApiResponse<Brand>> => {
    return await axiosInstance.put(`/brand/${id}`, data);
  },

  deleteBrand: async (id: number): Promise<ApiResponse<void>> => {
    return await axiosInstance.delete(`/brand/${id}`);
  },
};
