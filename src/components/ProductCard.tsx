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


function useProductPlacement(product: Product) {
  const defaults = DEFAULT_PLACEMENTS[product.code] ?? { x: 0, y: 0, z: 0, scale: 1 };
  return useDialKit(
    `Product ${product.code}`,
    {
      x: [defaults.x, -PLACEMENT_LIMIT, PLACEMENT_LIMIT, 1],
      y: [defaults.y, -PLACEMENT_LIMIT, PLACEMENT_LIMIT, 1],
      z: [defaults.z, -400, 400, 1],
      scale: [defaults.scale, 0.5, 3, 0.01],
    },
    { id: `product-placement-${product.code}`, persist: true },
  );
}
interface Props {
  product: Product;
  paused: boolean;
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
          onActivate={() => onSelect(product)}
        />
      </div>
      <EditableText copyKey={`product.${product.code}.code`} defaultValue={product.code} as="p" className="product-card__code" />
      <EditableText copyKey={`product.${product.code}.name`} defaultValue="Product Name" as="h3" className="product-card__name" />
      <EditableText copyKey={`product.${product.code}.companies`} defaultValue="Companies" as="p" className="product-card__companies" />
    </article>
  );
}
