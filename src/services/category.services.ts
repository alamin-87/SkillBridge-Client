import { env } from "@/env";

const API_URL = env.API_URL;

export type Category = {
  id: string;
  name: string;
  tutorCount?: number; // optional if backend provides
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export const categoryService = {
  getCategories: async function () {
    try {
      const res = await fetch(`${API_URL}/api/categories`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to fetch categories");

      const json = (await res.json()) as ApiResponse<Category[]>;
      return { data: json.data ?? [], error: null };
    } catch (err) {
      return { data: [], error: { message: "error", err } };
    }
  },
};
