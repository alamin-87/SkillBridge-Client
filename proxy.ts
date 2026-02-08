import { userService } from "@/services/user.services";
import { NextRequest, NextResponse } from "next/server";
enum UserRole {
  STUDENT = "STUDENT",
  ADMIN = "ADMIN",
  TUTOR = "TUTOR",
}
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const { data } = await userService.getSession();
  const user = data?.user;
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  const role = user.role;
  const homeByRole = () => {
    if (role === UserRole.ADMIN) return "/admin";
    if (role === UserRole.TUTOR) return "/tutor/dashboard";
    return "/dashboard"; 
  };
  const isStudentRoute = pathname.startsWith("/dashboard");
  const isTutorRoute = pathname.startsWith("/tutor");
  const isAdminRoute = pathname.startsWith("/admin");
  if (role === UserRole.ADMIN && (isStudentRoute || isTutorRoute)) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  if (role === UserRole.TUTOR && (isAdminRoute || isStudentRoute)) {
    return NextResponse.redirect(new URL("/tutor/dashboard", request.url));
  }
  if (role === UserRole.STUDENT && (isAdminRoute || isTutorRoute)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

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
