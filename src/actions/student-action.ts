"use server";

import { studentService } from "@/services/student.services";

export async function getStudentMeAction() {
  try {
    const res = await studentService.getMe();
    return { success: true, data: res.data ?? null, error: null };
  } catch (err) {
    return { success: false, data: null, error: err };
  }
}
export async function updateStudentProfileAction(payload: {
  name?: string;
  phone?: string | null;
  image?: string | null;
}) {
  try {
    const json = await studentService.updateMe(payload);
    // console.log(json)
    return {
      success: true,
      data: json.data ?? null,
      message: json.message ?? "Updated",
      error: null,
    };
  } catch (err: any) {
    return {
      success: false,
      data: null,
      message: "Update failed",
      error: { message: err?.message ?? "error", err },
    };
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
