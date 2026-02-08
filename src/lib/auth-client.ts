import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: "https://skill-bridge-server-six.vercel.app",
  fetchOptions: {
    credentials: "include",
  },
});
// import { createAuthClient } from "better-auth/react";

// export const authClient = createAuthClient({
//   baseURL:
//     typeof window !== "undefined"
//       ? (process.env.NEXT_PUBLIC_TEST ?? window.location.origin)
//       : (process.env.NEXT_PUBLIC_TEST ?? ""),
//   fetchOptions: {
//     credentials: "include",
//   },
// });
