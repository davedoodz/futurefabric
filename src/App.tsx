import { useMemo, useState } from "react";
import Header from "./components/Header";
import CategoryTabs from "./components/CategoryTabs";
import ProductGrid from "./components/ProductGrid";
import CustomCursor from "./components/CustomCursor";
import { PRODUCTS, type Category } from "./data/products";

export default function App() {
  const [category, setCategory] = useState<Category>("Plant-based cellulosic");
  const filtered = useMemo(() => PRODUCTS.filter((p) => p.category === category), [category]);

  return (
    <div className="page">
      <CustomCursor />
      <main className="page__content">
        <Header />
        <ProductGrid products={filtered} />
      </main>
      <CategoryTabs active={category} onChange={setCategory} />
    </div>
  );
}
