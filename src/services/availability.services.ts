import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

async function withAuthHeaders(): Promise<Record<string, string> | undefined> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString(); 
  return cookieHeader ? { Cookie: cookieHeader } : undefined;
}

export const availabilityService = {
  async getMyAvailability(tutorProfileId: string) {
    try {
      const res = await fetch(`${API_URL}/api/availability/${tutorProfileId}`, {
        cache: "no-store",
        headers: { ...((await withAuthHeaders()) ?? {}) },
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`getMyAvailability failed: ${res.status} ${txt}`);
      }
      
      const json = await res.json();
      return {
        success: true,
        data: json.data ?? [],
        error: null,
      };
    } catch (err: any) {
      return {
        success: false,
        data: [],
        error: err?.message ?? "Failed to fetch availability",
      };
    }
  },

  async createSlot(payload: { tutorProfileId: string; slots: Array<{ startTime: string; endTime: string }> }) {
    try {
      const headers = {
        "Content-Type": "application/json",
        ...((await withAuthHeaders()) ?? {}),
      };

      console.log("Creating slot with payload:", payload);
      console.log("Request headers:", { ...headers, Cookie: headers.Cookie ? "[set]" : "[none]" });

      const res = await fetch(`${API_URL}/api/availability`, {
        method: "POST",
        cache: "no-store",
        headers,
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      console.log(`API response (${res.status}):`, json);

      if (!res.ok) {
        const errorMsg = json?.message || json?.error || `HTTP ${res.status}`;
        throw new Error(`createSlot failed: ${errorMsg}`);
      }

      return {
        success: true,
        data: json.data ?? null,
        message: json.message ?? "Slot created",
        error: null,
      };
    } catch (err: any) {
      console.error("createSlot error:", err);
      return {
        success: false,
        data: null,
        message: "Failed to create slot",
        error: err?.message ?? "Unknown error",
      };
    }
  },
    // ✅ Update slot
  async updateSlot(payload: {
    availabilityId: string;
    startTime: string;
    endTime: string;
  }) {
    const res = await fetch(
      `${API_URL}/api/tutor/availability/${payload.availabilityId}`,
      {
        method: "PATCH",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          ...((await withAuthHeaders()) ?? {}),
        },
        body: JSON.stringify({
          startTime: payload.startTime,
          endTime: payload.endTime,
        }),
      },
    );

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(json?.message || `Update failed (HTTP ${res.status})`);
    }

    return json;
  },

  // ✅ Delete slot
  async deleteSlot(availabilityId: string) {
    const res = await fetch(`${API_URL}/api/availability/${availabilityId}`, {
      method: "DELETE",
      cache: "no-store",
      headers: { ...((await withAuthHeaders()) ?? {}) },
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(json?.message || `Delete failed (HTTP ${res.status})`);
    }

    return json;
  },
};