import { env } from "@/env";
import { cookies } from "next/headers";
const auth_url = env.AUTH_URL;
const backend_url = env.BACKEND_URL;

export const userService = {
  /**
   * Get session from Better Auth's built-in /get-session endpoint.
   * This is the most reliable server-side session check.
   */
  async getSession() {
    try {
      const cookieStore = await cookies();
      const cookieHeader = cookieStore.toString();

      if (!cookieHeader) {
        return { data: null, error: { message: "No cookies present" } };
      }

      const res = await fetch(`${auth_url}/get-session`, {
        headers: {
          cookie: cookieHeader,
        },
        cache: "no-store",
      });

      if (!res.ok) {
        return { data: null, error: { message: `Session check failed: ${res.status}` } };
      }

      const session = await res.json();
      return { data: session, error: null };
    } catch (err) {
      return { data: null, error: { message: "error", err } };
    }
  },

  /**
   * Get full user data from the custom /api/v1/auth/me endpoint.
   * Includes role, profile image, and other database fields.
   */
  async getMe() {
    try {
      const cookieStore = await cookies();
      const cookieHeader = cookieStore.toString();

      if (!cookieHeader) {
        return { data: null, error: { message: "No cookies present" } };
      }

      const res = await fetch(`${backend_url}/api/v1/auth/me`, {
        headers: {
          cookie: cookieHeader,
        },
        cache: "no-store",
      });

      // Check if the response is successful before parsing
      if (!res.ok) {
        return { data: null, error: { message: `Auth check failed: ${res.status}` } };
      }

      const data = await res.json();
      return { data: data.data, error: null };
    } catch (err) {
      return { data: null, error: { message: "error", err } };
    }
  },
};
