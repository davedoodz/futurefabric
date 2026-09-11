import type { Product } from "./products";

export interface ProductInfo {
  material: string;
  construction: string;
  origin: string;
  productUrl: string;
}

const BRAND_HOME = {
  balenciaga: "https://www.balenciaga.com/",
  nike: "https://www.nike.com/",
  stella: "https://www.stellamccartney.com/us/en/frayme-veuve-clicquot-bucket-bag-7B0088WP03791000.html",
  zara: "https://www.zara.com/us/en/",
  xtep: "https://www.xtep.com.cn/",
  allbirds: "https://www.allbirds.com/products/womens-wool-runners",
  mycoworks: "https://www.mycoworks.com/blog/reishi-mycelium-material",
  ferragamo: "https://sustainability.ferragamo.com/en/products-materials/orange-fiber-capsule-collection",
  mogu: "https://mogu.bio/",
  lenzing: "https://www.lenzing.com/newsroom/news-events/tenceltm-luxe-on-track-to-achieve-strong-growth-in-2022-as-eco-couture-movement-booms/",
  spiber: "https://spiber.inc/en/yuimanakazato/cosmos/",
  circ: "https://circ.earth/",
  marinella: "https://www.emarinella.eu/",
  hm: "https://www2.hm.com/",
  northface: "https://www.thenorthface.com/",
} as const;

export const PRODUCT_INFO: Record<Product["code"], ProductInfo> = {
  "MFB-01": { material: "Ephea mycelium leather", construction: "Mycelium composite outer", origin: "France", productUrl: BRAND_HOME.balenciaga },
  "PBC-01": { material: "Piñatex pineapple-leaf fiber", construction: "Piñatex upper · Nike Grind sole", origin: "Philippines / Vietnam", productUrl: BRAND_HOME.nike },
  "BSP-01": { material: "VEGEA grape-waste leather", construction: "Grape-marc composite · woven finish", origin: "Italy", productUrl: BRAND_HOME.stella },
  "PBC-02": { material: "Piñatex pineapple-leaf fiber", construction: "Plant-based upper · rubber sole", origin: "Spain", productUrl: BRAND_HOME.zara },
  "PBC-03": { material: "Piñatex pineapple-leaf fiber", construction: "Plant-based outer · textile lining", origin: "Spain", productUrl: BRAND_HOME.zara },
  "BSP-02": { material: "PLA biopolymer", construction: "Bio-based synthetic shell", origin: "China", productUrl: BRAND_HOME.xtep },
  "PRO-01": { material: "ZQ Merino wool", construction: "Merino knit · SweetFoam sole", origin: "New Zealand / Vietnam", productUrl: BRAND_HOME.allbirds },
  "MFB-02": { material: "Reishi mycelium leather", construction: "Mycelium-grown leather panel", origin: "United States", productUrl: BRAND_HOME.mycoworks },
  "PBC-04": { material: "Orange Fiber citrus cellulose", construction: "Citrus-cellulose silk textile", origin: "Italy", productUrl: BRAND_HOME.ferragamo },
  "MFB-03": { material: "Mylo mycelium leather", construction: "Mycelium-grown leather tailoring", origin: "United Kingdom", productUrl: BRAND_HOME.stella },
  "MFB-04": { material: "Coprinus fungal mycelium", construction: "Bioassembled mycelium textile", origin: "Italy", productUrl: BRAND_HOME.mogu },
  "PBC-05": { material: "Tencel Luxe cellulosic filament", construction: "Wood-based lyocell filament", origin: "Austria", productUrl: BRAND_HOME.lenzing },
  "PRO-02": { material: "Brewed Protein™ fiber", construction: "Fermentation-made structural fiber", origin: "Japan", productUrl: BRAND_HOME.spiber },
  "PBC-06": { material: "Circ Lyocell recycled cellulose", construction: "Textile-to-textile regenerated fiber", origin: "United States", productUrl: BRAND_HOME.circ },
  "PBC-07": { material: "Orange Fiber citrus cellulose", construction: "Citrus-cellulose woven tie", origin: "Italy", productUrl: BRAND_HOME.marinella },
  "PBC-08": { material: "Orange Fiber citrus cellulose", construction: "Citrus-cellulose blended textile", origin: "Italy", productUrl: BRAND_HOME.hm },
  "BSP-03": { material: "Brewed Protein™ fiber", construction: "Bio-based parka textile", origin: "Japan / United States", productUrl: BRAND_HOME.northface },
};
