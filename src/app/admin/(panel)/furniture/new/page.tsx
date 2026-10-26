import { prisma } from "@/lib/prisma";
import { FurnitureForm } from "@/components/admin/FurnitureForm";
import { STYLES, WOOD_TYPES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function NewFurniturePage() {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } });
  return <FurnitureForm furniture={null} categories={categories} styles={STYLES} woods={WOOD_TYPES} />;
}
