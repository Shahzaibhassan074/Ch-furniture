import { unstable_cache } from "next/cache";
import { supabase } from "@/lib/supabaseClient";
import { transformSettings } from "@/lib/prisma";

export const DEFAULT_WHATSAPP = "+92 341 6309652";

// Fallback used when the Supabase row hasn't been created yet (e.g. during build
// before data migration, or if the DB is unreachable).
const SETTINGS_DEFAULTS = {
  id: "singleton",
  brandName: "CH Furniture House",
  tagline: "Crafting Premium Wooden Furniture with Timeless Elegance.",
  description: "",
  address: "Mohala Sardaaran, Near HBL Bank, Kalaswala, Pasrur, Sialkot, Punjab, Pakistan",
  phone: DEFAULT_WHATSAPP,
  whatsapp: DEFAULT_WHATSAPP,
  email: "",
  businessHours: "Mon – Sat: 9:00 AM – 8:00 PM",
  mapEmbedUrl: "",
  whatsappMessage:
    "Hello CH Furniture House,\nI saw your website and I'm interested in one of your furniture designs. Could you please provide more information?",
  facebook: "",
  instagram: "",
  youtube: "",
  tiktok: "",
  linkedin: "",
  seoTitle: "CH Furniture House | Premium Handcrafted Wooden Furniture — Sialkot, Pakistan",
  seoDescription:
    "CH Furniture House crafts premium custom wooden furniture in Sialkot, Pakistan. Handmade sofas, beds, dining sets, carved furniture & more. Order to your specifications.",
  seoKeywords:
    "Furniture Manufacturer Pakistan, Furniture Sialkot, Wooden Furniture, Luxury Furniture, Sofa Manufacturer",
  ogImageUrl: "",
  founderImageUrl: "",
  processImageUrl: "",
  aboutStory: "",
  aboutMission: "",
  aboutVision: "",
  aboutExperience: "",
  yearsExperience: 15,
  projectsCompleted: 1200,
  happyClients: 800,
  craftsmenCount: 40,
  workshopVideoDesktopUrl: "",
  workshopVideoDesktopPosterUrl: "",
  workshopVideoMobileUrl: "",
  workshopVideoMobilePosterUrl: "",
  updatedAt: new Date().toISOString(),
};

export const getSettings = unstable_cache(
  async () => {
    try {
      const { data } = await supabase
        .from("settings")
        .select("*")
        .eq("id", "singleton")
        .single();

      if (data) return transformSettings(data) ?? SETTINGS_DEFAULTS;

      // Create the row and return defaults (insert may fail before schema is ready)
      const { data: created } = await supabase
        .from("settings")
        .insert({ id: "singleton" })
        .select()
        .single();

      return transformSettings(created) ?? SETTINGS_DEFAULTS;
    } catch {
      return SETTINGS_DEFAULTS;
    }
  },
  ["settings"],
  { revalidate: 300, tags: ["settings"] }
);
