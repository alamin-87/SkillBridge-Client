import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

async function withAuthHeaders(): Promise<Record<string, string> | undefined> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  return cookieHeader ? { Cookie: cookieHeader } : undefined;
}

export const studentService = {
  async getMe() {
    const res = await fetch(`${API_URL}/api/v1/auth/me`, {
      cache: "no-store",
      headers: {
        ...((await withAuthHeaders()) ?? {}),
      },
    });

    if (!res.ok) {
      // helpful log
      const txt = await res.text().catch(() => "");
      throw new Error(`getMe failed: ${res.status} ${txt}`);
    }
    return res.json();
  },

  async getBookings(params?: { page?: number; limit?: number }) {
    const url = new URL(`${API_URL}/api/v1/bookings`);
    if (params?.page) url.searchParams.set("page", String(params.page));
    if (params?.limit) url.searchParams.set("limit", String(params.limit));

    const res = await fetch(url.toString(), {
      cache: "no-store",
      headers: {
        ...((await withAuthHeaders()) ?? {}),
      },
    });
    console.log(res);

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`getBookings failed: ${res.status} ${txt}`);
    }
    return res.json();
  },
  async updateMe(payload: any | FormData) {
    const isFormData = payload instanceof FormData;
    const headers: Record<string, string> = {
      ...((await withAuthHeaders()) ?? {}),
    };
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${API_URL}/api/v1/user/me`, {
      method: "PATCH",
      headers,
      body: isFormData ? payload : JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`updateMe failed: ${res.status}`);
    return res.json();
  },
  async getStudentById(userId: string) {
    if (!userId) throw new Error("userId is required");
    try {
      const res = await fetch(`${API_URL}/api/v1/user/${userId}`, {
        cache: "no-store",
        headers: {
          ...((await withAuthHeaders()) ?? {}),
        },
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`getStudentById failed: ${res.status} ${txt}`);
      }

      const json = await res.json();
      return {
        success: true,
        data: json?.data || json,
        error: null,
      };
    } catch (err: any) {
      console.error("getStudentById error:", err);
      return {
        success: false,
        data: null,
        error: err?.message ?? "Failed to fetch student",
      };
    }
  },

  // ─── Tutor Request ──────────────────────────────────────────────────────
  async requestToBecomeTutor(payload: {
    bio: string;
    hourlyRate: number;
    experienceYrs: number;
    location?: string;
    languages?: string;
  }) {
    const res = await fetch(`${API_URL}/api/v1/tutors/request`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...((await withAuthHeaders()) ?? {}),
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`requestToBecomeTutor failed: ${res.status} ${txt}`);
    }
    return res.json();
  },

  async getMyTutorRequest() {
    const res = await fetch(`${API_URL}/api/v1/tutors/my-request`, {
      cache: "no-store",
      headers: { ...((await withAuthHeaders()) ?? {}) },
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`getMyTutorRequest failed: ${res.status} ${txt}`);
    }
    return res.json();
  },

  // ─── Reviews ────────────────────────────────────────────────────────────
  async getMyReviews() {
    const res = await fetch(`${API_URL}/api/v1/reviews/me`, {
      cache: "no-store",
      headers: { ...((await withAuthHeaders()) ?? {}) },
    });
    if (!res.ok) return { success: false, data: [] };
    return res.json();
  },

  async cancelBooking(bookingId: string, reason?: string) {
    const res = await fetch(`${API_URL}/api/v1/bookings/${bookingId}/cancel`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...((await withAuthHeaders()) ?? {}),
      },
      body: JSON.stringify({ reason }),
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`cancelBooking failed: ${res.status} ${txt}`);
    }
    return res.json();
  },
};
