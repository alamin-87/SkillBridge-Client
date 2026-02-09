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
    search: query,
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
export async function updateMyTutorProfileAction(payload: {
  bio?: string;
  hourlyRate?: number;
  experienceYrs?: number;
  location?: string;
  languages?: string[] | string;
  profileImage?: string | null;
  categories?: string[];
}) {
  try {
    const json = await tutorService.updateMyProfile(payload);
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
