import type { Product } from "./products";
import molecules from "./molecules.json";

export interface MaterialChemistry {
  name: string;
  formula: string;
  bonds: string;
  model: keyof typeof molecules;
  modelLabel: string;
}

// PubChem 3D conformers are representative building blocks, not complete blends.
const CELLULOSE: MaterialChemistry = {
  name: "CELLULOSE", formula: "(C₆H₁₀O₅)ₙ", bonds: "β–1,4 / GLYCOSIDIC",
  model: "cellulose", modelLabel: "CELLOBIOSE / CHAIN SEGMENT",
};
const PROTEIN: MaterialChemistry = {
  name: "POLYPEPTIDE", formula: "[–NH–CHR–CO–]ₙ", bonds: "AMINO ACIDS / PEPTIDE",
  model: "peptide", modelLabel: "GLYCYLGLYCINE / BACKBONE MODEL",
};
const MYCELIUM: MaterialChemistry = {
  name: "CHITIN + β–GLUCANS", formula: "(C₈H₁₃NO₅)ₙ / (C₆H₁₀O₅)ₙ", bonds: "FUNGAL CELL-WALL POLYMERS",
  model: "chitin", modelLabel: "N-ACETYLGLUCOSAMINE / CHITIN UNIT",
};
const PRODUCT_CHEMISTRY: Record<string, MaterialChemistry> = {
  "BSP-01": {
    name: "GRAPE-MARC COMPOSITE", formula: "CELLULOSE / POLYMER BINDER", bonds: "MULTICOMPONENT / NO SINGLE FORMULA",
    model: "cellulose", modelLabel: "CELLOBIOSE / CELLULOSE FRACTION",
  },
  "BSP-02": {
    name: "POLYLACTIC ACID", formula: "(C₃H₄O₂)ₙ", bonds: "ESTER / BIO-BASED POLYMER",
    model: "pla", modelLabel: "LACTIC ACID / PLA PRECURSOR",
  },
  "BSP-03": PROTEIN,
};
export function materialChemistry(product: Product): MaterialChemistry {
  return PRODUCT_CHEMISTRY[product.code] ?? (product.category === "Protein-based" ? PROTEIN
    : product.category === "Microbial and fungal bioassembled" ? MYCELIUM : CELLULOSE);
}
export function moleculeDisplayName(value: string) {
  return value.toLocaleLowerCase().replace(/(^|[\s/–+()-])([a-z])/g, (_, prefix: string, letter: string) => `${prefix}${letter.toLocaleUpperCase()}`);
}
export { molecules };
