"use server";

import { paymentService } from "@/services/payment.services";

export async function getMyPaymentsAction(params?: { page?: number; limit?: number }) {
  try {
    const res = await paymentService.getMyPayments(params);
    return res;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function createPaymentIntentAction(bookingId: string) {
  try {
    const res = await paymentService.createPaymentIntent(bookingId);
    return res;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
