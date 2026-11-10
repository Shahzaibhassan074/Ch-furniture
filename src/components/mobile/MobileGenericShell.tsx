import { getSettings } from "@/lib/settings";
import { getAllCategories } from "@/lib/queries";
import { MobileLayout } from "./MobileLayout";

type Props = { children: React.ReactNode };

export async function MobileGenericShell({ children }: Props) {
  const [settings, categories] = await Promise.all([
    getSettings(),
    getAllCategories(),
  ]);

  return (
    <MobileLayout settings={settings} categories={categories}>
      {children}
    </MobileLayout>
  );
}
