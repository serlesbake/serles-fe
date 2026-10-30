import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ product, priority = false }) {
  return (
    <div className="col-lg-3 col-md-6 col-sm-6">
      <Link 
        href={`/cakes/${product.category?.slug}/${product.slug}`}
        className="text-decoration-none"
        style={{ display: 'block' }}
      >
        <div className="product__item">
          <div className="product__item__pic set-bg d-flex items-center justify-content-center">
            <Image
              src={product.featured_image?.url || "/img/placeholder.jpg"}
              alt={product.featured_image?.alt_text || product.name}
              width={300}
              height={300}
              priority={priority}
              fetchPriority={priority ? 'high' : 'auto'}
              sizes="(min-width: 992px) 25vw, (min-width: 576px) 50vw, 100vw"
              style={{ objectFit: "cover", borderRadius: "20px", width: "100%", height: "100%" }}
            />
            {product.category && (
              <div className="product__label">
                <span>{product.category.name}</span>
              </div>
            )}
          </div>
          <div className="product__item__text">
            <h6>
              {product.name}
            </h6>
            <div className="product__item__price">
              {product.price_range?.replace(/\$/g, '₹') || "Price not available"}
            </div>
            <div className="cart_add" aria-hidden="true">
              <span>View Details</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
