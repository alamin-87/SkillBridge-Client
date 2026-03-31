import { env } from "@/env";
import { cookies } from "next/headers";
const auth_url = env.AUTH_URL;
export const userService = {
  async getSession() {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${auth_url}/get-session`, {
        headers: {
          cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });
      const session = await res.json();
      return { data: session, error: null };
    } catch (err) {
      return { data: null, error: { message: "error", err } };
    }
  },
  async getMe() {
    try {
      const cookieStore = await cookies();
      const backend_url = env.BACKEND_URL;
      const res = await fetch(`${backend_url}/api/v1/auth/me`, {
        headers: {
          cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });
      const data = await res.json();
      return { data: data.data, error: null };
    } catch (err) {
      return { data: null, error: { message: "error", err } };
    }
  },
};
