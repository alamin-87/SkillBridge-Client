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
    const res = await fetch(`${API_URL}/api/admin`, {
      cache: "no-store",
      headers: { ...((await withAuthHeaders()) ?? {}) },
    });
    return handle(res, "getDashboard");
  },

  // Users
  async getUsers() {
    const res = await fetch(`${API_URL}/api/admin/users`, {
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
    const res = await fetch(`${API_URL}/api/admin/users/${userId}`, {
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
    const res = await fetch(`${API_URL}/api/admin/bookings`, {
      cache: "no-store",
      headers: { ...((await withAuthHeaders()) ?? {}) },
    });
    return handle(res, "getBookings");
  },

  //  Categories
  async getCategories() {
    const res = await fetch(`${API_URL}/api/admin/categories`, {
      cache: "no-store",
      headers: { ...((await withAuthHeaders()) ?? {}) },
    });
    return handle(res, "getCategories");
  },

  async createCategory(payload: { name: string }) {
    const res = await fetch(`${API_URL}/api/admin/categories`, {
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
    const res = await fetch(`${API_URL}/api/admin/categories/${categoryId}`, {
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
    const res = await fetch(`${API_URL}/api/admin/categories/${categoryId}`, {
      method: "DELETE",
      cache: "no-store",
      headers: { ...((await withAuthHeaders()) ?? {}) },
    });
    return handle(res, "deleteCategory");
  },
  async getMe() {
    const res = await fetch(`${API_URL}/api/user/me`, {
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

  async updateMe(payload: {
    name?: string;
    phone?: string | null;
    image?: string | null;
    email?: string;
  }) {
    const res = await fetch(`${API_URL}/api/user/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...((await withAuthHeaders()) ?? {}),
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`updateMe failed: ${res.status}`);
    return res.json();
  },
};
