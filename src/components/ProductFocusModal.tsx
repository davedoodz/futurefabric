import { useDialKit } from "dialkit";
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type WheelEvent as ReactWheelEvent } from "react";
import type { Product } from "../data/products";
import { PRODUCT_INFO } from "../data/productInfo";
import { materialChemistry, moleculeDisplayName } from "../data/materialChemistry";
import { EditableText } from "../lib/copy";
import { scheduleSharedLayoutSave } from "../lib/layoutPersistence";
import SpriteViewer from "./SpriteViewer";
import CustomCursor from "./CustomCursor";
import MoleculeViewer from "./MoleculeViewer";

// Buffer above the 280ms shared-element exit so the dialog still closes if
// animationend is interrupted or skipped.
const CLOSE_FALLBACK_MS = 340;

interface Props {
  product: Product | null;
  sourceRect: DOMRect | null;
  initialFrame: number;
  onClose: () => void;
  grabEnabled: boolean;
  darkMode: boolean;
}
export default function ProductFocusModal({ product, sourceRect, initialFrame, onClose, grabEnabled, darkMode }: Props) {
  const arrow = useDialKit(
    "Product link arrow",
    {
      x: [0, -80, 80, 1],
      y: [0, -80, 80, 1],
      size: [18, 8, 64, 1],
    },
    { id: "product-link-arrow", persist: true },
  );

  useEffect(() => {
    scheduleSharedLayoutSave();
  }, [arrow.size]);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [closing, setClosing] = useState(false);
  const [zoom, setZoom] = useState(1);

  const focusSize = typeof window === "undefined"
    ? 720
    : Math.min(window.innerWidth, window.innerHeight) * 0.72;
  const motionStyle = {
    "--focus-source-x": `${sourceRect ? sourceRect.left + sourceRect.width / 2 - window.innerWidth / 2 : 0}px`,
    "--focus-source-y": `${sourceRect ? sourceRect.top + sourceRect.height / 2 - window.innerHeight / 2 : 0}px`,
    "--focus-source-scale": sourceRect ? sourceRect.width / Math.min(focusSize, 720) : 0.88,
    "--focus-zoom": zoom,
  } as CSSProperties;
  const closeTimeoutRef = useRef<number | null>(null);
  const dismissedRef = useRef(false);

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    document.body.classList.toggle("modal-open", Boolean(product));
    setZoom(1);
    if (product && dialog && !dialog.open) {
      dismissedRef.current = false;
      setClosing(false);
      dialog.showModal();
    }

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [product]);
  const finishClose = () => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    const closingProductCode = product?.code;
    clearCloseTimeout();
    dialogRef.current?.close();
    setClosing(false);
    onClose();
    if (closingProductCode) {
      window.dispatchEvent(new CustomEvent("sprite-visibility-refresh", { detail: closingProductCode }));
    }
  };

  const requestClose = () => {
    const dialog = dialogRef.current;
    if (!dialog || closing) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishClose();
      return;
    }

    setClosing(true);
    clearCloseTimeout();
    closeTimeoutRef.current = window.setTimeout(finishClose, CLOSE_FALLBACK_MS);
  };

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) requestClose();
  };


  const handleContentClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target;
    if (!(target instanceof Element) || target.closest(".product-focus__bar") || target.closest(".molecule-viewer")) return;

    const viewer = target.closest<HTMLElement>(".sprite-viewer--focus");
    if (viewer?.dataset.pixelHover === "true") return;
    requestClose();
  };
  const handleWheel = (event: ReactWheelEvent<HTMLDialogElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setZoom((current) => Math.min(2.5, Math.max(0.6, current - event.deltaY * 0.001)));
  };

  return (
    <dialog ref={dialogRef} className="product-focus" data-closing={closing} data-dark-mode={darkMode} style={motionStyle}
      aria-label={product ? `${product.alt} full-screen view` : undefined}
      onCancel={(event) => { event.preventDefault(); requestClose(); }}
      onClose={() => { clearCloseTimeout(); setClosing(false); if (!dismissedRef.current) { dismissedRef.current = true; onClose(); } }}
      onClick={handleBackdropClick} onWheel={handleWheel}>
      <CustomCursor modal />
      {product ? (
        <div className="product-focus__content" onClick={handleContentClick}
          onAnimationEnd={(event) => { if (closing && event.animationName === "focus-shared-out") finishClose(); }}>
          <div className="product-focus__object">
            {darkMode ? <MoleculeViewer product={product} focus zoom={zoom} interactive /> : (
              <SpriteViewer src={product.spriteSheet} alt={product.alt} className="sprite-viewer--focus" eager
                grabEnabled={grabEnabled} transform={`scale(${zoom})`} initialFrame={initialFrame} syncKey={product.code} broadcastFrame />
            )}
          </div>
          <section className="product-focus__bar" aria-label={`${product.name} specifications`}>
            <div className="product-focus__identity">
              <EditableText copyKey={`product.${product.code}.code`} defaultValue={product.code} as="p" className="product-focus__code" />
              <div className="product-focus__title-row">
                {darkMode ? <h2 className="product-focus__title">{moleculeDisplayName(materialChemistry(product).name)}</h2> :
                  <EditableText copyKey={`product.${product.code}.name`} defaultValue={product.name} as="h2" className="product-focus__title" />}
                <a className="product-focus__link" href={PRODUCT_INFO[product.code].productUrl} target="_blank" rel="noreferrer" aria-label={`View ${product.name} product page`}>
                  <span className="material-symbols-outlined" aria-hidden="true" style={{ "--product-arrow-x": `${arrow.x}px`, "--product-arrow-y": `${arrow.y}px`, "--product-arrow-size": `${arrow.size}px` } as CSSProperties}>arrow_outward</span>
                </a>
              </div>
              {darkMode ? <p className="product-focus__companies">{materialChemistry(product).formula} · {moleculeDisplayName(materialChemistry(product).bonds)}</p> :
                <EditableText copyKey={`product.${product.code}.companies`} defaultValue={product.companies} as="p" className="product-focus__companies" />}
            </div>
          </section>
          <dl className="product-focus__specs">
              <div>
                <EditableText copyKey="modal.label.material" defaultValue="Material" as="dt" />
                <EditableText
                  copyKey={`product.${product.code}.material`}
                  defaultValue={PRODUCT_INFO[product.code].material}
                  as="dd"
                />
              </div>
              <div>
                <EditableText copyKey="modal.label.construction" defaultValue="Construction" as="dt" />
                <EditableText
                  copyKey={`product.${product.code}.construction`}
                  defaultValue={PRODUCT_INFO[product.code].construction}
                  as="dd"
                />
              </div>
              <div>
                <EditableText copyKey="modal.label.origin" defaultValue="Origin" as="dt" />
                <EditableText
                  copyKey={`product.${product.code}.origin`}
                  defaultValue={PRODUCT_INFO[product.code].origin}
                  as="dd"
                />
              </div>
          </dl>
        </div>
      ) : null}
    </dialog>
  );
}
