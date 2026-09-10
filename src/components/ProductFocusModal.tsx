import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { Product } from "../data/products";
import SpriteViewer from "./SpriteViewer";

// Buffer above the 220ms `focus-product-out` CSS animation (index.css) so the
// dialog still closes if the animationend event never fires (e.g. animation
// interrupted, style recalculation skipped, or reduced-motion media query
// changes mid-transition).
const CLOSE_FALLBACK_MS = 300;

interface Props {
  product: Product | null;
  onClose: () => void;
}

export default function ProductFocusModal({ product, onClose }: Props) {
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
    if (product && dialog && !dialog.open) {
      setClosing(false);
      dialog.showModal();
    }
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
          />
          <button type="button" className="product-focus__close" onClick={requestClose} aria-label="Close full-screen view">
            Close
          </button>
        </div>
      ) : null}
    </dialog>
  );
}
