import type { Product } from "../data/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <div className="product-card__image">
        <img src={product.image} alt={product.alt} loading="lazy" />
      </div>
      <p className="product-card__code">{product.code}</p>
      <h3 className="product-card__name">Product Name</h3>
      <p className="product-card__companies">Companies</p>
    </article>
  );
}
