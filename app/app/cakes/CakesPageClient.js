"use client";
import { useMemo } from "react";
import Breadcrumb from "../components/Breadcrumb";
import ProductFilters from "../components/ProductFilters";
import ProductCard from "../components/ProductCard";
import useProductFilters from "../hooks/useProductFilters";

/**
 * Interactive half of /cakes.
 *
 * Everything here used to live in page.js as a client component that fetched in
 * useEffect and declared its SEO tags through next/head — which the App Router
 * ignores. The consequence was that /cakes, the main commercial page, served
 * crawlers the root layout's homepage title and canonical plus an empty product
 * grid. The page is now a server component that fetches and renders the grid;
 * this component only adds filtering/search/sort on top of that markup.
 *
 * It deliberately does NOT re-fetch: the products are already in the server HTML,
 * and re-fetching would blank the grid on hydration.
 */
export default function CakesPageClient({ products = [], categories = [] }) {
  const {
    filteredProducts,
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
  } = useProductFilters(products);

  // Filters are a no-op until the user touches them, so the server-rendered list
  // is what renders on first paint.
  const visibleProducts = useMemo(
    () => (filteredProducts.length > 0 ? filteredProducts : (searchTerm || selectedCategory ? [] : products)),
    [filteredProducts, searchTerm, selectedCategory, products]
  );

  return (
    <>
      {/* Breadcrumb Begin */}
      <Breadcrumb title="Our Cakes" items={[{ label: "Cakes" }]} />
      {/* Breadcrumb End */}

      {/* Shop Section Begin */}
      <section className="shop spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <ProductFilters
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                sortBy={sortBy}
                setSortBy={setSortBy}
                isLoading={false}
              />

              <div className="row">
                {visibleProducts.length > 0 ? (
                  visibleProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <div className="col-12 text-center py-5">
                    <h4>No products found</h4>
                    <p className="text-muted">
                      {searchTerm || selectedCategory
                        ? "Try adjusting your search or filter criteria."
                        : "No products available at the moment."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Shop Section End */}
    </>
  );
}
