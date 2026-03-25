import { axiosInstance } from "@/lib/axios";
import type {
  ApiResponse,
  CreateHppProdukBulkRequest,
  CreateHppProdukRequest,
  HppProduk,
  PaginatedResponse,
  UpdateHppProdukRequest,
} from "@setlement-shopee/types";

export const hppProdukApi = {
  getAllHppProduk: async (params?: { page?: number; limit?: number; search?: string; id_brand?: number }): Promise<PaginatedResponse<HppProduk>> => {
    return await axiosInstance.get("/hpp-produk", { params });
  },

  createHppProduk: async (data: CreateHppProdukRequest): Promise<ApiResponse<HppProduk>> => {
    return await axiosInstance.post("/hpp-produk", data);
  },

  bulkCreateHppProduk: async (data: CreateHppProdukBulkRequest): Promise<ApiResponse<{ insertedCount: number }>> => {
    return await axiosInstance.post("/hpp-produk/bulk", data);
  },

  updateHppProduk: async (id: number, data: UpdateHppProdukRequest): Promise<ApiResponse<HppProduk>> => {
    return await axiosInstance.put(`/hpp-produk/${id}`, data);
  },

  deleteHppProduk: async (idBrand: number, id: number): Promise<ApiResponse<void>> => {
    return await axiosInstance.delete(`/hpp-produk/${idBrand}/${id}`);
  },

  clearHppProdukByBrand: async (idBrand: number): Promise<ApiResponse<{ deletedCount: number }>> => {
    return await axiosInstance.delete(`/hpp-produk/clear/${idBrand}`);
  },
};
