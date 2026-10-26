import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { FurnitureList } from "@/components/admin/FurnitureList";

export const dynamic = "force-dynamic";

const getFurniture = unstable_cache(
  () =>
    prisma.furniture.findMany({
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        slug: true,
        name: true,
        published: true,
        featured: true,
        bestSeller: true,
        category: { select: { name: true } },
        images: {
          orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
          take: 1,
          select: { url: true, isPrimary: true },
        },
      },
    }),
  ["admin-furniture"],
  { tags: ["furniture"] }
);

export default async function FurniturePage() {
  const items = await getFurniture();
  return <FurnitureList items={items} />;
}
