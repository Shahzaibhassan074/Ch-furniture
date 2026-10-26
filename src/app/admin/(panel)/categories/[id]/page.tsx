import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CategoryProducts } from "@/components/admin/CategoryProducts";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: { id: string } }) {
  const getCategoryData = unstable_cache(
    () =>
      prisma.category.findUnique({
        where: { id: params.id },
        select: {
          id: true,
          name: true,
          slug: true,
          furniture: {
            orderBy: { sortOrder: "asc" },
            select: {
              id: true,
              name: true,
              published: true,
              featured: true,
              bestSeller: true,
              images: {
                orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
                take: 1,
                select: { url: true, isPrimary: true },
              },
            },
          },
        },
      }),
    [`admin-category-${params.id}`],
    { tags: ["furniture", "categories"] }
  );

  const category = await getCategoryData();
  if (!category) notFound();

  return (
    <CategoryProducts
      category={{ id: category.id, name: category.name, slug: category.slug }}
      items={category.furniture}
    />
  );
}
