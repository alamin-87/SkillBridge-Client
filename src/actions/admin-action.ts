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
export async function getAdminUsersAction(query?: {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const res = await adminService.getUsers(query);
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

// ─── Payment Actions ────────────────────────────────────────────────
export async function getAdminPaymentsAction() {
  try {
    const res = await adminService.getPayments();
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, data: [], message: error.message || "Failed to load payments" };
  }
}

// ─── Review Actions ─────────────────────────────────────────────────
export async function getAdminReviewsAction() {
  try {
    const res = await adminService.getReviews();
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, data: [], message: error.message || "Failed to load reviews" };
  }
}

export async function deleteAdminReviewAction(reviewId: string) {
  try {
    const res = await adminService.deleteReview(reviewId);
    revalidatePath("/admin/reviews");
    return { success: true, data: res.data, message: res.message ?? "Review deleted" };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to delete review" };
  }
}

// ─── Assignment Actions ─────────────────────────────────────────────
export async function getAdminAssignmentsAction() {
  try {
    const res = await adminService.getAssignments();
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, data: [], message: error.message || "Failed to load assignments" };
  }
}

export async function deleteAdminAssignmentAction(assignmentId: string) {
  try {
    const res = await adminService.deleteAssignment(assignmentId);
    revalidatePath("/admin/assignments");
    return { success: true, data: res.data, message: res.message ?? "Assignment deleted" };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to delete assignment" };
  }
}

// ─── User Deletion ──────────────────────────────────────────────────
export async function deleteAdminUserAction(userId: string) {
  try {
    const res = await adminService.deleteUser(userId);
    revalidatePath("/admin/users");
    return { success: true, data: res.data, message: res.message ?? "User deleted" };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to delete user" };
  }
}

export async function updateAdminBookingStatusAction(
  bookingId: string,
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED"
) {
  try {
    const res = await adminService.updateBookingStatus(bookingId, status);
    revalidatePath("/admin/bookings");
    return {
      success: true,
      data: res.data,
      message: res.message || `Booking ${status.toLowerCase()}`,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update booking status",
    };
  }
}

// ─── Notification Actions ───────────────────────────────────────────
export async function getAdminNotificationsAction() {
  try {
    const res = await adminService.getAllNotifications();
    return { success: true, data: res.data };
  } catch (error: any) {
    return {
      success: false,
      data: [],
      message: error.message || "Failed to load notifications",
    };
  }
}

export async function deleteAdminNotificationAction(notificationId: string) {
  try {
    const res = await adminService.deleteNotification(notificationId);
    revalidatePath("/admin/notifications");
    return {
      success: true,
      data: res.data,
      message: res.message || "Notification deleted",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete notification",
    };
  }
}

export async function broadcastNotificationAction(payload: {
  title: string;
  message: string;
}) {
  try {
    const res = await adminService.broadcastNotification(payload);
    revalidatePath("/admin/notifications");
    return {
      success: true,
      data: res.data,
      message: res.message || "Broadcast sent successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to send broadcast",
    };
  }
}

export async function sendNotificationToUserAction(payload: {
  userId: string;
  title: string;
  message: string;
}) {
  try {
    const res = await adminService.sendToUser(payload);
    revalidatePath("/admin/notifications");
    return {
      success: true,
      data: res.data,
      message: res.message || "Notification sent to user",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to send notification",
    };
  }
}

// ─── Booking Deletion ───────────────────────────────────────────────
export async function deleteAdminBookingAction(bookingId: string) {
  try {
    const res = await adminService.deleteBooking(bookingId);
    revalidatePath("/admin/bookings");
    return {
      success: true,
      data: res.data,
      message: res.message || "Booking deleted",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete booking",
    };
  }
}
