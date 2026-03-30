"use server";

import { tutorService } from "@/services/tutor.services";
import { Tutor } from "@/types";
type GetTutorsListParams = {
  search?: string;
  page?: number;
  limit?: number;
  sort?: "rating_desc" | "rating_asc" | "price_asc" | "price_desc" | string;
};
type TutorsMeta = {
  page: number;
  limit: number;
  total: number;
};
export async function getTutorsAction() {
  const { data, error, meta } = await tutorService.getTutors({ limit: 3 });
  if (error) return { tutors: [], meta: null };
  return { tutors: data ?? [], meta: meta ?? null };
}
export async function getTutorsListAction(params?: GetTutorsListParams) {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 12;
  const sort = params?.sort ?? "rating_desc";
  const search = params?.search?.trim() || undefined;

  const { data, meta, error } = await tutorService.getTutors({
    page,
    limit,
    sort,
    search,
  });

  if (error) {
    return {
      tutors: [] as Tutor[],
      meta: null as TutorsMeta | null,
      error: "Failed to load tutors",
    };
  }

  return {
    tutors: (data ?? []) as Tutor[],
    meta: (meta ?? null) as TutorsMeta | null,
    error: null as string | null,
  };
}
export async function getTutorByIdAction(id: string) {
  const { data, error } = await tutorService.getTutorById(id);

  if (error || !data) {
    return { tutor: null as Tutor | null };
  }

  return { tutor: data as Tutor };
}
export async function getTopRatedTutorsAction() {
  const { data, error } = await tutorService.getTutors({
    sort: "rating_desc",
    limit: 3,
  });

  if (error) return { tutors: [] };
  return { tutors: data };
}

export async function searchTutorsAction(query: string) {
  const { data, error } = await tutorService.getTutors({
    searchTerm: query,
    sort: "rating_desc",
    limit: 3,
  });

  if (error) return { tutors: [] };
  return { tutors: data };
}
export async function getTutorSessionsAction(params?: {
  page?: number;
  limit?: number;
}) {
  try {
    const json = await tutorService.getSessions(params);
    if (!json || !json.data) {
      return {
        success: true,
        data: [],
        meta: null,
        error: null,
      };
    }
    return {
      success: true,
      data: json.data,
      meta: json.meta ?? null,
      error: null,
    };
  } catch (err) {
    return {
      success: false,
      data: [],
      meta: null,
      error: err,
    };
  }
}
export async function getMyTutorProfileAction() {
  try {
    const res = await tutorService.getMyProfile();
    return { success: res.success, data: res.data ?? null, error: res.error };
  } catch (err) {
    return { success: false, data: null, error: err };
  }
}
export async function createMyTutorProfileAction(payload: {
  bio?: string;
  hourlyRate?: number;
  experienceYrs?: number;
  location?: string;
  languages?: string[] | string;
  profileImage?: string | null;
  categories?: string[];
}) {
  try {
    const json = await tutorService.createMyProfile(payload);
    return {
      success: true,
      data: json.data ?? null,
      message: json.message ?? "Created",
      error: null,
    };
  } catch (err: any) {
    return {
      success: false,
      data: null,
      message: "Create failed",
      error: { message: err?.message ?? "error", err },
    };
  }
}
export async function updateMyTutorProfileAction(payload: any | FormData) {
  try {
    if (payload instanceof FormData) {
      const json = await tutorService.updateMyProfile(payload);
      return {
        success: true,
        data: json.data ?? null,
        message: json.message ?? "Updated",
        error: null,
      };
    }

    // ✅ Backend expects 'languages' as a string, but frontend might send array
    const languagesStr = Array.isArray(payload.languages)
      ? payload.languages.join(", ")
      : payload.languages;

    const formattedPayload: any = {
      ...payload,
      languages: languagesStr,
    };
    if (formattedPayload.profileImage === null) {
      delete formattedPayload.profileImage;
    }

    const json = await tutorService.updateMyProfile(formattedPayload);
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

// ─── Assignment Actions ───────────────────────────────────────────────────
export async function createAssignmentAction(payload: {
  title: string;
  description?: string;
  bookingId?: string;
}) {
  try {
    const res = await tutorService.createAssignment(payload);
    return { success: true, data: res.data ?? null, message: res.message };
  } catch (err: any) {
    return { success: false, data: null, message: err?.message ?? "Failed" };
  }
}

export async function getTutorAssignmentsAction(params?: {
  page?: number;
  limit?: number;
}) {
  try {
    const res = await tutorService.getAssignments(params);
    return { success: true, data: res.data ?? [] };
  } catch {
    return { success: false, data: [] };
  }
}

export async function getTutorAssignmentDetailsAction(id: string) {
  try {
    const res = await tutorService.getAssignmentDetails(id);
    return { success: true, data: res.data ?? null };
  } catch {
    return { success: false, data: null };
  }
}

export async function evaluateSubmissionAction(
  assignmentId: string,
  submissionId: string,
  payload: { grade: number; feedback?: string }
) {
  try {
    const res = await tutorService.evaluateSubmission(
      assignmentId,
      submissionId,
      payload
    );
    return { success: true, data: res.data ?? null, message: res.message };
  } catch (err: any) {
    return { success: false, data: null, message: err?.message ?? "Failed" };
  }
}

// ─── Booking Actions ──────────────────────────────────────────────────────
export async function completeBookingAction(bookingId: string) {
  try {
    const res = await tutorService.completeBooking(bookingId);
    return { success: true, data: res.data ?? null, message: res.message };
  } catch (err: any) {
    return { success: false, data: null, message: err?.message ?? "Failed" };
  }
}

export async function cancelBookingAction(
  bookingId: string,
  reason?: string
) {
  try {
    const res = await tutorService.cancelBooking(bookingId, reason);
    return { success: true, data: res.data ?? null, message: res.message };
  } catch (err: any) {
    return { success: false, data: null, message: err?.message ?? "Failed" };
  }
}

// ─── Earnings ─────────────────────────────────────────────────────────────
export async function getTutorEarningsAction(params?: {
  page?: number;
  limit?: number;
}) {
  try {
    const res = await tutorService.getEarnings(params);
    return { success: true, data: res.data ?? [] };
  } catch {
    return { success: false, data: [] };
  }
}
