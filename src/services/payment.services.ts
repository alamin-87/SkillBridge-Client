import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

async function withAuthHeaders(): Promise<Record<string, string> | undefined> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  return cookieHeader ? { Cookie: cookieHeader } : undefined;
}

export const paymentService = {
  async getMyPayments(params?: { page?: number; limit?: number }) {
    const url = new URL(`${API_URL}/api/v1/payments`);
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
        const txt = await res.text().catch(() => "");
        throw new Error(`getMyPayments failed: ${res.status} ${txt}`);
      }
      return res.json();
    } catch (err: any) {
      console.error(err);
      return { success: false, data: [] };
    }
  },

  async createPaymentIntent(bookingId: string) {
    try {
      const res = await fetch(`${API_URL}/api/v1/payments/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...((await withAuthHeaders()) ?? {}),
        },
        body: JSON.stringify({ bookingId }),
      });
      if (!res.ok) {
        throw new Error("Failed to create payment intent");
      }
      return res.json();
    } catch (error: any) {
      console.error(error);
      return { success: false, message: error.message };
    }
  }
};
