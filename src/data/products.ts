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
  name: string;
  companies: string;
}

export function gridSpriteSheet(product: Product) {
  const filename = product.spriteSheet.slice(product.spriteSheet.lastIndexOf("/") + 1);
  return `/spritesheets-36/grid/${filename}`;
}

// All sheets are 6 columns × 6 rows (36 square frames).
export const PRODUCTS: Product[] = [
  { code: "MFB-01", name: "Ephea mycelium winter coat", companies: "Balenciaga", spriteSheet: "/spritesheets-36/balenciaga-ephea-mycelium-coat-fw2022-spritesheet.webp", cardSpriteSheet: "/spritesheets-36/cards/balenciaga-ephea-mycelium-coat-fw2022-spritesheet.webp", alt: "Balenciaga Ephea mycelium coat, Fall/Winter 2022", category: "Microbial and fungal bioassembled" },
  { code: "PBC-01", name: "Happy Pineapple Piñatex sneakers", companies: "Nike × Piñatex", spriteSheet: "/spritesheets-36/nike-partners-with-pinatex-for-happy-pineapple-plant-based-sneaker-collection-spritesheet.webp", cardSpriteSheet: "/spritesheets-36/cards/nike-partners-with-pinatex-for-happy-pineapple-plant-based-sneaker-collection-spritesheet.webp", alt: "Nike Happy Pineapple Piñatex sneakers", category: "Plant-based cellulosic" },
  { code: "BSP-01", name: "VEGEA grape-waste Frayme bag", companies: "Stella McCartney × Veuve Clicquot", spriteSheet: "/spritesheets-36/stella-mccartney-x-veuve-clicquot-vegea-frayme-grape-waste-woven-bag-spritesheet.webp", cardSpriteSheet: "/spritesheets-36/cards/stella-mccartney-x-veuve-clicquot-vegea-frayme-grape-waste-woven-bag-spritesheet.webp", alt: "Stella McCartney and Veuve Clicquot VEGEA Frayme bag", category: "Bio-based synthetic polymers" },
  { code: "PBC-02", name: "Piñatex pineapple-fiber woven sandal", companies: "Zara × Piñatex", spriteSheet: "/spritesheets-36/zara-pinatex-sandal-spritesheet.webp", cardSpriteSheet: "/spritesheets-36/cards/zara-pinatex-sandal-spritesheet.webp", alt: "Zara Piñatex sandal", category: "Plant-based cellulosic" },
  { code: "PBC-03", name: "Piñatex pineapple-fiber woven bag", companies: "Zara × Piñatex", spriteSheet: "/spritesheets-36/zara-pinatex-bag-spritesheet.webp", cardSpriteSheet: "/spritesheets-36/cards/zara-pinatex-bag-spritesheet.webp", alt: "Zara Piñatex bag", category: "Plant-based cellulosic" },
  { code: "BSP-02", name: "PLA corn-based technical windbreaker", companies: "Xtep", spriteSheet: "/spritesheets-36/xtep-pla-windbreaker-spritesheet.webp", cardSpriteSheet: "/spritesheets-36/cards/xtep-pla-windbreaker-spritesheet.webp", alt: "Xtep PLA windbreaker", category: "Bio-based synthetic polymers" },
  { code: "PRO-01", name: "Wool-fiber Runners sneakers", companies: "Allbirds", spriteSheet: "/spritesheets-36/allbirds-wool-runners-spritesheet.webp", cardSpriteSheet: "/spritesheets-36/cards/allbirds-wool-runners-spritesheet.webp", alt: "Allbirds Wool Runners", category: "Protein-based" },
  { code: "MFB-02", name: "Reishi mycelium bio-based garment", companies: "MycoWorks", spriteSheet: "/spritesheets-36/reishi-spritesheet.webp", cardSpriteSheet: "/spritesheets-36/cards/reishi-spritesheet.webp", alt: "Reishi bio-based garment", category: "Microbial and fungal bioassembled" },
  { code: "PBC-04", name: "Orange Fiber citrus-cellulose collection", companies: "Salvatore Ferragamo", spriteSheet: "/spritesheets-36/ferragamo-orange-fiber-collection-2017-spritesheet.webp", cardSpriteSheet: "/spritesheets-36/cards/ferragamo-orange-fiber-collection-2017-spritesheet.webp", alt: "Ferragamo Orange Fiber Collection, 2017", category: "Plant-based cellulosic" },
  { code: "MFB-03", name: "Mylo mycelium bustier and trousers", companies: "Stella McCartney × Bolt Threads", spriteSheet: "/spritesheets-36/stella-mccartney-mylo-bustier-and-trousers-2021-spritesheet.webp", cardSpriteSheet: "/spritesheets-36/cards/stella-mccartney-mylo-bustier-and-trousers-2021-spritesheet.webp", alt: "Stella McCartney Mylo bustier and trousers, 2021", category: "Microbial and fungal bioassembled" },
  { code: "MFB-04", name: "Coprinus mycelium bioassembled garment", companies: "Mogu", spriteSheet: "/spritesheets-36/coprinus-spritesheet.webp", cardSpriteSheet: "/spritesheets-36/cards/coprinus-spritesheet.webp", alt: "Coprinus bioassembled garment", category: "Microbial and fungal bioassembled" },
  { code: "PBC-05", name: "Tencel Luxe wood-pulp lyocell garment", companies: "Osman Yousefzada × Lenzing", spriteSheet: "/spritesheets-36/osman-yousefzada-ss22-tencel-luxe-spritesheet.webp", cardSpriteSheet: "/spritesheets-36/cards/osman-yousefzada-ss22-tencel-luxe-spritesheet.webp", alt: "Osman Yousefzada Spring/Summer 2022 Tencel Luxe garment", category: "Plant-based cellulosic" },
  { code: "PRO-02", name: "Brewed Protein silk-protein couture", companies: "Yuima Nakazato × Spiber", spriteSheet: "/spritesheets-36/yuima-nakazato-couture-with-brewed-protein-spritesheet.webp", cardSpriteSheet: "/spritesheets-36/cards/yuima-nakazato-couture-with-brewed-protein-spritesheet.webp", alt: "Yuima Nakazato couture with Brewed Protein", category: "Protein-based" },
  { code: "PBC-06", name: "Circ Lyocell wood-pulp design", companies: "Christian Siriano × Circ", spriteSheet: "/spritesheets-36/christian-siriano-ss2025-circ-lyocell-spritesheet.webp", cardSpriteSheet: "/spritesheets-36/cards/christian-siriano-ss2025-circ-lyocell-spritesheet.webp", alt: "Christian Siriano Spring/Summer 2025 Circ Lyocell design", category: "Plant-based cellulosic" },
  { code: "PBC-07", name: "Orange Fiber citrus-cellulose silk tie", companies: "E. Marinella", spriteSheet: "/spritesheets-36/slk-orangefiber-tieorange-fiber-collection-e-marinalla-spritesheet.webp", cardSpriteSheet: "/spritesheets-36/cards/slk-orangefiber-tieorange-fiber-collection-e-marinalla-spritesheet.webp", alt: "E. Marinella Orange Fiber tie", category: "Plant-based cellulosic" },
  { code: "PBC-08", name: "Orange Fiber citrus-cellulose collection", companies: "Orange Fiber × H&M", spriteSheet: "/spritesheets-36/orange-fiber-x-h-m-conscious-exclusive-collection-2019-spritesheet.webp", cardSpriteSheet: "/spritesheets-36/cards/orange-fiber-x-h-m-conscious-exclusive-collection-2019-spritesheet.webp", alt: "Orange Fiber and H&M Conscious Exclusive Collection, 2019", category: "Plant-based cellulosic" },
  { code: "BSP-03", name: "Spiber brewed-protein Moon Parka jacket", companies: "The North Face × Spiber", spriteSheet: "/spritesheets-36/northface-spritesheet.webp", cardSpriteSheet: "/spritesheets-36/cards/northface-spritesheet.webp", alt: "The North Face Spiber Moon Parka", category: "Bio-based synthetic polymers" },
];

