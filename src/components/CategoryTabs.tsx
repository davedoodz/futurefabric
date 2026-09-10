import { CATEGORIES, type Category } from "../data/products";

interface Props {
  active: Category;
  onChange: (category: Category) => void;
}

export default function CategoryTabs({ active, onChange }: Props) {
  return (
    <nav className="category-tabs" aria-label="Filter by material category">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          type="button"
          className="category-tab"
          data-active={category === active}
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </nav>
  );
}
