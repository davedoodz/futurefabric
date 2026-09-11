import { useDialKit } from "dialkit";
import type { CSSProperties, DragEvent } from "react";
import { gridSpriteSheet, type Product } from "../data/products";
import { EditableText } from "../lib/copy";
import SpriteViewer from "./SpriteViewer";
import MaterialScan from "./MaterialScan";

const PLACEMENT_LIMIT = 40;
const DEFAULT_PLACEMENTS: Record<string, { x: number; y: number; z: number; scale: number }> = {
  PL01: { x: -3, y: 19, z: 0, scale: 1.72 },
  PL02: { x: -8, y: 19, z: 0, scale: 1.01 },
  PL03: { x: -2, y: 20, z: 0, scale: 1.57 },
  PL04: { x: 0, y: 19, z: 0, scale: 1.34 },
  PL05: { x: -5, y: 23, z: 0, scale: 1.58 },
  PL06: { x: 0, y: 20, z: 0, scale: 1.48 },
  PL07: { x: 1, y: 17, z: 0, scale: 1.5 },
  PL08: { x: -1, y: 21, z: 0, scale: 1.43 },
  PL09: { x: -1, y: 21, z: 0, scale: 1.63 },
  PL10: { x: 0, y: 21, z: 0, scale: 1.61 },
  PL11: { x: 2, y: 20, z: 0, scale: 1.63 },
  PL12: { x: 1, y: 20, z: 0, scale: 1.72 },
  PL13: { x: 1, y: 23, z: 0, scale: 1.7 },
  PL14: { x: -2, y: 21, z: 0, scale: 1.66 },
  PL15: { x: 0, y: 17, z: 0, scale: 1.51 },
  PL16: { x: 1, y: 19, z: 0, scale: 1.35 },
  PL17: { x: -1, y: 23, z: 0, scale: 1.69 },
};

// Keep the placement storage IDs stable while visible catalog codes evolve.
const PLACEMENT_KEYS: Record<string, string> = {
  "MFB-01": "PL01",
  "PBC-01": "PL02",
  "BSP-01": "PL03",
  "PBC-02": "PL04",
  "PBC-03": "PL05",
  "BSP-02": "PL06",
  "PRO-01": "PL07",
  "MFB-02": "PL08",
  "PBC-04": "PL09",
  "MFB-03": "PL10",
  "MFB-04": "PL11",
  "PBC-05": "PL12",
  "PRO-02": "PL13",
  "PBC-06": "PL14",
  "PBC-07": "PL15",
  "PBC-08": "PL16",
  "BSP-03": "PL17",
};

const DEFAULT_PLACEMENT = { x: 0, y: 0, z: 0, scale: 1 };


function useProductPlacement(product: Product) {
  const placementKey = PLACEMENT_KEYS[product.code] ?? product.code;
  const defaults = DEFAULT_PLACEMENTS[placementKey] ?? DEFAULT_PLACEMENT;
  return useDialKit(
    `Product ${placementKey}`,
    {
      x: [defaults.x, -PLACEMENT_LIMIT, PLACEMENT_LIMIT, 1],
      y: [defaults.y, -PLACEMENT_LIMIT, PLACEMENT_LIMIT, 1],
      z: [defaults.z, -400, 400, 1],
      scale: [defaults.scale, 0.5, 3, 0.01],
    },
    { id: `product-placement-${placementKey}`, persist: true },
  );
}
interface Props {
  product: Product;
  paused: boolean;
  grabEnabled: boolean;
  showFrame: boolean;
  darkMode: boolean;
  onSelect: (product: Product) => void;
  draggable?: boolean;
  isDragging?: boolean;
  onDragStart?: () => void;
  onDragOver?: (event: DragEvent<HTMLElement>) => void;
  onDragEnd?: () => void;
  onDrop?: () => void;
}

export default function ProductCard({
  product,
  paused,
  grabEnabled,
  showFrame,
  darkMode,
  onSelect,
  draggable = false,
  isDragging = false,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}: Props) {
  const placement = useProductPlacement(product);
  const spriteSheet = placement.scale >= 1.75 ? product.spriteSheet : gridSpriteSheet(product);
  const transform = `translate3d(${placement.x}cqw, ${-placement.y}cqh, ${placement.z}px) scale(${placement.scale})`;
  return (
    <article
      className="product-card"
      data-span={placement.scale >= 1.75 ? "2" : "1"}
      data-dragging={isDragging}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="product-card__image" data-frame={showFrame}>
        <div className="product-card__object">
          <SpriteViewer
            src={spriteSheet}
            alt={product.alt}
            className="sprite-viewer--card"
            transform={transform}
            paused={paused}
            grabEnabled={grabEnabled}
            onActivate={() => onSelect(product)}
          />
        </div>
      </div>
      {darkMode ? <MaterialScan product={product} paused={paused} /> : null}
      <EditableText copyKey={`product.${product.code}.code`} defaultValue={product.code} as="p" className="product-card__code" />
      <EditableText
        copyKey={`product.${product.code}.name`}
        defaultValue={product.name}
        as="h3"
        className="product-card__name"
        style={{ "--product-title-fit-divisor": Math.max(product.name.length * 0.55, 1) } as CSSProperties}
      />
      <EditableText copyKey={`product.${product.code}.companies`} defaultValue={product.companies} as="p" className="product-card__companies" />
    </article>
  );
}
