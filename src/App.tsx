import { useMemo, useState } from "react";
import Header from "./components/Header";
import CategoryTabs from "./components/CategoryTabs";
import ProductGrid from "./components/ProductGrid";
import CustomCursor from "./components/CustomCursor";
import ProductFocusModal from "./components/ProductFocusModal";
import { PRODUCTS, type Category, type Product } from "./data/products";

export default function App() {
  const [category, setCategory] = useState<Category>("Plant-based cellulosic");
  const [focusedProduct, setFocusedProduct] = useState<Product | null>(null);
  const filtered = useMemo(() => PRODUCTS.filter((p) => p.category === category), [category]);

  return (
    <div className="page">
      <CustomCursor />
      <main className="page__content">
        <Header />
        <ProductGrid products={filtered} paused={focusedProduct !== null} onSelect={setFocusedProduct} />
      </main>
      <CategoryTabs active={category} onChange={setCategory} />
      <ProductFocusModal product={focusedProduct} onClose={() => setFocusedProduct(null)} />
    </div>
  );
}
