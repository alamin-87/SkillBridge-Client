import { getMyTutorProfileAction } from "@/actions/tutor-action";
import TutorProfileForm from "./tutor-profile-form";


export default async function TutorProfilePage() {
  const { success, data } = await getMyTutorProfileAction();
  if (!success) return <div>Failed to load tutor profile</div>;

  return <TutorProfileForm profile={data} />;
}
