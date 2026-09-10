import type { CSSProperties } from "react";
import { useDialKit } from "dialkit";
import { CATEGORIES, type Category } from "../data/products";
import { EditableText } from "../lib/copy";

interface Props {
  active: Category;
  onChange: (category: Category) => void;
}

export default function CategoryTabs({ active, onChange }: Props) {
  const layout = useDialKit(
    "Category pills",
    {
      orientation: { type: "select", options: ["horizontal", "vertical"] },
      fontSize: [14, 8, 48, 1],
      fontWeight: [400, 100, 900, 100],
      letterSpacing: [-0.08, -0.2, 0.3, 0.01],
    },
    { id: "category-pill-layout-under-title", persist: true },
  );

  return (
    <nav
      className="category-tabs"
      data-orientation={layout.orientation}
      aria-label="Filter by material category"
      style={{
        "--pill-font-size": `${layout.fontSize}px`,
        "--pill-font-weight": layout.fontWeight,
        "--pill-letter-spacing": `${layout.letterSpacing}em`,
      } as CSSProperties}
    >
      {CATEGORIES.map((category) => (
        <button
          key={category}
          type="button"
          className="category-tab"
          data-active={category === active}
          onClick={() => onChange(category)}
        >
          <EditableText copyKey={`category.${category}`} defaultValue={category} />
        </button>
      ))}
    </nav>
  );
}
