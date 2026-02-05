import { env } from "@/env";
import { Tutor } from "@/types";

const API_URL = env.API_URL;


type GetTutorsParams = {
  search?: string;
  limit?: number;
  page?: number;
  sort?: "rating_desc" | "rating_asc" | string;
};

export const tutorService = {
  getTutors: async function (params?: GetTutorsParams) {
    try {
      const url = new URL(`${API_URL}/api/tutor`);

      if (params?.search) url.searchParams.set("search", params.search);
      if (params?.limit) url.searchParams.set("limit", String(params.limit));
      if (params?.page) url.searchParams.set("page", String(params.page));
      if (params?.sort) url.searchParams.set("sort", params.sort);

      const res = await fetch(url.toString(), { cache: "no-store" });

      if (!res.ok) throw new Error("Failed to fetch tutors");

      const json = await res.json();

      return {
        data: json.data ?? [],
        meta: json.meta ?? null,
        success: json.success ?? true,
        error: null,
      };
    } catch (err) {
      return {
        data: [],
        meta: null,
        success: false,
        error: { message: "error", err },
      };
    }
  },
};
