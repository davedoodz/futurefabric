import { useEffect, useState } from "react";
import type { Product } from "../data/products";
import ProductCard from "./ProductCard";
import { EditableText } from "../lib/copy";

interface Props {
  products: Product[];
  paused: boolean;
  onSelect: (product: Product) => void;
}

export default function ProductGrid({ products, paused, onSelect }: Props) {
  const [orderedProducts, setOrderedProducts] = useState(products);
  const [draggedCode, setDraggedCode] = useState<string | null>(null);

  useEffect(() => {
    setOrderedProducts(products);
    setDraggedCode(null);
  }, [products]);

  if (orderedProducts.length === 0) {
    return (
      <EditableText
        copyKey="catalog.empty"
        defaultValue="No products in this category yet."
        as="p"
        className="product-grid__empty"
      />
    );
  }

  const swapProducts = (targetCode: string) => {
    if (!draggedCode || draggedCode === targetCode) return;
    setOrderedProducts((current) => {
      const next = [...current];
      const draggedIndex = next.findIndex((product) => product.code === draggedCode);
      const targetIndex = next.findIndex((product) => product.code === targetCode);
      if (draggedIndex < 0 || targetIndex < 0) return current;
      [next[draggedIndex], next[targetIndex]] = [next[targetIndex], next[draggedIndex]];
      return next;
    });
    setDraggedCode(null);
  };

  return (
    <div className="product-grid">
      {orderedProducts.map((product) => (
        <ProductCard
          key={product.code}
          product={product}
          paused={paused}
          onSelect={onSelect}
          draggable
          isDragging={draggedCode === product.code}
          onDragStart={() => setDraggedCode(product.code)}
          onDragEnd={() => setDraggedCode(null)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => swapProducts(product.code)}
        />
      ))}
    </div>
  );
}
