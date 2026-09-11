import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { Product } from "../data/products";
import { PRODUCT_INFO } from "../data/productInfo";
import SpriteViewer from "./SpriteViewer";
import CustomCursor from "./CustomCursor";

// Buffer above the 220ms `focus-product-out` CSS animation (index.css) so the
// dialog still closes if the animationend event never fires (e.g. animation
// interrupted, style recalculation skipped, or reduced-motion media query
// changes mid-transition).
const CLOSE_FALLBACK_MS = 300;

interface Props {
  product: Product | null;
  onClose: () => void;
  grabEnabled: boolean;
}

export default function ProductFocusModal({ product, onClose, grabEnabled }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [closing, setClosing] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    document.body.classList.toggle("modal-open", Boolean(product));
    if (product && dialog && !dialog.open) {
      setClosing(false);
      dialog.showModal();
    }

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [product]);

  useEffect(() => clearCloseTimeout, []);

  const requestClose = () => {
    const dialog = dialogRef.current;
    if (!dialog || closing) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      dialog.close();
      return;
    }

    setClosing(true);
    clearCloseTimeout();
    closeTimeoutRef.current = window.setTimeout(() => {
      closeTimeoutRef.current = null;
      dialogRef.current?.close();
    }, CLOSE_FALLBACK_MS);
  };

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) requestClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className="product-focus"
      data-closing={closing}
      aria-label={product ? `${product.alt} full-screen view` : undefined}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onClose={() => {
        clearCloseTimeout();
        setClosing(false);
        onClose();
      }}
      onClick={handleBackdropClick}
    >
      <CustomCursor modal />
      {product ? (
        <div
          className="product-focus__content"
          onAnimationEnd={(event) => {
            if (
              closing &&
              event.animationName === "focus-product-out" &&
              event.target === event.currentTarget
            ) {
              clearCloseTimeout();
              dialogRef.current?.close();
            }
          }}
        >
          <SpriteViewer
            src={product.spriteSheet}
            alt={product.alt}
            className="sprite-viewer--focus"
            eager
            grabEnabled={grabEnabled}
          />
          <section className="product-focus__bar" aria-label={`${product.name} specifications`}>
            <div className="product-focus__identity">
              <p className="product-focus__code">{product.code}</p>
              <h2 className="product-focus__title">{product.name}</h2>
              <p className="product-focus__companies">{product.companies}</p>
            </div>
            <dl className="product-focus__specs">
              <div>
                <dt>Material</dt>
                <dd>{PRODUCT_INFO[product.code].material}</dd>
              </div>
              <div>
                <dt>Construction</dt>
                <dd>{PRODUCT_INFO[product.code].construction}</dd>
              </div>
              <div>
                <dt>Origin</dt>
                <dd>{PRODUCT_INFO[product.code].origin}</dd>
              </div>
            </dl>
            <a
              className="product-focus__link"
              href={PRODUCT_INFO[product.code].productUrl}
              target="_blank"
              rel="noreferrer"
            >
              <span>View product page</span>
              <span className="material-symbols-outlined" aria-hidden="true">arrow_outward</span>
            </a>
          </section>
        </div>
      ) : null}
    </dialog>
  );
}
