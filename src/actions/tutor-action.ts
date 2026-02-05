"use server";

import { tutorService } from "@/services/tutor.services";

export async function getTutorsAction() {
  const { data, error, meta } = await tutorService.getTutors({ limit: 3 });
  if (error) return { tutors: [], meta: null };
  return { tutors: data ?? [], meta: meta ?? null };
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
