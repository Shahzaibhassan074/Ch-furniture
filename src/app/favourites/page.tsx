import type { Metadata } from "next";
import { SiteShell } from "@/components/site/SiteShell";
import { getSettings } from "@/lib/settings";
import { FavouritesPageClient } from "./FavouritesPageClient";

export const metadata: Metadata = {
  title: "Your Favourites",
  description: "Your saved furniture designs from CH Furniture House.",
  robots: { index: false, follow: false },
};

export default async function FavouritesPage() {
  const settings = await getSettings();
  return (
    <SiteShell>
      <FavouritesPageClient whatsapp={settings.whatsapp} />
    </SiteShell>
  );
}
