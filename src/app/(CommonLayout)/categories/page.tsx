import { getCategoriesAction } from "@/actions/category-action";
import { CategoriesView } from "@/components/modules/categories/CategoriesView";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const params = await searchParams;
  const { categories, meta, error } = await getCategoriesAction(params);

  return <CategoriesView categories={categories} meta={meta} error={error} searchParams={params} />;
}
