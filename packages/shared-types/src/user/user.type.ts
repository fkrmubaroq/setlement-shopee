export type User = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type UserProfile = {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
};
