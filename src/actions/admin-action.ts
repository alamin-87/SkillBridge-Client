"use server";

import { adminService } from "@/services/admin.services";
import { revalidatePath } from "next/cache";

// Dashboard
export async function getAdminDashboardAction() {
  try {
    const res = await adminService.getDashboard();
    return { success: true, data: res.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to load dashboard",
    };
  }
}

// Users
export async function getAdminUsersAction() {
  try {
    const res = await adminService.getUsers();
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to load users" };
  }
}

export async function updateAdminUserAction(
  userId: string,
  payload: {
    status?: "ACTIVE" | "BANNED";
    role?: "STUDENT" | "TUTOR" | "ADMIN";
  },
) {
  try {
    const res = await adminService.updateUser(userId, payload);

    // revalidate admin users page
    revalidatePath("/admin/users");

    return {
      success: true,
      data: res.data,
      message: res.message || "User updated",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update user",
    };
  }
}

// Bookings
export async function getAdminBookingsAction() {
  try {
    const res = await adminService.getBookings();
    return { success: true, data: res.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to load bookings",
    };
  }
}

// Categories
export async function getAdminCategoriesAction() {
  try {
    const res = await adminService.getCategories();
    return { success: true, data: res.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to load categories",
    };
  }
}

export async function createAdminCategoryAction(payload: { name: string }) {
  try {
    const res = await adminService.createCategory(payload);

    revalidatePath("/admin/categories");

    return {
      success: true,
      data: res.data,
      message: res.message || "Category created",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create category",
    };
  }
}

export async function updateAdminCategoryAction(
  categoryId: string,
  payload: { name: string },
) {
  try {
    const res = await adminService.updateCategory(categoryId, payload);

    revalidatePath("/admin/categories");

    return {
      success: true,
      data: res.data,
      message: res.message || "Category updated",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update category",
    };
  }
}

export async function deleteAdminCategoryAction(categoryId: string) {
  try {
    const res = await adminService.deleteCategory(categoryId);

    revalidatePath("/admin/categories");

    return {
      success: true,
      data: res.data,
      message: res.message || "Category deleted",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete category",
    };
  }
}

export async function getAdminMeAction() {
  try {
    const res = await adminService.getMe();
    return { success: true, data: res.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to load profile",
    };
  }
}

export async function updateAdminMeAction(payload: any | FormData) {
  try {
    const res = await adminService.updateMe(payload);
    revalidatePath("/admin/profile");
    return {
      success: true,
      data: res.data,
      message: res.message || "Profile updated",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update profile",
    };
  }
}

// ─── Tutor Request Management ──────────────────────────────────────────
export async function getTutorRequestsAction() {
  try {
    const res = await adminService.getTutorRequests();
    return { success: true, data: res.data ?? [] };
  } catch (error: any) {
    return { success: false, data: [], message: error.message };
  }
}

export async function getPendingTutorRequestsAction() {
  try {
    const res = await adminService.getPendingTutorRequests();
    return { success: true, data: res.data ?? [] };
  } catch (error: any) {
    return { success: false, data: [], message: error.message };
  }
}

export async function approveTutorRequestAction(requestId: string) {
  try {
    const res = await adminService.approveTutorRequest(requestId);
    revalidatePath("/admin/tutor-requests");
    return { success: true, data: res.data, message: res.message ?? "Approved" };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to approve" };
  }
}

export async function rejectTutorRequestAction(
  requestId: string,
  rejectionReason: string
) {
  try {
    const res = await adminService.rejectTutorRequest(requestId, rejectionReason);
    revalidatePath("/admin/tutor-requests");
    return { success: true, data: res.data, message: res.message ?? "Rejected" };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to reject" };
  }
}

export async function createTutorAction(payload: {
  email: string;
  password: string;
  name: string;
  tutor: {
    bio: string;
    hourlyRate: number;
    experienceYrs: number;
    location?: string;
    languages?: string;
  };
}) {
  try {
    const res = await adminService.createTutor(payload);
    revalidatePath("/admin/tutor-requests");
    return { success: true, data: res.data, message: res.message ?? "Tutor created" };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to create tutor" };
  }
}
