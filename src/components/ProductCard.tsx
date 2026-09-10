import { useDialKit } from "dialkit";
import { gridSpriteSheet, type Product } from "../data/products";
import { EditableText } from "../lib/copy";
import SpriteViewer from "./SpriteViewer";

const PLACEMENT_LIMIT = 40;

function useProductPlacement(product: Product) {
  return useDialKit(
    `Product ${product.code}`,
    {
      x: [0, -PLACEMENT_LIMIT, PLACEMENT_LIMIT, 1],
      y: [0, -PLACEMENT_LIMIT, PLACEMENT_LIMIT, 1],
      z: [0, -400, 400, 1],
      scale: [1, 0.5, 3, 0.01],
    },
    { id: `product-placement-${product.code}`, persist: true },
  );
}
interface Props {
  product: Product;
  paused: boolean;
  onSelect: (product: Product) => void;
}

export default function ProductCard({ product, paused, onSelect }: Props) {
  const placement = useProductPlacement(product);
  const spriteSheet = placement.scale >= 1.75 ? product.spriteSheet : gridSpriteSheet(product);
  const transform = `translate3d(${placement.x}cqw, ${-placement.y}cqh, ${placement.z}px) scale(${placement.scale})`;
  return (
    <article className="product-card" data-span={placement.scale >= 1.75 ? "2" : "1"}>
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
