import { notFound } from "next/navigation";
import { getTutorByIdAction } from "@/actions/tutor-action";
import { TutorProfileView } from "@/components/modules/tutors/TutorProfileView";

export default async function TutorDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { tutor } = await getTutorByIdAction(id);

  if (!tutor) return notFound();

  return <TutorProfileView tutor={tutor} />;
}
