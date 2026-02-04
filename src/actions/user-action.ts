"use server";

import { userService } from "@/services/user.services";
export async function getSessionAction() {
  const { data, error } = await userService.getSession();
  if (error) return { user: null };
  return { user: data?.user ?? null };
}
// export async function logoutAction() {
//   await userService.logout();
//   return { ok: true };
// }
