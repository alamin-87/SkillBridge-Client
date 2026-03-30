"use server";

import { notificationService } from "@/services/notification.services";

export async function getMyNotificationsAction() {
  try {
    const res = await notificationService.getMyNotifications();
    return { success: true, data: res.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to load notifications",
    };
  }
}

export async function markNotificationAsReadAction(notificationId: string) {
  try {
    const res = await notificationService.markAsRead(notificationId);
    return {
      success: true,
      data: res.data,
      message: "Notification marked as read",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to mark notification as read",
    };
  }
}

export async function markAllNotificationsAsReadAction() {
  try {
    const res = await notificationService.markAllAsRead();
    return {
      success: true,
      data: res.data,
      message: "All notifications marked as read",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to mark all as read",
    };
  }
}
