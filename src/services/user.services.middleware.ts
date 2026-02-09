import { env } from "@/env";

const auth_url = env.AUTH_URL;

export const userServiceMiddleware = {
  async getSession(cookieHeader: string) {
    try {
      const res = await fetch(`${auth_url}/get-session`, {
        headers: {
          cookie: cookieHeader,
        },
        cache: "no-store",
      });

      const session = await res.json();
      return { data: session, error: null };
    } catch (err) {
      return { data: null, error: { message: "error", err } };
    }
  },
};
