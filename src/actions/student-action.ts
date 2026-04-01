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
export async function updateStudentProfileAction(payload: any | FormData) {
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
export async function getStudentByIdAction(userId: string) {
  try {
    if (!userId) {
      return {
        success: false,
        message: "User ID is required",
        data: null,
      };
    }

    const res = await studentService.getStudentById(userId);

    if (!res?.success) {
      return {
        success: false,
        message: res?.error || "Failed to fetch student",
        data: null,
      };
    }

    return {
      success: true,
      data: res.data,
      message: "Student loaded",
    };
  } catch (error: any) {
    console.error("getStudentByIdAction error:", error);
    const message = error.message || "Failed to fetch student";

    return {
      success: false,
      message: message.includes("404") ? `Student not found` : message,
      data: null,
    };
  }
}

// ─── Tutor Request Actions ────────────────────────────────────────────────
export async function requestToBecomeTutorAction(payload: {
  bio: string;
  hourlyRate: number;
  experienceYrs: number;
  location?: string;
  languages?: string;
  institution?: string;
  categories?: string[];
}) {
  try {
    const res = await studentService.requestToBecomeTutor(payload);
    return {
      success: true,
      data: res.data ?? null,
      message: res.message ?? "Request submitted",
    };
  } catch (err: any) {
    // Parse backend error message if available
    let msg = err?.message ?? "Failed to submit request";
    try {
      const parsed = JSON.parse(msg.split(/\d{3}\s/)[1] || "{}");
      if (parsed.message) msg = parsed.message;
    } catch {}
    return { success: false, data: null, message: msg };
  }
}

export async function getMyTutorRequestAction() {
  try {
    const res = await studentService.getMyTutorRequest();
    return { success: true, data: res.data ?? null };
  } catch {
    return { success: false, data: null };
  }
}

// ─── Reviews ──────────────────────────────────────────────────────────────
export async function getMyReviewsAction() {
  try {
    const res = await studentService.getMyReviews();
    return { success: true, data: res.data ?? [] };
  } catch {
    return { success: false, data: [] };
  }
}

export async function cancelBookingAction(bookingId: string, reason?: string) {
  try {
    const res = await studentService.cancelBooking(bookingId, reason);
    return {
      success: true,
      message: res.message ?? "Booking cancelled successfully",
    };
  } catch (err: any) {
    return {
      success: false,
    };
  }
}

export async function cancelTutorRequestAction() {
  try {
    const res = await studentService.cancelTutorRequest();
    return {
      success: true,
      message: res.message ?? "Request cancelled successfully",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Failed to cancel request",
    };
  }
}

export async function updateTutorRequestAction(payload: any) {
  try {
    const res = await studentService.updateMyTutorRequest(payload);
    return {
      success: true,
      message: res.message ?? "Request updated successfully",
      data: res.data ?? null,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Failed to update request",
    };
  }
}
