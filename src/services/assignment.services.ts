import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

async function withAuthHeaders(): Promise<Record<string, string> | undefined> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  return cookieHeader ? { Cookie: cookieHeader } : undefined;
}

export const assignmentService = {
  async getAssignments(params?: { page?: number; limit?: number }) {
    const url = new URL(`${API_URL}/api/v1/assignments`);
    if (params?.page) url.searchParams.set("page", String(params.page));
    if (params?.limit) url.searchParams.set("limit", String(params.limit));

    try {
      const res = await fetch(url.toString(), {
        cache: "no-store",
        headers: {
          ...((await withAuthHeaders()) ?? {}),
        },
      });
      if (!res.ok) {
        throw new Error(`getAssignments failed`);
      }
      return res.json();
    } catch (err: any) {
      console.error(err);
      return { success: false, data: [] };
    }
  },

  async getAssignmentDetails(id: string) {
    try {
      const res = await fetch(`${API_URL}/api/v1/assignments/${id}`, {
        cache: "no-store",
        headers: {
          ...((await withAuthHeaders()) ?? {}),
        },
      });
      if (!res.ok) throw new Error("Failed to fetch assignment details");
      return res.json();
    } catch (err: any) {
      console.error(err);
      return { success: false, data: null };
    }
  },

  async submitAssignment(id: string, formData: FormData) {
    try {
      const auth = await withAuthHeaders();
      const headers: Record<string, string> = {};
      if (auth?.Cookie) headers.Cookie = auth.Cookie;
      
      const res = await fetch(`${API_URL}/api/v1/assignments/${id}/submit`, {
        method: "POST",
        headers, // Do not set Content-Type because it's multipart/form-data with boundary
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to submit assignment");
      }
      return res.json();
    } catch (error: any) {
      console.error(error);
      return { success: false, message: error.message };
    }
  }
};
