import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

async function withAuthHeaders(): Promise<Record<string, string> | undefined> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  return cookieHeader ? { Cookie: cookieHeader } : undefined;
}

async function handle(res: Response, label: string) {
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`${label} failed: ${res.status} ${txt}`);
  }
  return res.json();
}

export const adminService = {
  // Dashboard Stats
  async getDashboard() {
    const res = await fetch(`${API_URL}/api/v1/stats/admin`, {
      cache: "no-store",
      headers: { ...((await withAuthHeaders()) ?? {}) },
    });
    return handle(res, "getDashboard");
  },

  // Users
  async getUsers() {
    const res = await fetch(`${API_URL}/api/v1/admin/users`, {
      cache: "no-store",
      headers: { ...((await withAuthHeaders()) ?? {}) },
    });
    return handle(res, "getUsers");
  },

  async updateUser(
    userId: string,
    payload: {
      status?: "ACTIVE" | "BANNED";
      role?: "STUDENT" | "TUTOR" | "ADMIN";
    },
  ) {
    const res = await fetch(`${API_URL}/api/v1/admin/users/${userId}`, {
      method: "PATCH",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...((await withAuthHeaders()) ?? {}),
      },
      body: JSON.stringify(payload),
    });
    return handle(res, "updateUser");
  },

  //  Bookings
  async getBookings() {
    const res = await fetch(`${API_URL}/api/v1/admin/bookings`, {
      cache: "no-store",
      headers: { ...((await withAuthHeaders()) ?? {}) },
    });
    return handle(res, "getBookings");
  },

  //  Categories
  async getCategories() {
    const res = await fetch(`${API_URL}/api/v1/admin/categories`, {
      cache: "no-store",
      headers: { ...((await withAuthHeaders()) ?? {}) },
    });
    return handle(res, "getCategories");
  },

  async createCategory(payload: { name: string }) {
    const res = await fetch(`${API_URL}/api/v1/admin/categories`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...((await withAuthHeaders()) ?? {}),
      },
      body: JSON.stringify(payload),
    });
    return handle(res, "createCategory");
  },

  async updateCategory(categoryId: string, payload: { name: string }) {
    const res = await fetch(`${API_URL}/api/v1/admin/categories/${categoryId}`, {
      method: "PATCH",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...((await withAuthHeaders()) ?? {}),
      },
      body: JSON.stringify(payload),
    });
    return handle(res, "updateCategory");
  },

  async deleteCategory(categoryId: string) {
    const res = await fetch(`${API_URL}/api/v1/admin/categories/${categoryId}`, {
      method: "DELETE",
      cache: "no-store",
      headers: { ...((await withAuthHeaders()) ?? {}) },
    });
    return handle(res, "deleteCategory");
  },
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

  // ─── Tutor Request Management (Admin) ─────────────────────────────────
  async getTutorRequests() {
    const res = await fetch(`${API_URL}/api/v1/tutors/requests`, {
      cache: "no-store",
      headers: { ...((await withAuthHeaders()) ?? {}) },
    });
    return handle(res, "getTutorRequests");
  },

  async getPendingTutorRequests() {
    const res = await fetch(`${API_URL}/api/v1/tutors/requests/pending`, {
      cache: "no-store",
      headers: { ...((await withAuthHeaders()) ?? {}) },
    });
    return handle(res, "getPendingTutorRequests");
  },

  async approveTutorRequest(requestId: string) {
    const res = await fetch(
      `${API_URL}/api/v1/tutors/requests/${requestId}/approve`,
      {
        method: "PATCH",
        cache: "no-store",
        headers: { ...((await withAuthHeaders()) ?? {}) },
      }
    );
    return handle(res, "approveTutorRequest");
  },

  async rejectTutorRequest(requestId: string, rejectionReason: string) {
    const res = await fetch(
      `${API_URL}/api/v1/tutors/requests/${requestId}/reject`,
      {
        method: "PATCH",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          ...((await withAuthHeaders()) ?? {}),
        },
        body: JSON.stringify({ rejectionReason }),
      }
    );
    return handle(res, "rejectTutorRequest");
  },

  async createTutor(payload: {
    email: string;
    password: string;
    name: string;
    tutor: {
      bio: string;
      hourlyRate: number;
      experienceYrs: number;
      location?: string;
      languages?: string;
    };
  }) {
    const res = await fetch(`${API_URL}/api/v1/tutors`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...((await withAuthHeaders()) ?? {}),
      },
      body: JSON.stringify(payload),
    });
    return handle(res, "createTutor");
  },
};
