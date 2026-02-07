import Link from "next/link";
import { getAdminCategoriesAction } from "@/actions/admin-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AdminCategoryCreate from "./category-create";
import AdminCategoryRow from "./category-row";

export default async function AdminCategoriesPage() {
  const { success, data, message } = await getAdminCategoriesAction();
  if (!success) return <div>Failed to load categories: {message}</div>;

  const categories = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Categories</h2>
          <p className="text-sm text-muted-foreground">Create, update, and delete categories</p>
        </div>

        <Button asChild size="sm" variant="outline">
          <Link href="/admin">Back to dashboard</Link>
        </Button>
      </div>

      {/* Create */}
      <Card>
        <CardHeader>
          <CardTitle>Create category</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminCategoryCreate />
        </CardContent>
      </Card>

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle>All categories</CardTitle>
        </CardHeader>

        <CardContent>
          {categories.length === 0 ? (
            <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
              No categories found.
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map((c: any) => (
                <AdminCategoryRow key={c.id} id={c.id} name={c.name} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
