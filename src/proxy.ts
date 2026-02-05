import { NextRequest, NextResponse } from "next/server";
import { userService } from "./services/user.services";
enum UserRole {
  STUDENT = "STUDENT",
  ADMIN = "ADMIN",
  TUTOR = "TUTOR",
}
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const { data } = await userService.getSession();
  const user = data?.user;

  // 1) Not logged in → login
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const role = user.role;

  // Helper: decide home route per role
  const homeByRole = () => {
    if (role === UserRole.ADMIN) return "/admin";
    if (role === UserRole.TUTOR) return "/tutor/dashboard";
    return "/dashboard"; // student/default
  };

  // 2) Role-based route protection
  const isStudentRoute = pathname.startsWith("/dashboard");
  const isTutorRoute = pathname.startsWith("/tutor");
  const isAdminRoute = pathname.startsWith("/admin");

  // Admin trying to access student/tutor → send to admin
  if (role === UserRole.ADMIN && (isStudentRoute || isTutorRoute)) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Tutor trying to access admin/student → send to tutor dashboard
  if (role === UserRole.TUTOR && (isAdminRoute || isStudentRoute)) {
    return NextResponse.redirect(new URL("/tutor/dashboard", request.url));
  }

  // Student trying to access admin/tutor → send to student dashboard
  if (role === UserRole.STUDENT && (isAdminRoute || isTutorRoute)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Optional: if they open "/admin" but role is wrong, above already catches.
  // Optional: if they open root dashboards, you can normalize:
  // if (pathname === "/admin") ...

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/tutor",
    "/tutor/:path*",
    "/admin",
    "/admin/:path*",
  ],
};
