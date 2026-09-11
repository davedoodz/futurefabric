import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Product } from "../data/products";
import { PRODUCT_INFO } from "../data/productInfo";
import "./MaterialScan.css";

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
  const phase = [...product.code].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 13;
  const photo = PHOTOGRAPHS[product.code] ? `/material-scans/${product.code}.webp` : null;
  return (
    <div ref={root} className="material-scan" data-running={visible && pageVisible && !paused}
      style={{ "--scan-phase": `${-phase}s` } as CSSProperties}>
      <div className="material-scan__field" aria-hidden="true" data-depth="5">
        <div className="material-scan__target material-scan__target--primary"><span>01 / LOCK</span><i /></div>
        <div className="material-scan__target material-scan__target--secondary"><span>02</span></div>
        <div className="material-scan__sweep" />
        <div className="material-scan__crosshair">+</div>
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
        <span className="material-scan__material">{PRODUCT_INFO[product.code].material}</span>
        <small>REPRESENTATIVE CHEMISTRY · NOT AN ASSAY</small>
      </div>
    </div>
  );
}
