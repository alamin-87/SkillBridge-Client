import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

async function withAuthHeaders(): Promise<Record<string, string> | undefined> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  return cookieHeader ? { Cookie: cookieHeader } : undefined;
}

export const bookingService = {
  async createBooking(payload: {
    tutorProfileId: string;
    tutorId: string;
    availabilityId?: string;
    scheduledStart: string;
    scheduledEnd: string;
    price: number;
  }) {
    const res = await fetch(`${API_URL}/api/bookings`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...(await withAuthHeaders()),
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`createBooking failed: ${res.status} ${txt}`);
    }

    return res.json();
  },
};
