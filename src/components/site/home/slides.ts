// ─────────────────────────────────────────────────────────────────
// SLIDES DATA — edit here to change any banner content or images
//
// To add a new slide:
//   1. Drop your image in /public/images/hero/  (or use a Cloudinary URL)
//   2. Copy any entry below and paste it at the end of the array
//   3. Fill in the fields — all except eyebrow, priceLabel, price,
//      categories, and badge are optional
// ─────────────────────────────────────────────────────────────────

export type Slide = {
  id: number;
  image: string;                   // desktop image (landscape)
  objectPosition?: string;         // CSS object-position for desktop image
  objectFit?: "cover" | "contain"; // defaults to "cover"; use "contain" for pre-designed banners
  bgColor?: string;                // background behind image when objectFit is "contain"
  mobileImage?: string;            // portrait-optimised image for mobile screens
  mobileObjectPosition?: string;   // CSS object-position for mobile image
  mobileObjectFit?: "cover" | "contain";
  noTextOverlay?: boolean;         // true = skip gradient + text overlay, image shows as-is
  eyebrow?: string;
  title: string;
  priceLabel?: string;
  price?: string;
  categories?: string;
  badge?: string;
  ctaText: string;
  ctaLink: string;
};

export const SLIDES: Slide[] = [
  {
    id: 1,
    image: "/images/hero/jahez.webp",
    objectPosition: "65% center",
    mobileImage: "/images/hero/mobile-jahez.jpeg",
    mobileObjectFit: "cover",
    mobileObjectPosition: "center top",
    eyebrow: "Shaadi Ka Season, Khushiyon Ka Ghar",
    title: "JAHEZ PACKAGES",
    priceLabel: "starting from",
    price: "Rs. 3,00,000*",
    categories: "Bed Sets | Sofa Sets | Dining Sets",
    badge: "Easy Monthly Installments",
    ctaText: "View Packages",
    ctaLink: "/categories",
  },
  {
    id: 2,
    image: "/images/hero/bedroom-set.jpg",
    objectPosition: "60% center",
    eyebrow: "Sukoon Bhari Neend",
    title: "BEDROOM SETS",
    categories: "Beds | Side Tables | Dressers",
    badge: "Solid Wood Guarantee",
    ctaText: "Shop Bedrooms",
    ctaLink: "/categories",
  },
  {
    id: 3,
    image: "/images/hero/sofa-set.webp",
    objectPosition: "62% center",
    eyebrow: "Jahan Family Milti Hai",
    title: "SOFA SETS",
    categories: "L-Shape | 5-Seater | 7-Seater",
    badge: "Up to 20% Off",
    ctaText: "Explore Sofas",
    ctaLink: "/categories",
  },
  {
    id: 4,
    image: "/images/hero/dinning2.jpg",
    objectPosition: "62% center",
    eyebrow: "Har Khana, Ek Yaadgar Lamha",
    title: "DINING SETS",
    categories: "4, 6 & 8 Seaters",
    badge: "Free Delivery",
    ctaText: "See Dining Sets",
    ctaLink: "/categories",
  },
  {
    id: 5,
    image: "/images/hero/office-furniture.jpg",
    objectPosition: "60% center",
    mobileImage: "/images/hero/mobile-office.jpeg",
    mobileObjectFit: "cover",
    mobileObjectPosition: "center center",
    eyebrow: "Kaam Ka Behtareen Mahaul",
    title: "OFFICE FURNITURE",
    categories: "Desks | Chairs | Workstations",
    badge: "Bulk Orders Welcome",
    ctaText: "View Office Range",
    ctaLink: "/categories",
  },
  {
    id: 6,
    image: "/images/hero/custom-furniture.jpeg",
    objectPosition: "55% center",
    mobileImage: "/images/hero/mobile-custom.jpeg",
    mobileObjectFit: "cover",
    mobileObjectPosition: "center center",
    eyebrow: "Aap Ki Pasand, Hamari Karigari",
    title: "CUSTOM MADE FURNITURE",
    categories: "Wardrobes | Kitchens | Doors",
    badge: "Free Home Measurement",
    ctaText: "Request Custom Order",
    ctaLink: "/contact",
  },
  {
    id: 7,
    image: "/images/hero/truck.jpg",
    objectFit: "contain",
    bgColor: "#d6e4f0",
    mobileImage: "/images/hero/mobile-delivery.jpeg",
    mobileObjectFit: "cover",
    mobileObjectPosition: "center top",
    noTextOverlay: true,
    title: "FREE DELIVERY",
    ctaText: "Contact Us",
    ctaLink: "/contact",
  },
];

// ─────────────────────────────────────────────────────────────────
// MARQUEE MESSAGES — edit this array to change the scrolling strip
// ─────────────────────────────────────────────────────────────────
export const MARQUEE_MESSAGES = [
  "FREE Nationwide Delivery All Over Pakistan!",
  "Easy Monthly Installments",
  "Solid Wood Guarantee",
  "Custom Made to Order",
];
