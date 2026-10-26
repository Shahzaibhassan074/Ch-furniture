import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BulkUploader } from "@/components/admin/BulkUploader";

export const dynamic = "force-dynamic";

export default async function BulkUploadPage({ params }: { params: { id: string } }) {
  const category = await prisma.category.findUnique({
    where: { id: params.id },
    select: { id: true, name: true },
  });

  if (!category) notFound();

  return <BulkUploader category={category} />;
}
