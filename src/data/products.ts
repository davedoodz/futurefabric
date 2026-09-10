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
  image: string;
  alt: string;
  category: Category;
}

// Source imagery pulled directly from the Paper file (fills on the
// "DESKTOP"/"MOBILE" artboards). Labels intentionally keep the design's
// literal placeholder copy ("Product Name" / "Companies") — only the PL0x
// code increments per item so 15 real photos don't render as duplicates.
export const PRODUCTS: Product[] = [
  { code: "PL01", image: "/products/black-leather-coat.png", alt: "Black leather coat", category: "Plant-based cellulosic" },
  { code: "PL02", image: "/products/white-nike-sneakers.png", alt: "White Nike sneakers", category: "Plant-based cellulosic" },
  { code: "PL03", image: "/products/white-tote-bag.png", alt: "White tote bag", category: "Plant-based cellulosic" },
  { code: "PL04", image: "/products/rendered-sandal.png", alt: "3D rendered sandal", category: "Plant-based cellulosic" },
  { code: "PL05", image: "/products/red-black-handbag.png", alt: "Red and black handbag", category: "Plant-based cellulosic" },
  { code: "PL06", image: "/products/orange-hooded-jacket.png", alt: "Orange hooded jacket", category: "Plant-based cellulosic" },
  { code: "PL07", image: "/products/gray-athletic-shoes.png", alt: "Gray athletic shoes", category: "Plant-based cellulosic" },
  { code: "PL08", image: "/products/white-puffer-jacket.png", alt: "White puffer jacket", category: "Plant-based cellulosic" },
  { code: "PL09", image: "/products/brown-bucket-hat.png", alt: "Brown bucket hat", category: "Plant-based cellulosic" },
  { code: "PL10", image: "/products/black-leather-pants.png", alt: "Black leather bustier and pants", category: "Plant-based cellulosic" },
  { code: "PL11", image: "/products/straw-hat-rendering.png", alt: "Straw fedora hat", category: "Plant-based cellulosic" },
  { code: "PL12", image: "/products/dark-blue-draped-garment.png", alt: "Dark blue draped garment", category: "Plant-based cellulosic" },
  { code: "PL13", image: "/products/striped-floral-dress.png", alt: "Striped floral dress", category: "Plant-based cellulosic" },
  { code: "PL14", image: "/products/white-off-shoulder-top.png", alt: "White off-the-shoulder top", category: "Plant-based cellulosic" },
  { code: "PL15", image: "/products/orange-tie-pattern.png", alt: "Orange patterned tie", category: "Plant-based cellulosic" },
];
