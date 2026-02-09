import { getCategoriesAction } from "@/actions/category-action";
import TutorCreateProfileForm from "./TutorCreateProfileForm";

export default async function CreateTutorProfilePage() {
  // optional: preload categories on server
  const cats = await getCategoriesAction();

  return (
    <div className="mx-auto max-w-2xl p-4">
      <TutorCreateProfileForm serverCategories={cats?.categories ?? []} />
    </div>
  );
}
