import type { Metadata } from "next";
import { SiteShell } from "@/components/site/SiteShell";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { SearchClient } from "@/components/site/SearchClient";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search the CH Furniture House catalog by name, category, style or wood type — handcrafted wooden furniture from Sialkot, Pakistan.",
  keywords: ["furniture search Sialkot", "wooden furniture catalog Pakistan", "find furniture Chaudhry"],
  robots: { index: false, follow: false },
};

export default async function SearchPage() {
  const s = await getSettings();
  return (
    <SiteShell>
      <div className="container-px pt-28 pb-10 md:pt-32">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
        <p className="eyebrow mt-8">The Catalogue</p>
        <h1 className="mt-3 font-display text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold text-ink">
          Search{" "}
          <span className="text-terra">the catalog.</span>
        </h1>
      </div>
      <section className="container-px pb-28">
        <SearchClient whatsapp={s.whatsapp} />
      </section>
    </SiteShell>
  );
}
