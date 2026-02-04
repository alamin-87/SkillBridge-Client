import { env } from "@/env";
import { error } from "console";
import { cookies } from "next/headers";
const auth_url = env.AUTH_URL;
export const userService = {
  getSession: async function () {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${auth_url}/get-session`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });
      const session = await res.json();
      return { data: session, error: null };
    } catch (err) {
      return { data: null, error: { message: "error", err } };
    }
  },
//    logout: async function () {
//     try {
//       const cookieStore = await cookies();
//       const res = await fetch(`${auth_url}/api/auth/sign-out`, {
//         method: "POST",
//         headers: { Cookie: cookieStore.toString() },
//         cache: "no-store",
//       });

//       // backend should clear cookie via Set-Cookie
//       const data = await res.json().catch(() => ({}));
//       return { data, error: null };
//     } catch (err) {
//       return { data: null, error: { message: "error", err } };
//     }
//   },
};
