/** Pexels search keywords per category slug */
export const PEXELS_KEYWORDS: Record<string, string[]> = {
  sofas: [
    "luxury sofa wooden frame cushion",
    "handcrafted sheesham wood sofa set",
    "modern sofa with wooden frame upholstery",
  ],
  beds: [
    "wooden bed frame cushion headboard luxury",
    "handcrafted wooden double bed design",
    "sheesham wood king bed frame cushion",
  ],
  deewan: [
    "traditional floor sofa cushions wooden",
    "wooden daybed upholstery cushion work",
    "oriental wooden seating cushion design",
  ],
  "dining-tables": [
    "wooden dining table set luxury",
    "handcrafted dining room furniture solid wood",
    "solid wood dining table six chairs set",
  ],
  chairs: [
    "wooden chair cushion upholstery luxury",
    "handcrafted dining chair cushion seat wood",
    "solid wood accent chair upholstered design",
  ],
  wardrobes: [
    "handcrafted wooden wardrobe closet luxury",
    "sheesham wood almirah wardrobe design",
    "luxury wooden bedroom wardrobe storage",
  ],
  almari: [
    "handcrafted wooden almirah wardrobe",
    "luxury wood closet storage furniture",
    "traditional wooden almari design",
  ],
  "tv-units": [
    "handcrafted wooden TV unit cabinet living room",
    "luxury wood media entertainment center",
    "solid wood TV console cabinet furniture",
  ],
  "office-furniture": [
    "executive wooden office desk set luxury",
    "handcrafted wooden office chair desk",
    "luxury solid wood office furniture set",
  ],
  "carved-furniture": [
    "hand carved wooden furniture intricate design",
    "ornate carved wood furniture traditional",
    "luxury carved sheesham furniture pakistan",
  ],
  swings: [
    "wooden garden swing cushion upholstery",
    "indoor wooden swing cushion porch luxury",
    "handcrafted wood swing bench cushion",
  ],
  tables: [
    "handcrafted wooden center coffee table",
    "luxury solid wood side table design",
    "sheesham wood coffee table living room",
  ],
  "center-tables": [
    "luxury wooden center table living room",
    "handcrafted coffee table solid wood ornate",
    "carved wood center table design",
  ],
  dressing: [
    "wooden dressing table mirror bedroom luxury",
    "luxury vanity table wooden design",
    "handcrafted dressing table sheesham wood",
  ],
};

export const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  sofas: "Sofa",
  beds: "Bed",
  deewan: "Deewan",
  "dining-tables": "Dining Table",
  chairs: "Chair",
  wardrobes: "Wardrobe",
  almari: "Almari",
  "tv-units": "TV Unit",
  "office-furniture": "Office Furniture",
  "carved-furniture": "Carved Furniture",
  swings: "Swing",
  tables: "Table",
  "center-tables": "Center Table",
  dressing: "Dressing Table",
};

const STYLE_WORDS = ["Premium", "Luxury", "Modern", "Classic", "Elegant", "Traditional"];
const WOOD_WORDS  = ["Sheesham", "Solid Wood", "Pure Wood", "Hardwood", "Teak Wood", "Walnut"];

export function getCategoryDisplayName(slug: string): string {
  return (
    CATEGORY_DISPLAY_NAMES[slug] ??
    slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export function getKeywords(slug: string): string[] {
  return (
    PEXELS_KEYWORDS[slug] ??
    PEXELS_KEYWORDS[slug.replace(/-/g, "")] ?? [
      `${getCategoryDisplayName(slug)} wooden furniture handcrafted`,
      `luxury ${getCategoryDisplayName(slug).toLowerCase()} design pakistan`,
      `solid wood ${getCategoryDisplayName(slug).toLowerCase()} cushion upholstery`,
    ]
  );
}

export function generateSEO(category: string, pexelsId: number) {
  const categoryName = getCategoryDisplayName(category);
  const style = STYLE_WORDS[pexelsId % STYLE_WORDS.length];
  const wood  = WOOD_WORDS[Math.floor(pexelsId / 7) % WOOD_WORDS.length];

  const seoTitle =
    `${style} Handcrafted ${categoryName} with Premium Cushion Work | CH Furniture House`;

  const seoDescription =
    `Buy ${style.toLowerCase()} handcrafted ${categoryName.toLowerCase()} from CH Furniture House – ` +
    `Pakistan's top wooden furniture manufacturer in Sialkot. Made with ${wood.toLowerCase()} and premium cushioning. ` +
    `Custom designs, best ${categoryName.toLowerCase()} price in Pakistan 2026.`;

  const seoKeywords = [
    `${categoryName.toLowerCase()} price in pakistan`,
    `wooden ${categoryName.toLowerCase()} sialkot`,
    `handcrafted ${categoryName.toLowerCase()} pakistan`,
    `${wood.toLowerCase()} ${categoryName.toLowerCase()}`,
    `cushion work furniture pakistan`,
    `modern ${categoryName.toLowerCase()} design 2026`,
    `chaudhry furniture house`,
    `best wooden furniture pakistan`,
    `${categoryName.toLowerCase()} lahore`,
    `custom ${categoryName.toLowerCase()} manufacturer`,
    `luxury furniture sialkot pakistan`,
    `${style.toLowerCase()} ${categoryName.toLowerCase()} pakistan`,
  ].join(", ");

  return { seoTitle, seoDescription, seoKeywords };
}
