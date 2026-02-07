"use server";

import { adminService } from "@/services/admin.services";
import { revalidatePath } from "next/cache";

// ✅ Dashboard
export async function getAdminDashboardAction() {
  try {
    const res = await adminService.getDashboard();
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to load dashboard" };
  }
}

// ✅ Users
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
  payload: { status?: "ACTIVE" | "BANNED"; role?: "STUDENT" | "TUTOR" | "ADMIN" }
) {
  try {
    const res = await adminService.updateUser(userId, payload);

    // revalidate admin users page
    revalidatePath("/admin/users");

    return { success: true, data: res.data, message: res.message || "User updated" };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to update user" };
  }
}

// ✅ Bookings
export async function getAdminBookingsAction() {
  try {
    const res = await adminService.getBookings();
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to load bookings" };
  }
}

// ✅ Categories
export async function getAdminCategoriesAction() {
  try {
    const res = await adminService.getCategories();
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to load categories" };
  }
}

export async function createAdminCategoryAction(payload: { name: string }) {
  try {
    const res = await adminService.createCategory(payload);

    revalidatePath("/admin/categories");

    return { success: true, data: res.data, message: res.message || "Category created" };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to create category" };
  }
}

export async function updateAdminCategoryAction(categoryId: string, payload: { name: string }) {
  try {
    const res = await adminService.updateCategory(categoryId, payload);

    revalidatePath("/admin/categories");

    return { success: true, data: res.data, message: res.message || "Category updated" };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to update category" };
  }
}

export async function deleteAdminCategoryAction(categoryId: string) {
  try {
    const res = await adminService.deleteCategory(categoryId);

    revalidatePath("/admin/categories");

    return { success: true, data: res.data, message: res.message || "Category deleted" };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to delete category" };
  }
}

export async function getAdminMeAction() {
  try {
    const res = await adminService.getMe();
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to load profile" };
  }
}

export async function updateAdminMeAction(payload: {
  name?: string;
  phone?: string | null;
  image?: string | null;
  email?: string;
}) {
  try {
    const res = await adminService.updateMe(payload);
    revalidatePath("/admin/profile");
    return { success: true, data: res.data, message: res.message || "Profile updated" };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to update profile" };
  }
}