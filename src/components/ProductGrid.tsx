import type { Product } from "../data/products";
import ProductCard from "./ProductCard";
import { EditableText } from "../lib/copy";

interface Props {
  products: Product[];
  paused: boolean;
  onSelect: (product: Product) => void;
}

export default function ProductGrid({ products, paused, onSelect }: Props) {
  if (products.length === 0) {
    return (
      <EditableText
        copyKey="catalog.empty"
        defaultValue="No products in this category yet."
        as="p"
        className="product-grid__empty"
      />
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.code} product={product} paused={paused} onSelect={onSelect} />
      ))}
    </div>
  );
}
