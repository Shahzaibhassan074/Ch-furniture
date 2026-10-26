import { prisma } from "@/lib/prisma";
import { MessagesManager } from "@/components/admin/MessagesManager";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return <MessagesManager messages={messages} />;
}
