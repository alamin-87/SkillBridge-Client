import { env } from "@/env";
import { Tutor } from "@/types";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

type GetTutorsParams = {
  search?: string;
  categoryId?: string;
  limit?: number;
  page?: number;
  sort?: "rating_desc" | "rating_asc" | string;
};
type ApiResponse<T> = {
  success: boolean;
  data: T;
  meta?: any;
};
async function withAuthHeaders(): Promise<Record<string, string> | undefined> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  return cookieHeader ? { Cookie: cookieHeader } : undefined;
}

export const tutorService = {
  getTutors: async function (params?: GetTutorsParams) {
    try {
      const url = new URL(`${API_URL}/api/tutor`);

      if (params?.search) url.searchParams.set("search", params.search);
      if (params?.categoryId)
        url.searchParams.set("categoryId", params.categoryId);
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
  getTutorById: async function (id: string) {
    try {
      const res = await fetch(`${API_URL}/api/tutor/${id}`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to fetch tutor");

      const json = (await res.json()) as ApiResponse<any>;

      return { data: json.data ?? null, error: null };
    } catch (err) {
      return { data: null, error: { message: "error", err } };
    }
  },
  async getSessions(params?: { page?: number; limit?: number }) {
    const url = new URL(`${API_URL}/api/bookings`);
    if (params?.page) url.searchParams.set("page", String(params.page));
    if (params?.limit) url.searchParams.set("limit", String(params.limit));

    const res = await fetch(url.toString(), {
      cache: "no-store",
      headers: {
        ...(await withAuthHeaders()),
      },
    });

    if (!res.ok) throw new Error("Failed to fetch tutor sessions");
    return res.json();
  },
  async getMyProfile() {
    const res = await fetch(`${API_URL}/api/tutor/profile`, {
      cache: "no-store",
      headers: {
        ...((await withAuthHeaders()) ?? {}),
      },
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`getMyProfile failed: ${res.status} ${txt}`);
    }
    return res.json();

  },

  async updateMyProfile(payload: {
    bio?: string;
    hourlyRate?: number;
    experienceYrs?: number;
    location?: string;
    languages?: string[] | string;
    profileImage?: string | null;
    categories?: string[];
  }) {
    const res = await fetch(`${API_URL}/api/tutor/profile`, {
      method: "PATCH",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...((await withAuthHeaders()) ?? {}),
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`updateMyProfile failed: ${res.status} ${txt}`);
    }

    return res.json();
  },
};
