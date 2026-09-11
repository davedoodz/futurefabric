import { useDialKit } from "dialkit";
import type { DragEvent } from "react";
import { gridSpriteSheet, type Product } from "../data/products";
import { EditableText } from "../lib/copy";
import SpriteViewer from "./SpriteViewer";

const PLACEMENT_LIMIT = 40;
const DEFAULT_PLACEMENTS: Record<string, { x: number; y: number; z: number; scale: number }> = {
  PL01: { x: -11, y: 5, z: 0, scale: 1.38 },
  PL02: { x: -25, y: 1, z: 0, scale: 1.35 },
  PL03: { x: -25, y: 17, z: 0, scale: 1.33 },
  PL04: { x: -26, y: 0, z: 0, scale: 1 },
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
      <div className="product-card__image">
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
      <EditableText copyKey={`product.${product.code}.code`} defaultValue={product.code} as="p" className="product-card__code" />
      <EditableText copyKey={`product.${product.code}.name`} defaultValue={product.name} as="h3" className="product-card__name" />
      <EditableText copyKey={`product.${product.code}.companies`} defaultValue={product.companies} as="p" className="product-card__companies" />
    </article>
  );
}
