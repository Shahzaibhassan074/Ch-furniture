export type Offer = {
  kicker: string;
  title: string;
  cta: string;
  href: string;
  bg: string;
  fg: string;
};

export const OFFERS: Offer[] = [
  { kicker: "Custom made",    title: "Free home measurement", cta: "Book a visit",      href: "/contact",                       bg: "#23402F", fg: "#FFFFFF" },
  { kicker: "Dining sets",    title: "Free delivery on dining", cta: "See dining",      href: "/category/dining",               bg: "#A64A25", fg: "#FFFFFF" },
  { kicker: "Offices & shops", title: "Bulk order pricing",    cta: "Ask on WhatsApp",  href: "https://wa.me/923416309652",     bg: "#EAF0EB", fg: "#1A1A1A" },
  { kicker: "Pay your way",   title: "Easy installments",     cta: "How it works",      href: "/categories",                    bg: "#F8ECE5", fg: "#1A1A1A" },
];
