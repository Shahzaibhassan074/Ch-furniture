import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { getSettings } from "@/lib/settings";
import { getAllCategories } from "@/lib/queries";

export async function SiteShell({ children }: { children: React.ReactNode }) {
  const [s, categories] = await Promise.all([getSettings(), getAllCategories()]);
  return (
    <>
      <Navbar
        brandName={s.brandName}
        address={s.address}
        phone={s.phone}
        whatsapp={s.whatsapp}
        categories={categories}
      />
      <main className="min-h-screen">{children}</main>
      <Footer
        brandName={s.brandName}
        tagline={s.tagline}
        address={s.address}
        phone={s.phone}
        whatsapp={s.whatsapp}
        email={s.email}
        whatsappMessage={s.whatsappMessage}
        social={{ facebook: s.facebook, instagram: s.instagram, youtube: s.youtube }}
      />
      <FloatingWhatsApp number={s.whatsapp} message={s.whatsappMessage} />
    </>
  );
}
