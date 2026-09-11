import { useEffect, useState, type CSSProperties } from "react";
import { DialRoot, DialStore, useDialKit } from "dialkit";
import Header from "./components/Header";
import CategoryTabs from "./components/CategoryTabs";
import ProductGrid from "./components/ProductGrid";
import CustomCursor from "./components/CustomCursor";
import ProductFocusModal from "./components/ProductFocusModal";
import SponsorLogos from "./components/SponsorLogos";
import { setRotationSpeed } from "./components/SpriteViewer";
import { CopyProvider, EditableText, useCopy } from "./lib/copy";
import { scheduleSharedLayoutSave, saveSharedLayout } from "./lib/layoutPersistence";
import { PRODUCTS, type Category, type Product } from "./data/products";

function SaveAllButton() {
  const { saveCopy } = useCopy();

  const handleSave = () => {
    saveCopy();
    void saveSharedLayout();
  };

  return (
    <button type="button" className="save-all-button" onClick={handleSave}>
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
      productNameSize: [27, 12, 72, 1],
      productNameLetterSpacing: [-0.08, -0.2, 0.2, 0.01],
      wordmarkGap: [12, 0, 80, 1],
      titleSubtitleGap: [8, 0, 80, 1],
      subtitlePillsGap: [24, 0, 120, 1],
      pillsGalleryGap: [64, 0, 200, 1],
      elementSpacing: [4, 0, 32, 1],
      matrixGapX: [24, 0, 96, 1],
      matrixGapY: [48, 0, 128, 1],
      frameWidth: [220, 120, 420, 1],
      frameHeight: [220, 120, 420, 1],
    },
    { id: "catalog-layout", persist: true },
  );
  const interfaceControls = useDialKit(
    "Interface",
    { textEditing: true, objectGrab: true },
    { id: "catalog-interface", persist: true },
  );
  const [category, setCategory] = useState<Category>("Plant-based cellulosic");
  const [darkMode, setDarkMode] = useState(false);
  const [focusedProduct, setFocusedProduct] = useState<Product | null>(null);
  useEffect(() => {
    setRotationSpeed(rotation.speed);
  }, [rotation.speed]);
  useEffect(() => {
    const unsubscribe = DialStore.subscribeGlobal(scheduleSharedLayoutSave);
    return unsubscribe;
  }, []);
  const layoutStyle = {
    "--layout-letter-spacing": `${layout.letterSpacing}em`,
    "--layout-line-height": layout.lineHeight,
    "--layout-product-name-size": `${layout.productNameSize}px`,
    "--layout-product-name-letter-spacing": `${layout.productNameLetterSpacing}em`,
    "--layout-wordmark-gap": `${layout.wordmarkGap}px`,
    "--layout-title-subtitle-gap": `${layout.titleSubtitleGap}px`,
    "--layout-subtitle-pills-gap": `${layout.subtitlePillsGap}px`,
    "--layout-pills-gallery-gap": `${layout.pillsGalleryGap}px`,
    "--layout-element-spacing": `${layout.elementSpacing}px`,
    "--layout-matrix-gap-x": `${layout.matrixGapX}px`,
    "--layout-matrix-gap-y": `${layout.matrixGapY}px`,
    "--layout-frame-width": `${layout.frameWidth}px`,
    "--layout-frame-height": `${layout.frameHeight}px`,
  } as CSSProperties;
  return (
    <CopyProvider editingEnabled={interfaceControls.textEditing}>
      <div className="page" data-dark-mode={darkMode} style={layoutStyle}>
        <DialRoot defaultOpen productionEnabled />
        <SaveAllButton />
        <CustomCursor />
        <main className="page__content">
          <Header darkMode={darkMode} onToggleDarkMode={() => setDarkMode((current) => !current)} />
          <CategoryTabs active={category} onChange={setCategory} />
          <ProductGrid
            category={category}
            products={PRODUCTS}
            paused={focusedProduct !== null}
            grabEnabled={interfaceControls.objectGrab}
            onSelect={setFocusedProduct}
          />
        </main>
        <SponsorLogos />
        <ProductFocusModal
          product={focusedProduct}
          onClose={() => setFocusedProduct(null)}
          grabEnabled={interfaceControls.objectGrab}
        />
      </div>
    </CopyProvider>
  );
}
