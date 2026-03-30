"use server";

import { assignmentService } from "@/services/assignment.services";
import { revalidatePath } from "next/cache";

export async function getAssignmentsAction(params?: { page?: number; limit?: number }) {
  try {
    const res = await assignmentService.getAssignments(params);
    return res;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getAssignmentDetailsAction(id: string) {
  try {
    const res = await assignmentService.getAssignmentDetails(id);
    return res;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function submitAssignmentAction(id: string, formData: FormData) {
  try {
    const res = await assignmentService.submitAssignment(id, formData);
    if (res?.success) {
      revalidatePath("/dashboard/assignments");
    }
    return res;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
