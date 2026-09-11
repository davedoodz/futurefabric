export type Category =
  | "All products"
  | "Plant-based cellulosic"
  | "Protein-based"
  | "Bio-based synthetic polymers"
  | "Microbial and fungal bioassembled";

export const CATEGORIES: Category[] = [
  "All products",
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
  { code: "MFB-01", name: "EPHEA™ Floor-Length Coat", companies: "Balenciaga", spriteSheet: "/spritesheets-36/balenciaga-ephea-mycelium-coat-fw2022-spritesheet.webp", cardSpriteSheet: "/spritesheets-36/cards/balenciaga-ephea-mycelium-coat-fw2022-spritesheet.webp", alt: "Balenciaga EPHEA floor-length coat, Winter 2022", category: "Microbial and fungal bioassembled" },
  { code: "PBC-01", name: "Air Max 90 Happy Pineapple", companies: "Nike × Piñatex", spriteSheet: "/spritesheets-36/nike-partners-with-pinatex-for-happy-pineapple-plant-based-sneaker-collection-spritesheet.webp", cardSpriteSheet: "/spritesheets-36/cards/nike-partners-with-pinatex-for-happy-pineapple-plant-based-sneaker-collection-spritesheet.webp", alt: "Nike Air Max 90 Happy Pineapple sneakers", category: "Plant-based cellulosic" },
  { code: "BSP-01", name: "Frayme Veuve Clicquot Bucket Bag", companies: "Stella McCartney × Veuve Clicquot", spriteSheet: "/spritesheets-36/stella-mccartney-x-veuve-clicquot-vegea-frayme-grape-waste-woven-bag-spritesheet.webp", cardSpriteSheet: "/spritesheets-36/cards/stella-mccartney-x-veuve-clicquot-vegea-frayme-grape-waste-woven-bag-spritesheet.webp", alt: "Stella McCartney Frayme Veuve Clicquot Bucket Bag", category: "Bio-based synthetic polymers" },
  { code: "PBC-02", name: "Piñatex® Sandal", companies: "Zara × Piñatex", spriteSheet: "/spritesheets-36/zara-pinatex-sandal-spritesheet.webp", cardSpriteSheet: "/spritesheets-36/cards/zara-pinatex-sandal-spritesheet.webp", alt: "Zara Piñatex sandal", category: "Plant-based cellulosic" },
  { code: "PBC-03", name: "Tote Bag by Piñatex®", companies: "Zara × Piñatex", spriteSheet: "/spritesheets-36/zara-pinatex-bag-spritesheet.webp", cardSpriteSheet: "/spritesheets-36/cards/zara-pinatex-bag-spritesheet.webp", alt: "Zara Tote Bag by Piñatex", category: "Plant-based cellulosic" },
  { code: "BSP-02", name: "PLA Windbreaker", companies: "Xtep", spriteSheet: "/spritesheets-36/xtep-pla-windbreaker-spritesheet.webp", cardSpriteSheet: "/spritesheets-36/cards/xtep-pla-windbreaker-spritesheet.webp", alt: "Xtep PLA Windbreaker", category: "Bio-based synthetic polymers" },
  { code: "PRO-01", name: "Wool Runner", companies: "Allbirds", spriteSheet: "/spritesheets-36/allbirds-wool-runners-spritesheet.webp", cardSpriteSheet: "/spritesheets-36/cards/allbirds-wool-runners-spritesheet.webp", alt: "Allbirds Wool Runner", category: "Protein-based" },
  { code: "MFB-02", name: "Reishi™", companies: "MycoWorks", spriteSheet: "/spritesheets-36/reishi-spritesheet.webp", cardSpriteSheet: "/spritesheets-36/cards/reishi-spritesheet.webp", alt: "MycoWorks Reishi material garment", category: "Microbial and fungal bioassembled" },
  { code: "PBC-04", name: "Orange Fiber Capsule Collection", companies: "Salvatore Ferragamo", spriteSheet: "/spritesheets-36/ferragamo-orange-fiber-collection-2017-spritesheet.webp", cardSpriteSheet: "/spritesheets-36/cards/ferragamo-orange-fiber-collection-2017-spritesheet.webp", alt: "Salvatore Ferragamo Orange Fiber Capsule Collection, 2017", category: "Plant-based cellulosic" },
  { code: "MFB-03", name: "Mylo™ Bustier and Trousers", companies: "Stella McCartney × Bolt Threads", spriteSheet: "/spritesheets-36/stella-mccartney-mylo-bustier-and-trousers-2021-spritesheet.webp", cardSpriteSheet: "/spritesheets-36/cards/stella-mccartney-mylo-bustier-and-trousers-2021-spritesheet.webp", alt: "Stella McCartney Mylo bustier and trousers, 2021", category: "Microbial and fungal bioassembled" },
  { code: "MFB-04", name: "Coprinus", companies: "Mogu", spriteSheet: "/spritesheets-36/coprinus-spritesheet.webp", cardSpriteSheet: "/spritesheets-36/cards/coprinus-spritesheet.webp", alt: "Mogu Coprinus bioassembled garment", category: "Microbial and fungal bioassembled" },
  { code: "PBC-05", name: "TENCEL™ Luxe", companies: "Osman Yousefzada × Lenzing", spriteSheet: "/spritesheets-36/osman-yousefzada-ss22-tencel-luxe-spritesheet.webp", cardSpriteSheet: "/spritesheets-36/cards/osman-yousefzada-ss22-tencel-luxe-spritesheet.webp", alt: "Osman Yousefzada Spring/Summer 2022 TENCEL Luxe garment", category: "Plant-based cellulosic" },
  { code: "PRO-02", name: "Brewed Protein™ Couture", companies: "Yuima Nakazato × Spiber", spriteSheet: "/spritesheets-36/yuima-nakazato-couture-with-brewed-protein-spritesheet.webp", cardSpriteSheet: "/spritesheets-36/cards/yuima-nakazato-couture-with-brewed-protein-spritesheet.webp", alt: "Yuima Nakazato couture with Brewed Protein", category: "Protein-based" },
  { code: "PBC-06", name: "Circ Lyocell", companies: "Christian Siriano × Circ", spriteSheet: "/spritesheets-36/christian-siriano-ss2025-circ-lyocell-spritesheet.webp", cardSpriteSheet: "/spritesheets-36/cards/christian-siriano-ss2025-circ-lyocell-spritesheet.webp", alt: "Christian Siriano Spring/Summer 2025 Circ Lyocell design", category: "Plant-based cellulosic" },
  { code: "PBC-07", name: "E. Marinella made with Orange Fiber", companies: "E. Marinella", spriteSheet: "/spritesheets-36/slk-orangefiber-tieorange-fiber-collection-e-marinalla-spritesheet.webp", cardSpriteSheet: "/spritesheets-36/cards/slk-orangefiber-tieorange-fiber-collection-e-marinalla-spritesheet.webp", alt: "E. Marinella made with Orange Fiber tie", category: "Plant-based cellulosic" },
  { code: "PBC-08", name: "Conscious Exclusive 2019", companies: "Orange Fiber × H&M", spriteSheet: "/spritesheets-36/orange-fiber-x-h-m-conscious-exclusive-collection-2019-spritesheet.webp", cardSpriteSheet: "/spritesheets-36/cards/orange-fiber-x-h-m-conscious-exclusive-collection-2019-spritesheet.webp", alt: "H&M Conscious Exclusive 2019 Orange Fiber garment", category: "Plant-based cellulosic" },
  { code: "BSP-03", name: "Moon Parka", companies: "The North Face × Spiber", spriteSheet: "/spritesheets-36/northface-spritesheet.webp", cardSpriteSheet: "/spritesheets-36/cards/northface-spritesheet.webp", alt: "The North Face Moon Parka", category: "Bio-based synthetic polymers" },
];

