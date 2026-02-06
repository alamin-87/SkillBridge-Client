import { getStudentMeAction } from "@/actions/student-action";
import ProfileForm from "./profile-form";

export default async function StudentProfilePage() {
  const { success, data } = await getStudentMeAction();
  if (!success) return <div>Failed to load profile</div>;

  return <ProfileForm user={data} />;
}
