import { getTutorAvailabilityAction } from "@/actions/availability-action";
import AvailabilityClient from "./availability-client";

export default async function TutorAvailabilityPage() {
  const { success, data, error } = await getTutorAvailabilityAction();
  if (!success) return <div>{error?.message ?? "Failed to load availability"}</div>;

  return <AvailabilityClient slots={data} />;
}