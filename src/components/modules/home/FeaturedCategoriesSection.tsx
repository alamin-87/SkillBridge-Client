import Link from "next/link";
import { getCategoriesAction } from "@/actions/category-action";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getIconComponent, getGradientForString } from "@/lib/icon-mapper";

export async function FeaturedCategoriesSection() {
  const { categories } = await getCategoriesAction();
  const ArrowRightIcon = getIconComponent("ArrowRight");

  const displayCategories = categories.length > 0 
    ? categories.slice(0, 8) 
    : [
        { id: '1', name: 'Mathematics', description: 'Master algebra, calculus, and beyond.' },
        { id: '2', name: 'Web Development', description: 'Learn React, Node.js, and scaling.' },
        { id: '3', name: 'Languages', description: 'Fluent speaking and writing.' },
        { id: '4', name: 'Business', description: 'Marketing, finance, and management.' }
      ];

  return (
    <section className="relative container mx-auto px-4 py-20 lg:py-28 bg-linear-to-b from-transparent to-muted/20">
      <div className="mb-16 text-center max-w-2xl mx-auto space-y-4">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Explore Top <span className="text-transparent bg-clip-text bg-linear-to-r from-[#06b6d4] to-[#3b82f6]">Subjects</span>
        </h2>
        <p className="text-lg text-muted-foreground font-medium">
          Choose from a variety of demanding subjects and connect with tutors who are experts in their field.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {displayCategories.map((category) => {
          const Icon = getIconComponent((category as any).icon || category.name);
          const gradient = getGradientForString(category.name);
          return (
            <Card key={category.id} className="group card-3d overflow-hidden border-border/40 bg-card/60 backdrop-blur-md rounded-3xl hover:shadow-xl hover:shadow-[#06b6d4]/10 transition-all duration-300">
              <CardContent className="p-8">
                <div className={`mb-6 flex size-16 items-center justify-center rounded-2xl bg-linear-to-br ${gradient} shadow-lg shadow-black/5 text-white transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-[#3b82f6] transition-colors line-clamp-1">{category.name}</h3>
                <p className="text-sm text-muted-foreground font-medium line-clamp-2">
                  {(category as any).description || `Find top rated ${category.name} tutors ready to help you.`}
                </p>
                <div className="mt-6 flex items-center text-sm font-bold text-[#3b82f6] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <Link href={`/tutors?category=${category.name}`} className="flex items-center">
                    Explore Tutors <ArrowRightIcon className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-16 text-center">
        <Button asChild variant="outline" size="lg" className="rounded-xl border-border/60 hover:bg-muted font-bold px-8 h-14">
          <Link href="/categories">
            View All Categories
          </Link>
        </Button>
      </div>
    </section>
  );
}
