import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FurnitureForm } from "@/components/admin/FurnitureForm";
import { STYLES, WOOD_TYPES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function NewDesignPage({ params }: { params: { id: string } }) {
  const category = await prisma.category.findUnique({
    where: { id: params.id },
    select: { id: true, name: true },
  });

  if (!category) notFound();

  return (
    <FurnitureForm
      furniture={null}
      categories={[category]}
      styles={STYLES}
      woods={WOOD_TYPES}
      defaultCategoryId={category.id}
      backUrl={`/admin/categories/${params.id}`}
    />
  );
}
