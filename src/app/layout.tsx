import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { Toaster } from "sonner";
import { getSettings } from "@/lib/settings";
import { cleanSocialUrl } from "@/lib/utils";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});


const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://chfurniturehouse.com";
const SITE_NAME = "CH Furniture House";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings().catch(() => null);
  const title =
    s?.seoTitle ||
    "CH Furniture House | Handcrafted Wooden Furniture in Sialkot, Pakistan";
  const description =
    s?.seoDescription ||
    "CH Furniture House makes premium handcrafted solid-wood furniture in Sialkot: sofas, beds, dining sets, wardrobes, carved & custom pieces. Visit our workshop or enquire on WhatsApp.";
  const keywords =
    s?.seoKeywords ||
    "furniture Sialkot, custom wooden furniture Pakistan, handcrafted furniture, CH Furniture House, luxury furniture Pakistan, sheesham furniture, bedroom set Pakistan, sofa set Pakistan, dining table Pakistan, wooden furniture manufacturer Sialkot, jahez furniture Pakistan, bridal furniture set Pakistan";
  const ogImage = s?.ogImageUrl || `${SITE_URL}/opengraph-image`;

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: "%s | CH Furniture House" },
    description,
    keywords: keywords.split(",").map((k: string) => k.trim()).filter(Boolean),
    authors: [{ name: "CH Furniture House" }],
    openGraph: {
      type: "website",
      title,
      description,
      siteName: "CH Furniture House",
      url: SITE_URL,
      images: [{ url: ogImage, width: 1200, height: 630, alt: "CH Furniture House" }],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    alternates: { canonical: SITE_URL },
    other: {
      "geo.region":    "PK-PB",
      "geo.placename": "Sialkot, Punjab, Pakistan",
      "geo.position":  "32.2608;74.6618",
      ICBM:            "32.2608, 74.6618",
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings().catch(() => null);
  const sameAs = [s?.facebook, s?.instagram, s?.youtube, s?.tiktok, s?.linkedin]
    .map((url) => cleanSocialUrl(url))
    .filter((url): url is string => Boolean(url));

  const localBizLd = {
    "@context": "https://schema.org",
    "@type": ["FurnitureStore", "LocalBusiness"],
    "@id": `${SITE_URL}/#business`,
    name: SITE_NAME,
    alternateName: "Chaudhry Furniture House",
    description:
      "Premium custom wooden furniture manufacturer based in Sialkot, Pakistan. We craft sofas, beds, dining sets, wardrobes, carved furniture, and custom pieces to order.",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/icon.png`,
      width: 512,
      height: 512,
    },
    image: `${SITE_URL}/opengraph-image`,
    telephone: s?.phone || "+92-341-6309652",
    email: s?.email || "info@chfurniturehouse.com",
    priceRange: "$$",
    currenciesAccepted: "PKR",
    paymentAccepted: "Cash, Bank Transfer",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Mohala Sardaaran, Near HBL Bank, Kalaswala",
      addressLocality: "Pasrur",
      addressRegion: "Sialkot, Punjab",
      addressCountry: "PK",
    },
    geo: { "@type": "GeoCoordinates", latitude: "32.2608", longitude: "74.6618" },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
      opens: "09:00",
      closes: "20:00",
    },
    ...(sameAs.length > 0 && { sameAs }),
  };

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}/#business` },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };

  const jsonLd = [localBizLd, websiteLd];

  return (
    <html lang="en" className={`${jakarta.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd[0]) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd[1]) }}
        />
        {children}
        <Toaster
          theme="light"
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#FAF7F4",
              color: "#1C1A18",
              border: "1px solid #E5DDD5",
            },
          }}
        />
      </body>
    </html>
  );
}
