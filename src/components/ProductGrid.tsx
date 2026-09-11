import { useEffect, useState } from "react";
import type { Product, Category } from "../data/products";
import ProductCard from "./ProductCard";
import { EditableText } from "../lib/copy";
import { scheduleSharedLayoutSave } from "../lib/layoutPersistence";

const ORDER_STORAGE_PREFIX = "futurefabric-order:";

interface Props {
  category: Category;
  products: Product[];
  paused: boolean;
  grabEnabled: boolean;
  showFrames: boolean;
  onSelect: (product: Product) => void;
}

function readStoredOrder(category: Category, products: Product[]) {
  try {
    const stored = window.localStorage.getItem(`${ORDER_STORAGE_PREFIX}${category}`);
    const codes = stored ? (JSON.parse(stored) as unknown) : [];
    if (!Array.isArray(codes)) return products;

    const byCode = new Map(products.map((product) => [product.code, product]));
    const ordered = codes.flatMap((code) => {
      const product = typeof code === "string" ? byCode.get(code) : undefined;
      if (product) byCode.delete(product.code);
      return product ? [product] : [];
    });
    return [...ordered, ...byCode.values()];
  } catch {
    return products;
  }
}
export default function ProductGrid({ category, products, paused, grabEnabled, showFrames, onSelect }: Props) {
  const [orderedProducts, setOrderedProducts] = useState(() => readStoredOrder(category, products));
  const [draggedCode, setDraggedCode] = useState<string | null>(null);

  useEffect(() => {
    setOrderedProducts(readStoredOrder(category, products));
    setDraggedCode(null);
  }, [category, products]);

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
      window.localStorage.setItem(
        `${ORDER_STORAGE_PREFIX}${category}`,
        JSON.stringify(next.map((product) => product.code)),
      );
      scheduleSharedLayoutSave();
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
          grabEnabled={grabEnabled}
          showFrame={showFrames}
          onSelect={onSelect}
          draggable
          onDragEnd={() => setDraggedCode(null)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => swapProducts(product.code)}
        />
      ))}
    </div>
  );
}
