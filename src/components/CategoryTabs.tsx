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
      orientation: { type: "select", options: ["vertical", "horizontal"] },
      corner: { type: "select", options: ["top-left", "top-right", "bottom-left", "bottom-right"] },
    },
    { id: "category-pill-layout", persist: true },
  );

  return (
    <nav
      className="category-tabs"
      data-orientation={layout.orientation}
      data-corner={layout.corner}
      aria-label="Filter by material category"
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
