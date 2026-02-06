import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

async function withAuthHeaders(): Promise<Record<string, string> | undefined> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString(); // ✅ all cookies in one header
  return cookieHeader ? { Cookie: cookieHeader } : undefined;
}

export const studentService = {
  async getMe() {
    const res = await fetch(`${API_URL}/api/user/me`, {
      cache: "no-store",
      headers: {
        ...(await withAuthHeaders() ?? {}),
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
    const url = new URL(`${API_URL}/api/bookings`);
    if (params?.page) url.searchParams.set("page", String(params.page));
    if (params?.limit) url.searchParams.set("limit", String(params.limit));

    const res = await fetch(url.toString(), {
      cache: "no-store",
      headers: {
        ...(await withAuthHeaders() ?? {}),
      },
    });
    console.log(res)

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`getBookings failed: ${res.status} ${txt}`);
    }
    return res.json();
  },
};
