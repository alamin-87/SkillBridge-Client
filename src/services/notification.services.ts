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

export const notificationService = {
  async getMyNotifications() {
    const res = await fetch(`${API_URL}/api/v1/notifications`, {
      cache: "no-store",
      headers: { ...((await withAuthHeaders()) ?? {}) },
    });
    return handle(res, "getMyNotifications");
  },

  async markAsRead(notificationId: string) {
    const res = await fetch(`${API_URL}/api/v1/notifications/${notificationId}/read`, {
      method: "PATCH",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...((await withAuthHeaders()) ?? {}),
      },
    });
    return handle(res, "markAsRead");
  },

  async markAllAsRead() {
    const res = await fetch(`${API_URL}/api/v1/notifications/mark-all-read`, {
      method: "PATCH",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...((await withAuthHeaders()) ?? {}),
      },
    });
    return handle(res, "markAllAsRead");
  },
};
