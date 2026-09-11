import type { CSSProperties } from "react";
import { useDialKit } from "dialkit";
import { CATEGORIES, type Category } from "../data/products";
import { EditableText } from "../lib/copy";

interface Props {
  active: Category;
  onChange: (category: Category) => void;
}

type IconKind = "sprout" | "protein" | "polymer" | "mushroom";

const ICONS: Record<Category, IconKind> = {
  "Plant-based cellulosic": "sprout",
  "Protein-based": "protein",
  "Bio-based synthetic polymers": "polymer",
  "Microbial and fungal bioassembled": "mushroom",
};

function CategoryIcon({ kind, size, x, y }: { kind: string; size: number; x: number; y: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 48 48",
    "aria-hidden": true,
    style: { transform: `translate(${x}px, ${y}px)`, flexShrink: 0 } as CSSProperties,
  };
  if (kind === "sprout") {
    return <svg {...common}><path d="M22 44V24H26V44Z M24 26C24 26 7 26 7 11C24 11 24 26 24 26Z M24 26C24 26 41 23 41 8C24 8 24 26 24 26Z" fill="currentColor" /></svg>;
  }
  if (kind === "protein") {
    return <svg {...common}><path d="M24 9L38.3 19.4L32.8 36.2H15.2L9.7 19.4Z" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" fill="none" /><circle cx="24" cy="9" r="6" fill="currentColor" /><circle cx="38.3" cy="19.4" r="6" fill="currentColor" /><circle cx="32.8" cy="36.2" r="6" fill="currentColor" /><circle cx="15.2" cy="36.2" r="6" fill="currentColor" /><circle cx="9.7" cy="19.4" r="6" fill="currentColor" /></svg>;
  }
  if (kind === "polymer") {
    return <svg {...common}><path fillRule="evenodd" d="M24 5L40.5 14.5V33.5L24 43L7.5 33.5V14.5L24 5ZM24 18.5C20.9 18.5 18.5 20.9 18.5 24C18.5 27.1 20.9 29.5 24 29.5C27.1 29.5 29.5 27.1 29.5 24C29.5 20.9 27.1 18.5 24 18.5Z" fill="currentColor" /></svg>;
  }
  return <svg {...common}><path d="M7 21C7 12 14.6 5 24 5C33.4 5 41 12 41 21C41 23 39.4 24.5 37.5 24.5H10.5C8.6 24.5 7 23 7 21Z M20 26.5H28V40C28 42.5 26.2 44 24 44C21.8 44 20 42.5 20 40V26.5Z" fill="currentColor" /></svg>;
}

function useIconLayout(name: string, id: string) {
  return useDialKit(name, {
    size: [12, 6, 24, 1],
    position: { type: "pad", x: [12, 0, 32, 1], y: [5, -8, 16, 1] },
  }, { id, persist: true });
}

export default function CategoryTabs({ active, onChange }: Props) {
  const layout = useDialKit("Category pills", {
    orientation: { type: "select", options: ["horizontal", "vertical"] },
    fontSize: [14, 8, 48, 1],
    fontWeight: [400, 100, 900, 100],
    letterSpacing: [-0.08, -0.2, 0.3, 0.01],
    padding: [8, 0, 32, 1],
    spacing: [8, 0, 64, 1],
    contentGap: [8, 0, 32, 1],
    textX: [0, -100, 100, 1],
    width: [0, 0, 600, 1],
  }, { id: "category-pill-layout-under-title", persist: true });

  const sprout = useIconLayout("Sprout icon", "category-icon-sprout");
  const protein = useIconLayout("Protein icon", "category-icon-protein");
  const polymer = useIconLayout("Polymer icon", "category-icon-polymer");
  const mushroom = useIconLayout("Mushroom icon", "category-icon-mushroom");
  const iconLayouts = { sprout, protein, polymer, mushroom };

  return (
    <nav className="category-tabs" data-orientation={layout.orientation} aria-label="Filter by material category" style={{
      "--pill-font-size": `${layout.fontSize}px`,
      "--pill-padding": `${layout.padding}px`,
      "--pill-gap": `${layout.spacing}px`,
      "--pill-content-gap": `${layout.contentGap}px`,
    } as CSSProperties}>
      {CATEGORIES.map((category) => {
        const iconLayout = iconLayouts[ICONS[category]];
        return (
          <button
            key={category}
            type="button"
            className="category-tab"
            data-active={category === active}
            onClick={() => onChange(category)}
            style={{
              "--pill-icon-size": `${iconLayout.size}px`,
              "--pill-text-x": `${layout.textX}px`,
              width: layout.width > 0 ? `${layout.width}px` : undefined,
            } as CSSProperties}
          >
            <CategoryIcon
              kind={ICONS[category]}
              size={iconLayout.size}
              x={iconLayout.position.x}
              y={-iconLayout.position.y}
            />
            <EditableText copyKey={`category.${category}`} defaultValue={category} className="category-tab__label" />
          </button>
        );
      })}
    </nav>
  );
}
