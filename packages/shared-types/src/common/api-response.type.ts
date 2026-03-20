export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  error?: unknown;
};

export type PaginatedResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
