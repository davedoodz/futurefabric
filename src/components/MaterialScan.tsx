import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Product } from "../data/products";
import { PRODUCT_INFO } from "../data/productInfo";
import "./MaterialScan.css";

// Representative chemistry, not a lab assay or the full garment composition.
const CELLULOSE = { name: "CELLULOSE", formula: "(C₆H₁₀O₅)ₙ", bonds: "β–1,4 / GLYCOSIDIC" };
const PROTEIN = { name: "POLYPEPTIDE", formula: "[–NH–CHR–CO–]ₙ", bonds: "AMINO ACIDS / PEPTIDE" };
const MYCELIUM = { name: "CHITIN + β–GLUCANS", formula: "(C₈H₁₃NO₅)ₙ / (C₆H₁₀O₅)ₙ", bonds: "FUNGAL CELL-WALL POLYMERS" };
const CHEMISTRY: Record<string, typeof CELLULOSE> = {
  "BSP-01": { name: "GRAPE-MARC COMPOSITE", formula: "CELLULOSE / POLYMER BINDER", bonds: "MULTICOMPONENT / NO SINGLE FORMULA" },
  "BSP-02": { name: "POLYLACTIC ACID", formula: "(C₃H₄O₂)ₙ", bonds: "ESTER / BIO-BASED POLYMER" },
  "BSP-03": PROTEIN,
};
const PHOTOGRAPHS: Record<string, true> = { "MFB-01": true, "PBC-01": true, "BSP-01": true, "PRO-02": true, "BSP-03": true };
export default function MaterialScan({ product, paused }: { product: Product; paused: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    const card = root.current?.closest(".product-card");
    if (card) observer.observe(card);
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);
  const chemistry = CHEMISTRY[product.code] ?? (product.category === "Protein-based" ? PROTEIN
    : product.category === "Microbial and fungal bioassembled" ? MYCELIUM : CELLULOSE);
  const phase = [...product.code].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 13;
  const photo = PHOTOGRAPHS[product.code] ? `/material-scans/${product.code}.webp` : null;
  return (
    <div ref={root} className="material-scan" data-running={visible && pageVisible && !paused}
      style={{ "--scan-phase": `${-phase}s` } as CSSProperties}>
      <div className="material-scan__field" aria-hidden="true" data-depth="5">
        <div className="material-scan__contour">
          <svg viewBox="0 0 240 220" fill="none">
            <path d="M46 35C75 9 118 26 150 18S219 48 210 82S229 141 194 170S143 183 109 201S47 177 32 146S13 66 46 35Z" />
            <path d="M63 47C89 28 119 42 149 34S202 58 193 86S210 135 181 158S141 167 110 184S62 165 47 138S34 70 63 47Z" />
          </svg>
        </div>
        <div className="material-scan__target material-scan__target--primary"><span>01 / LOCK</span><i /></div>
        <div className="material-scan__target material-scan__target--secondary"><span>02</span></div>
        <div className="material-scan__sweep" />
        <div className="material-scan__crosshair">+</div>
        <svg className="material-scan__bonds" viewBox="0 0 110 45">
          <path d="M4 23H22L34 5L57 5L70 23L57 41H34L22 23M70 23H89L105 8" />
        </svg>
      </div>
      {photo ? (
        <div className="material-scan__photos" aria-label={`${product.name} photograph and material surface detail`} data-depth="2">
          <figure className="material-scan__photo">
            <img src={photo} alt={`${product.name} product photograph`} loading="lazy" />
            <figcaption>01 / ARCHIVE</figcaption>
          </figure>
          <figure className="material-scan__photo material-scan__photo--detail">
            <div><img src={`/material-scans/${product.code}-surface.webp`} alt={`Cropped surface of ${PRODUCT_INFO[product.code].material}`} loading="lazy" /></div>
            <figcaption>02 / SURFACE CROP</figcaption>
          </figure>
        </div>
      ) : null}
      <div className="material-scan__readout" data-depth="4">
        <div className="material-scan__status"><span>■ {product.code} / MATERIAL STUDY</span><span aria-hidden="true">↗</span></div>
        <strong>{chemistry.name}</strong>
        <span className="material-scan__formula">{chemistry.formula}</span>
        <span>{chemistry.bonds}</span>
        <span className="material-scan__material">{PRODUCT_INFO[product.code].material}</span>
        <small>REPRESENTATIVE CHEMISTRY · NOT AN ASSAY</small>
      </div>
    </div>
  );
}
