import type { CSSProperties } from "react";
import { useDialKit } from "dialkit";
import { CATEGORIES, type Category } from "../data/products";
import { EditableText } from "../lib/copy";

interface Props {
  active: Category;
  onChange: (category: Category) => void;
}

type IconKind = "all" | "sprout" | "protein" | "polymer" | "mushroom";

const ICONS: Record<Category, IconKind> = {
  "All products": "all",
  "Plant-based cellulosic": "sprout",
  "Protein-based": "protein",
  "Bio-based synthetic polymers": "polymer",
  "Microbial and fungal bioassembled": "mushroom",
};

const SPROUT_ASPECT_RATIO = 29.069444444444443 / 28;


function CategoryIcon({ kind, size, x, y }: { kind: IconKind; size: number; x: number; y: number }) {
  const common = {
    width: kind === "sprout" ? size * SPROUT_ASPECT_RATIO : size,
    height: size,
    viewBox: kind === "sprout" ? "-1.767 -1.714 49.846 47.999" : "0 0 48 48",
    "aria-hidden": true,
    style: {
      position: "absolute",
      top: "50%",
      left: "var(--pill-icon-inset, 16px)",
      marginTop: size / -2,
      transform: `translate(${x}px, ${y}px)`,
      flexShrink: 0,
    } as CSSProperties,
  };
  if (kind === "all") {
    return <svg {...common}><rect x="8" y="8" width="13" height="13" rx="2" fill="currentColor" /><rect x="27" y="8" width="13" height="13" rx="2" fill="currentColor" /><rect x="8" y="27" width="13" height="13" rx="2" fill="currentColor" /><rect x="27" y="27" width="13" height="13" rx="2" fill="currentColor" /></svg>;
  }
  if (kind === "sprout") {
    return <svg {...common}><path d="M20.385 24.132L25.902 24.132L25.902 35.526C25.902 37.637 24.661 38.901 23.144 38.901C21.626 38.901 20.385 37.637 20.385 35.526L20.385 24.132Z" fill="currentColor" /><path d="M24.063 26.287C24.063 26.287 5.823 26.287 5.823 10.133C24.063 10.133 24.063 26.287 24.063 26.287Z" fill="currentColor" /><path d="M22.223 26.902C22.223 26.902 40.463 23.671 40.463 7.517C22.223 7.517 22.223 26.902 22.223 26.902Z" fill="currentColor" /></svg>;
  }
  if (kind === "protein") {
    return <svg {...common}><path d="M24 9L38.3 19.4 32.8 36.2H15.2L9.7 19.4Z" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinejoin="round" /><circle cx="15.429" cy="35.999" r="5.143" fill="currentColor" /><circle cx="32.572" cy="35.999" r="5.143" fill="currentColor" /><circle cx="37.715" cy="18.856" r="5.143" fill="currentColor" /><circle cx="24.001" cy="8.572" r="5.143" fill="currentColor" /><circle cx="10.287" cy="18.858" r="5.143" fill="currentColor" /></svg>;
  }
  if (kind === "polymer") {
    return <svg {...common}><path fillRule="evenodd" clipRule="evenodd" d="M24.001 5L39.429 14L39.429 32L24.001 40.999L8.572 32L8.572 14L24.001 5ZM24.001 17.789C21.102 17.789 18.858 20.063 18.858 23C18.858 25.936 21.102 28.21 24.001 28.21C26.899 28.21 29.144 25.936 29.144 23C29.144 20.063 26.899 17.789 24.001 17.789Z" fill="currentColor" /></svg>;
  }
  return <svg {...common}><path d="M6.857 24.571C6.857 15.571 14.457 8.571 23.857 8.571C33.257 8.571 40.857 15.571 40.857 24.571C40.857 26.571 39.257 28.071 37.357 28.071L10.357 28.071C8.457 28.071 6.857 26.571 6.857 24.571Z" fill="currentColor" /><path d="M20.429 22.428L27.286 22.428L27.286 35.928C27.286 38.428 25.743 39.928 23.857 39.928C21.972 39.928 20.429 38.428 20.429 35.928L20.429 22.428Z" fill="currentColor" /></svg>;
}

interface IconLayoutDefaults {
  size: number;
  leftInset: number;
  iconTextGap: number;
  textRightGap: number;
  x: number;
  y: number;
}

function useIconLayout(name: string, id: string, defaults: IconLayoutDefaults) {
  return useDialKit(name, {
    size: [defaults.size, 6, 24, 1],
    leftInset: [defaults.leftInset, 0, 120, 1],
    iconTextGap: [defaults.iconTextGap, 0, 120, 1],
    textRightGap: [defaults.textRightGap, 0, 120, 1],
    position: { type: "pad", x: [defaults.x, -20, 20, 1], y: [defaults.y, -8, 16, 1] },
  }, { id, persist: true });
}

export default function CategoryTabs({ active, onChange }: Props) {
  const layout = useDialKit("Category pills", {
    orientation: { type: "select", options: ["horizontal", "vertical"] },
    fontSize: [14, 8, 48, 1],
    fontWeight: [100, 100, 900, 100],
    letterSpacing: [-0.04, -0.2, 0.3, 0.01],
    paddingY: [6, 0, 32, 1],
    spacing: [5, 0, 64, 1],
    activeOpacity: [1, 0, 1, 0.01],
    inactiveOpacity: [1, 0, 1, 0.01],
  }, { id: "category-pill-layout-under-title", persist: true });
  const all = useIconLayout("All products icon", "category-icon-all", { size: 16, leftInset: 16, iconTextGap: 11, textRightGap: 20, x: -4, y: 1 });
  const sprout = useIconLayout("Sprout icon", "category-icon-sprout", { size: 18, leftInset: 0, iconTextGap: 7, textRightGap: 18, x: 12, y: 1 });
  const protein = useIconLayout("Protein icon", "category-icon-protein", { size: 17, leftInset: 16, iconTextGap: 8, textRightGap: 18, x: -4, y: 0 });
  const polymer = useIconLayout("Polymer icon", "category-icon-polymer", { size: 18, leftInset: 16, iconTextGap: 7, textRightGap: 17, x: -6, y: 0 });
  const mushroom = useIconLayout("Mushroom icon", "category-icon-mushroom", { size: 18, leftInset: 16, iconTextGap: 8, textRightGap: 17, x: -5, y: 1 });
  const iconLayouts = { all, sprout, protein, polymer, mushroom };

  return (
    <nav className="category-tabs" data-orientation={layout.orientation} aria-label="Filter by material category" style={{
      "--pill-font-size": `${layout.fontSize}px`,
      "--pill-font-weight": layout.fontWeight,
      "--pill-letter-spacing": `${layout.letterSpacing}em`,
      "--pill-padding-y": `${layout.paddingY}px`,
      "--pill-gap": `${layout.spacing}px`,
      "--pill-active-opacity": layout.activeOpacity,
      "--pill-inactive-opacity": layout.inactiveOpacity,
    } as CSSProperties}>
      {CATEGORIES.map((category) => {
        const iconLayout = iconLayouts[ICONS[category]];
        return (
          <button
            type="button"
            className="category-tab"
            data-active={category === active}
            onClick={() => onChange(category)}
            style={{
              "--pill-opacity": category === active ? "var(--pill-active-opacity, 1)" : "var(--pill-inactive-opacity, 1)",
              "--pill-icon-size": `${ICONS[category] === "sprout" ? iconLayout.size * SPROUT_ASPECT_RATIO : iconLayout.size}px`,
              "--pill-icon-inset": `${iconLayout.leftInset}px`,
              "--pill-icon-x": `${iconLayout.position.x}px`,
              "--pill-icon-text-gap": `${iconLayout.iconTextGap}px`,
              "--pill-text-right-gap": `${iconLayout.textRightGap}px`,
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
