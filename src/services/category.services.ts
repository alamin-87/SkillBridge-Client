import { env } from "@/env";

const API_URL = env.API_URL;

export type Category = {
  id: string;
  name: string;
  icon?: string;
  tutorCount?: number;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  meta?: any;
};

export const categoryService = {
  getCategories: async function (query?: Record<string, any>) {
    try {
      const q = new URLSearchParams();
      if (query) {
        Object.entries(query).forEach(([k, v]) => {
          if (v !== undefined && v !== "") {
             q.append(k, String(v));
          }
        });
      }

      const queryString = q.toString() ? `?${q.toString()}` : "";
      const res = await fetch(`${API_URL}/api/categories${queryString}`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to fetch categories");

      const json = (await res.json()) as ApiResponse<Category[]>;
      return { data: json.data ?? [], meta: json.meta ?? null, error: null };
    } catch (err) {
      return { data: [], meta: null, error: { message: "error", err } };
    }
  },
};
