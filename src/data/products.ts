export type Category =
  | "Plant-based cellulosic"
  | "Protein-based"
  | "Bio-based synthetic polymers"
  | "Microbial and fungal bioassembled";

export const CATEGORIES: Category[] = [
  "Plant-based cellulosic",
  "Protein-based",
  "Bio-based synthetic polymers",
  "Microbial and fungal bioassembled",
];

export interface Product {
  code: string;
  spriteSheet: string;
  cardSpriteSheet: string;
  alt: string;
  category: Category;
}

// All sheets are 6 columns × 4 rows (24 square frames).
export const PRODUCTS: Product[] = [
  { code: "PL01", spriteSheet: "/spritesheets/balenciaga-ephea-mycelium-coat-fw2022-spritesheet.webp", cardSpriteSheet: "/spritesheets/cards/balenciaga-ephea-mycelium-coat-fw2022-spritesheet.webp", alt: "Balenciaga Ephea mycelium coat, Fall/Winter 2022", category: "Plant-based cellulosic" },
  { code: "PL02", spriteSheet: "/spritesheets/nike-partners-with-pinatex-for-happy-pineapple-plant-based-sneaker-collection-spritesheet.webp", cardSpriteSheet: "/spritesheets/cards/nike-partners-with-pinatex-for-happy-pineapple-plant-based-sneaker-collection-spritesheet.webp", alt: "Nike Happy Pineapple Piñatex sneakers", category: "Plant-based cellulosic" },
  { code: "PL03", spriteSheet: "/spritesheets/stella-mccartney-x-veuve-clicquot-vegea-frayme-grape-waste-woven-bag-spritesheet.webp", cardSpriteSheet: "/spritesheets/cards/stella-mccartney-x-veuve-clicquot-vegea-frayme-grape-waste-woven-bag-spritesheet.webp", alt: "Stella McCartney and Veuve Clicquot VEGEA Frayme bag", category: "Plant-based cellulosic" },
  { code: "PL04", spriteSheet: "/spritesheets/zara-pinatex-sandal-spritesheet.webp", cardSpriteSheet: "/spritesheets/cards/zara-pinatex-sandal-spritesheet.webp", alt: "Zara Piñatex sandal", category: "Plant-based cellulosic" },
  { code: "PL05", spriteSheet: "/spritesheets/zara-pinatex-bag-spritesheet.webp", cardSpriteSheet: "/spritesheets/cards/zara-pinatex-bag-spritesheet.webp", alt: "Zara Piñatex bag", category: "Plant-based cellulosic" },
  { code: "PL06", spriteSheet: "/spritesheets/xtep-pla-windbreaker-spritesheet.webp", cardSpriteSheet: "/spritesheets/cards/xtep-pla-windbreaker-spritesheet.webp", alt: "Xtep PLA windbreaker", category: "Plant-based cellulosic" },
  { code: "PL07", spriteSheet: "/spritesheets/allbirds-wool-runners-spritesheet.webp", cardSpriteSheet: "/spritesheets/cards/allbirds-wool-runners-spritesheet.webp", alt: "Allbirds Wool Runners", category: "Plant-based cellulosic" },
  { code: "PL08", spriteSheet: "/spritesheets/reishi-spritesheet.webp", cardSpriteSheet: "/spritesheets/cards/reishi-spritesheet.webp", alt: "Reishi bio-based garment", category: "Plant-based cellulosic" },
  { code: "PL09", spriteSheet: "/spritesheets/ferragamo-orange-fiber-collection-2017-spritesheet.webp", cardSpriteSheet: "/spritesheets/cards/ferragamo-orange-fiber-collection-2017-spritesheet.webp", alt: "Ferragamo Orange Fiber Collection, 2017", category: "Plant-based cellulosic" },
  { code: "PL10", spriteSheet: "/spritesheets/stella-mccartney-mylo-bustier-and-trousers-2021-spritesheet.webp", cardSpriteSheet: "/spritesheets/cards/stella-mccartney-mylo-bustier-and-trousers-2021-spritesheet.webp", alt: "Stella McCartney Mylo bustier and trousers, 2021", category: "Plant-based cellulosic" },
  { code: "PL11", spriteSheet: "/spritesheets/coprinus-spritesheet.webp", cardSpriteSheet: "/spritesheets/cards/coprinus-spritesheet.webp", alt: "Coprinus bioassembled garment", category: "Plant-based cellulosic" },
  { code: "PL12", spriteSheet: "/spritesheets/osman-yousefzada-ss22-tencel-luxe-spritesheet.webp", cardSpriteSheet: "/spritesheets/cards/osman-yousefzada-ss22-tencel-luxe-spritesheet.webp", alt: "Osman Yousefzada Spring/Summer 2022 Tencel Luxe garment", category: "Plant-based cellulosic" },
  { code: "PL13", spriteSheet: "/spritesheets/yuima-nakazato-couture-with-brewed-protein-spritesheet.webp", cardSpriteSheet: "/spritesheets/cards/yuima-nakazato-couture-with-brewed-protein-spritesheet.webp", alt: "Yuima Nakazato couture with Brewed Protein", category: "Plant-based cellulosic" },
  { code: "PL14", spriteSheet: "/spritesheets/christian-siriano-ss2025-circ-lyocell-spritesheet.webp", cardSpriteSheet: "/spritesheets/cards/christian-siriano-ss2025-circ-lyocell-spritesheet.webp", alt: "Christian Siriano Spring/Summer 2025 Circ Lyocell design", category: "Plant-based cellulosic" },
  { code: "PL15", spriteSheet: "/spritesheets/slk-orangefiber-tieorange-fiber-collection-e-marinalla-spritesheet.webp", cardSpriteSheet: "/spritesheets/cards/slk-orangefiber-tieorange-fiber-collection-e-marinalla-spritesheet.webp", alt: "E. Marinella Orange Fiber tie", category: "Plant-based cellulosic" },
  { code: "PL16", spriteSheet: "/spritesheets/orange-fiber-x-h-m-conscious-exclusive-collection-2019-spritesheet.webp", cardSpriteSheet: "/spritesheets/cards/orange-fiber-x-h-m-conscious-exclusive-collection-2019-spritesheet.webp", alt: "Orange Fiber and H&M Conscious Exclusive Collection, 2019", category: "Plant-based cellulosic" },
];
