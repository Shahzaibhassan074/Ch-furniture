import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { MobileTabBar } from "@/components/site/MobileTabBar";
import { WhatsAppSheet } from "@/components/site/WhatsAppSheet";
import { SheetProvider } from "@/context/sheet-context";
import { FavouritesProvider, FavouritesToast } from "@/context/favourites-context";
import { getSettings } from "@/lib/settings";
import { getAllCategories } from "@/lib/queries";
import { cleanSocialUrl } from "@/lib/utils";

export async function SiteShell({ children }: { children: React.ReactNode }) {
  const [s, categories] = await Promise.all([getSettings(), getAllCategories()]);
  return (
    <FavouritesProvider>
      <SheetProvider>
        <Navbar
          brandName={s.brandName}
          address={s.address}
          phone={s.phone}
          whatsapp={s.whatsapp}
          categories={categories}
        />
        <main className="min-h-screen pb-[calc(80px+env(safe-area-inset-bottom))] md:pb-0">
          {children}
        </main>
        <Footer
          brandName={s.brandName}
          tagline={s.tagline}
          address={s.address}
          phone={s.phone}
          whatsapp={s.whatsapp}
          email={s.email}
          whatsappMessage={s.whatsappMessage}
          social={{
            facebook:  cleanSocialUrl(s.facebook),
            instagram: cleanSocialUrl(s.instagram),
            youtube:   cleanSocialUrl(s.youtube),
          }}
        />
        {/* FloatingWhatsApp — desktop only */}
        <div className="hidden md:flex">
          <FloatingWhatsApp number={s.whatsapp} message={s.whatsappMessage} />
        </div>
        <MobileTabBar />
        <WhatsAppSheet number={s.whatsapp} phone={s.phone} message={s.whatsappMessage} />
      </SheetProvider>
      <FavouritesToast />
    </FavouritesProvider>
  );
}
