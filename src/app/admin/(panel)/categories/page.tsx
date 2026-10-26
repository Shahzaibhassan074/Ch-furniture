import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CategoriesManager } from "@/components/admin/CategoriesManager";

export const dynamic = "force-dynamic";

const getCategories = unstable_cache(
  () =>
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        bannerUrl: true,
        thumbUrl: true,
        heroVideoUrl: true,
        heroVideoPosterUrl: true,
        sortOrder: true,
        featured: true,
        videoMode: true,
        _count: { select: { furniture: true } },
      },
    }),
  ["admin-categories"],
  { tags: ["categories"] }
);

export default async function CategoriesPage() {
  const categories = await getCategories();
  return <CategoriesManager categories={categories} />;
}
