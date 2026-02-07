"use server";

import { revalidatePath } from "next/cache";
import { availabilityService } from "@/services/availability.services";
import { tutorService } from "@/services/tutor.services";

export async function getTutorAvailabilityAction() {
  try {
    // service returns { success, data }
    const profileRes = await tutorService.getMyProfile();
    if (!profileRes?.success || !profileRes?.data) {
      return {
        success: false,
        data: [],
        error: { message: "Tutor profile not found" },
      };
    }

    const tutorProfileId = profileRes.data.id;

    const availabilityRes =
      await availabilityService.getMyAvailability(tutorProfileId);

    if (!availabilityRes?.success) {
      return {
        success: false,
        data: [],
        error: { message: availabilityRes?.error ?? "Failed to load availability" },
      };
    }

    return {
      success: true,
      data: availabilityRes.data ?? [],
      error: null,
    };
  } catch (err: any) {
    return {
      success: false,
      data: [],
      error: { message: err?.message ?? "error", err },
    };
  }
}

export async function createTutorSlotAction(payload: {
  startTime: string;
  endTime: string;
}) {
  try {
    // Get tutor profile to include ID in request
    const profileRes = await tutorService.getMyProfile();
    
    if (!profileRes?.success || !profileRes?.data) {
      return {
        success: false,
        data: null,
        message: "Cannot create slot",
        error: { message: "Tutor profile not found" },
      };
    }

    const tutorProfileId = profileRes.data.id;
    
    // Format payload as expected by API: { tutorProfileId, slots: [...] }
    const slotPayload = {
      tutorProfileId,
      slots: [
        {
          startTime: payload.startTime,
          endTime: payload.endTime,
        },
      ],
    };

    const res = await availabilityService.createSlot(slotPayload);
    
    if (!res?.success) {
      return {
        success: false,
        data: null,
        message: res?.message ?? "Create failed",
        error: { message: res?.error ?? "Unknown error" },
      };
    }
    
    revalidatePath("/tutor/availability");
    return {
      success: true,
      data: res.data ?? null,
      message: res.message ?? "Slot created",
      error: null,
    };
  } catch (err: any) {
    return {
      success: false,
      data: null,
      message: "Create failed",
      error: { message: err?.message ?? "error", err },
    };
  }
}
export async function updateTutorSlotAction(payload: {
  availabilityId: string;
  startTime: string;
  endTime: string;
}) {
  try {
    const json = await availabilityService.updateSlot(payload);

    revalidatePath("/tutor/availability");

    return {
      success: true,
      data: json.data ?? null,
      message: json.message ?? "Slot updated",
      error: null,
    };
  } catch (err: any) {
    return {
      success: false,
      data: null,
      message: "Update failed",
      error: { message: err?.message ?? "error", err },
    };
  }
}

export async function deleteTutorSlotAction(availabilityId: string) {
  try {
    const json = await availabilityService.deleteSlot(availabilityId);

    revalidatePath("/tutor/availability");

    return {
      success: true,
      data: json.data ?? null,
      message: json.message ?? "Slot deleted",
      error: null,
    };
  } catch (err: any) {
    return {
      success: false,
      data: null,
      message: "Delete failed",
      error: { message: err?.message ?? "error", err },
    };
  }
}