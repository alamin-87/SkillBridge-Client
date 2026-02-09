import { getCategoriesAction } from "@/actions/category-action";
import { CategoriesView } from "@/components/modules/categories/CategoriesView";

export default async function CategoriesPage() {
  const { categories, error } = await getCategoriesAction();

  return <CategoriesView categories={categories} error={error} />;
}
