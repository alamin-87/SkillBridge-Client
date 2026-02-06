"use server";

import { studentService } from "@/services/student.services";

export async function getStudentMeAction() {
  try {
    const res = await studentService.getMe(); // GET /api/auth/me OR /api/user/me (your backend is /me)
    return { success: true, data: res.data ?? null, error: null };
  } catch (err) {
    return { success: false, data: null, error: err };
  }
}

export async function getStudentBookingsAction(params?: {
  page?: number;
  limit?: number;
}) {
  try {
    const res = await studentService.getBookings(params); // GET /api/bookings
    return {
      success: true,
      data: res.data ?? [],
      meta: res.meta ?? null,
      error: null,
    };
  } catch (err) {
    return { success: false, data: [], meta: null, error: err };
  }
}
