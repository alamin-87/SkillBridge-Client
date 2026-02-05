"use server";

import { categoryService } from "@/services/category.services";



export async function getCategoriesAction() {
  const { data, error } = await categoryService.getCategories();
  if (error) return { categories: [], error: "Failed to load categories" };
  return { categories: data ?? [], error: null };
}
