"use server";
import { userService } from "@/services/user.services";
export async function getSessionAction() {
  const { data, error } = await userService.getMe();
  if (error) return { user: null };
  return { user: data ?? null };
}
