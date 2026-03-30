"use server";

import { categoryService } from "@/services/category.services";



export async function getCategoriesAction(searchParams?: { [key: string]: string | string[] | undefined }) {
  const { data, meta, error } = await categoryService.getCategories(searchParams);
  if (error) return { categories: [], meta: null, error: "Failed to load categories" };
  return { categories: data ?? [], meta: meta ?? null, error: null };
}
