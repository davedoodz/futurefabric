import type { Product } from "../data/products";
import SpriteViewer from "./SpriteViewer";

interface Props {
  product: Product;
  paused: boolean;
  onSelect: (product: Product) => void;
}

export default function ProductCard({ product, paused, onSelect }: Props) {
  return (
    <article className="product-card">
      <div className="product-card__image">
        <SpriteViewer
          src={product.cardSpriteSheet}
          alt={product.alt}
          className="sprite-viewer--card"
          paused={paused}
          onActivate={() => onSelect(product)}
        />
      </div>
      <p className="product-card__code">{product.code}</p>
      <h3 className="product-card__name">Product Name</h3>
      <p className="product-card__companies">Companies</p>
    </article>
  );
}
