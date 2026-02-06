
"use server";

import { bookingService } from "@/services/booking.services";


export async function createBookingAction(payload: {
  tutorProfileId: string;
  tutorId: string;
  availabilityId?: string;
  scheduledStart: string;
  scheduledEnd: string;
  price: number;
}) {
  try {
    const json = await bookingService.createBooking(payload);
    return { success: true, data: json.data ?? null, message: json.message ?? "Booked", error: null };
  } catch (err: any) {
    return { success: false, data: null, message: "Booking failed", error: { message: err?.message ?? "error", err } };
  }
}
