import {
  createContext,
  useContext,
  useEffect,
  useState,
  type CSSProperties,
  type ElementType,
  type FocusEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { scheduleSharedLayoutSave } from "./layoutPersistence";

const STORAGE_KEY = "futurefabric-copy";

type CopyValues = Record<string, string>;

const DEFAULT_COPY_VALUES: CopyValues = {
  "product.PL03.name": "Product Name",
  "modal.close": "",
  "site.tagline.line2": "of Bio-based Fashion Apparel",
  "site.title": "FutureFabric",
  "site.tagline.line1": "An Open-Source Catalog",
  "product.PL02.name": "XX",
  "category.Protein-based": "Protein-based",
  "category.Microbial and fungal bioassembled": "Microbial and fungal bioassembled",
  "product.PL16.companies": "Companies",
  "save.button": "Save all values",
  "product.PL15.companies": "Companies",
  "product.PL04.name": "Product Name",
  "product.PL06.code": "PL06",
  "category.Bio-based synthetic polymers": "Bio-based synthetic polymers",
  "category.Plant-based cellulosic": "Plant-based cellulosic",
  "product.PL07.name": "Test",
  "product.PL15.code": "PL15",
  "product.PL01.companies": "Companies",
  "product.PL02.companies": "X",
  "product.PL01.name": "Product Name",
  "product.PL01.code": "PL01",
  "product.MFB-01.name": "Ephea mycelium coat",
  "product.PBC-01.name": "Happy Pineapple sneakers",
  "product.BSP-01.name": "VEGEA Frayme bag",
  "product.PBC-02.name": "Piñatex pineapple sandal",
  "product.BSP-02.name": "PLA corn-based windbreaker",
  "product.PBC-01.companies": "Nike × Piñatex",
  "product.MFB-03.name": "Mylo Mycelium bustier and trousers",
  "product.BSP-01.companies": "Stella McCartney × Veuve Clicquot",
  "product.PRO-01.name": "Wool-fiber Runners sneakers",
  "product.PRO-01.companies": "Allbirds",
  "product.BSP-02.companies": "Xtep",
  "product.MFB-01.companies": "Balenciaga",
  "product.MFB-04.name": "Coprinus™ hat",
  "product.PBC-06.companies": "Christian Siriano × Circ",
  "product.PRO-02.companies": "Yuima Nakazato × Spiber",
  "product.BSP-03.companies": "The North Face × Spiber",
  "product.PBC-07.name": "Orange Fiber tie\n",
  "product.PBC-07.companies": "E. Marinella",
  "product.MFB-03.companies": "Stella McCartney × Bolt Threads",
  "product.PBC-04.name": "Orange Fiber Capsule Collection",
  "product.PBC-02.companies": "Zara × Piñatex",
  "product.MFB-02.name": "Reishi™ hat",
  "product.PBC-08.companies": "Orange Fiber × H&M",
  "modal.label.material": "Material",
};

interface CopyContextValue {
  copy: CopyValues;
  updateCopy: (key: string, value: string) => void;
  saveCopy: () => void;
  editingEnabled: boolean;
}

const CopyContext = createContext<CopyContextValue | null>(null);

export function CopyProvider({ children, editingEnabled = true }: { children: ReactNode; editingEnabled?: boolean }) {
  const [copy, setCopy] = useState<CopyValues>(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as CopyValues;
      return { ...DEFAULT_COPY_VALUES, ...stored };
    } catch {
      return DEFAULT_COPY_VALUES;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(copy));
    scheduleSharedLayoutSave();
  }, [copy]);

  const updateCopy = (key: string, value: string) => {
    setCopy((current) => ({ ...current, [key]: value }));
  };

  const saveCopy = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(copy));
  };

  return <CopyContext.Provider value={{ copy, updateCopy, saveCopy, editingEnabled }}>{children}</CopyContext.Provider>;
}

export function useCopy() {
  const context = useContext(CopyContext);
  if (!context) throw new Error("useCopy must be used inside CopyProvider");
  return context;
}

interface EditableTextProps {
  copyKey: string;
  defaultValue: string;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}

export function EditableText({ copyKey, defaultValue, as: Component = "span", className, style }: EditableTextProps) {
  const { copy, updateCopy, editingEnabled } = useCopy();
  const value = copy[copyKey] ?? defaultValue;

  return (
    <Component
      className={className}
      style={style}
      contentEditable={editingEnabled ? "plaintext-only" : false}
      suppressContentEditableWarning
      spellCheck={editingEnabled}
      tabIndex={editingEnabled ? 0 : undefined}
      data-copy-key={copyKey}
      onFocus={editingEnabled ? (event: FocusEvent<HTMLElement>) => {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(event.currentTarget);
        selection?.removeAllRanges();
        selection?.addRange(range);
      } : undefined}
      onPointerDown={editingEnabled ? (event: ReactPointerEvent<HTMLElement>) => {
        event.stopPropagation();
      } : undefined}
      onClick={editingEnabled ? (event: ReactMouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
      } : undefined}
      onBlur={editingEnabled ? (event: FocusEvent<HTMLElement>) => updateCopy(copyKey, event.currentTarget.textContent ?? "") : undefined}
    >
      {value}
    </Component>
  );
}
