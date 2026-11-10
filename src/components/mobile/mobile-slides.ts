export type MobileSlide = {
  id: number;
  image: string;
  alt: string;
  tag: string;
  t1: string;
  t2: string;
  sub: string;
  cta: string;
  href: string;
};

export const MOBILE_SLIDES: MobileSlide[] = [
  {
    id: 1,
    image: "/images/hero/mobile/1-jahez.webp",
    alt: "Bride and groom in wedding clothes beside a carved bridal bed",
    tag: "Jahez packages",
    t1: "Shaadi Ka Season,",
    t2: "Khushiyon Ka Ghar",
    sub: "Bed, sofa and dining sets",
    cta: "View packages",
    href: "/categories",
  },
  {
    id: 2,
    image: "/images/hero/mobile/2-sofa.webp",
    alt: "Cream sofa set with carved sheesham frame and wooden centre table",
    tag: "Sofa sets",
    t1: "Jahan Family",
    t2: "Milti Hai",
    sub: "L-Shape · 5-Seater · 7-Seater",
    cta: "Explore sofas",
    href: "/categories",
  },
  {
    id: 3,
    image: "/images/hero/mobile/3-bedroom.webp",
    alt: "Carved sheesham king bed with ivory bedding and brass lamps",
    tag: "Bedroom sets",
    t1: "Sukoon Bhari",
    t2: "Neend",
    sub: "Beds · Side tables · Dressers",
    cta: "Shop bedrooms",
    href: "/categories",
  },
  {
    id: 4,
    image: "/images/hero/mobile/4-dining.webp",
    alt: "Walnut six-seater dining table with carved upholstered chairs",
    tag: "Dining sets · Free delivery",
    t1: "Har Khana,",
    t2: "Ek Yaadgar Lamha",
    sub: "4, 6 & 8 seaters",
    cta: "See dining sets",
    href: "/categories",
  },
  {
    id: 5,
    image: "/images/hero/mobile/5-office.webp",
    alt: "Walnut executive desk with leather chair and bookshelves",
    tag: "Office · Bulk orders welcome",
    t1: "Kaam Ka",
    t2: "Behtareen Mahaul",
    sub: "Desks, workstations and meeting tables",
    cta: "View office range",
    href: "/categories",
  },
  {
    id: 6,
    image: "/images/hero/mobile/6-custom.webp",
    alt: "A craftsman hand-finishing a carved wooden door in the workshop",
    tag: "Custom made · Free home measurement",
    t1: "Aap Ki Pasand,",
    t2: "Hamari Karigari",
    sub: "Wardrobes · Kitchens · Doors",
    cta: "Request custom order",
    href: "/contact",
  },
  {
    id: 7,
    image: "/images/hero/mobile/7-delivery.webp",
    alt: "CH Furniture House delivery truck on the motorway at sunset",
    tag: "All Pakistan delivery",
    t1: "Ghar Tak,",
    t2: "Hifazat Se",
    sub: "Delivery and installation across Pakistan",
    cta: "Contact us",
    href: "/contact",
  },
];
