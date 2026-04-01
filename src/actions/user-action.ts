"use server";
import { userService } from "@/services/user.services";

export async function getSessionAction() {
  try {
    // Primary: try getMe for full user data (includes role, profile image, etc.)
    const { data: meData, error: meError } = await userService.getMe();
    if (!meError && meData) {
      return { user: meData };
    }

    // Fallback: use Better Auth's native session endpoint
    // This is more reliable as it goes directly through Better Auth's cookie parsing
    const { data: sessionData, error: sessionError } = await userService.getSession();
    if (!sessionError && sessionData?.user) {
      return {
        user: {
          id: sessionData.user.id,
          name: sessionData.user.name,
          email: sessionData.user.email,
          image: sessionData.user.image,
          role: sessionData.user.role || "STUDENT",
        },
      };
    }

    return { user: null };
  } catch {
    return { user: null };
  }
}
