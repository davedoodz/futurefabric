import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { DialRoot, useDialKit } from "dialkit";
import Header from "./components/Header";
import CategoryTabs from "./components/CategoryTabs";
import ProductGrid from "./components/ProductGrid";
import CustomCursor from "./components/CustomCursor";
import ProductFocusModal from "./components/ProductFocusModal";
import SponsorLogos from "./components/SponsorLogos";
import { setRotationSpeed } from "./components/SpriteViewer";
import { CopyProvider, EditableText, useCopy } from "./lib/copy";
import { PRODUCTS, type Category, type Product } from "./data/products";

function SaveAllButton() {
  const { saveCopy } = useCopy();

  return (
    <button type="button" className="save-all-button" onClick={saveCopy}>
      <EditableText copyKey="save.button" defaultValue="Save all values" />
    </button>
  );
}
export default function App() {
  const rotation = useDialKit(
    "Rotation",
    { speed: [1, 0, 10, 0.05] },
    { id: "catalog-rotation-speed", persist: true },
  );
  const layout = useDialKit(
    "Layout",
    {
      letterSpacing: [-0.08, -0.2, 0.1, 0.01],
      lineHeight: [1.1, 0.8, 2, 0.01],
      elementSpacing: [4, 0, 32, 1],
      matrixGapX: [24, 0, 96, 1],
      matrixGapY: [48, 0, 128, 1],
      frameWidth: [220, 120, 420, 1],
      frameHeight: [220, 120, 420, 1],
    },
    { id: "catalog-layout", persist: true },
  );
  const [category, setCategory] = useState<Category>("Plant-based cellulosic");
  const [focusedProduct, setFocusedProduct] = useState<Product | null>(null);
  const filtered = useMemo(() => PRODUCTS.filter((p) => p.category === category), [category]);

  useEffect(() => {
    setRotationSpeed(rotation.speed);
  }, [rotation.speed]);
  const layoutStyle = {
    "--layout-letter-spacing": `${layout.letterSpacing}em`,
    "--layout-line-height": layout.lineHeight,
    "--layout-element-spacing": `${layout.elementSpacing}px`,
    "--layout-matrix-gap-x": `${layout.matrixGapX}px`,
    "--layout-matrix-gap-y": `${layout.matrixGapY}px`,
    "--layout-frame-width": `${layout.frameWidth}px`,
    "--layout-frame-height": `${layout.frameHeight}px`,
  } as CSSProperties;
  return (
    <CopyProvider>
      <div className="page" style={layoutStyle}>
        <DialRoot defaultOpen productionEnabled />
        <SaveAllButton />
        <CustomCursor />
        <main className="page__content">
          <Header />
          <ProductGrid products={filtered} paused={focusedProduct !== null} onSelect={setFocusedProduct} />
        </main>
        <SponsorLogos />
        <CategoryTabs active={category} onChange={setCategory} />
        <ProductFocusModal product={focusedProduct} onClose={() => setFocusedProduct(null)} />
      </div>
    </CopyProvider>
  );
}
