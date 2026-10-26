import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FurnitureForm } from "@/components/admin/FurnitureForm";
import { STYLES, WOOD_TYPES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function EditFurniturePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { from?: string };
}) {
  const [furniture, categories] = await Promise.all([
    prisma.furniture.findUnique({
      where: { id: params.id },
      include: { images: { orderBy: { sortOrder: "asc" } }, videos: true },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!furniture) notFound();
  return (
    <FurnitureForm
      furniture={furniture}
      categories={categories}
      styles={[...STYLES]}
      woods={[...WOOD_TYPES]}
      backUrl={searchParams?.from}
    />
  );
}
