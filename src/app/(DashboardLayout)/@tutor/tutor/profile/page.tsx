import { getMyTutorProfileAction } from "@/actions/tutor-action";
import TutorProfileForm from "./tutor-profile-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function TutorProfilePage() {
  const { success, data } = await getMyTutorProfileAction();
  if (!success) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border p-6 text-center">
        <p className="text-sm font-medium">Tutor profile not found</p>
        <p className="text-sm text-muted-foreground">
          You need to create a tutor profile before continuing.
        </p>

        <Button asChild>
          <Link href="/tutor/create">Create tutor profile</Link>
        </Button>
      </div>
    );
  }

  return <TutorProfileForm profile={data} />;
}
