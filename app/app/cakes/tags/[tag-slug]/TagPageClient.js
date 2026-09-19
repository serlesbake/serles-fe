"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import Breadcrumb from "../../../components/Breadcrumb";
import ProductFilters from "../../../components/ProductFilters";
import ProductCard from "../../../components/ProductCard";
import ProductTags from "../../../components/ProductTags";
import useProductFilters from "../../../hooks/useProductFilters";
import apiCache from "../../../utils/cache";
import { getProductsUrl, getCategoriesUrl, getTagsUrl } from "../../../config/api";

/** "birthday-cakes" -> "Birthday Cakes", for the heading shown before the fetch resolves. */
const titleFromSlug = (slug = "") =>
  slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

/** Heading for the pre-fetch state. Most tag slugs already end in "cake(s)",
    so appending "Cakes" unconditionally gave headings like "Birthday Cakes Cakes". */
const tagHeading = (slug = "") => {
  const name = titleFromSlug(slug);
  return /cakes?$/i.test(name) ? name : `${name} Cakes`;
};

export default function TagPageClient({
  params,
  initialProducts,
  initialCategories,
  initialTags,
}) {
  const router = useRouter();
  const tagSlug = params["tag-slug"];

  // page.js fetches this on the server and passes it in (already filtered to the
  // tag), so the product grid is in the HTML crawlers receive. The effect below
  // stays as a fallback for any caller that renders this without the props.
  const hasServerData = Array.isArray(initialProducts);

  const [products, setProducts] = useState(initialProducts ?? []);
  const [categories, setCategories] = useState(initialCategories ?? []);
  const [tags, setTags] = useState(initialTags ?? []);
  const [loading, setLoading] = useState(!hasServerData);
  const [error, setError] = useState(null);
  const [dataFetched, setDataFetched] = useState(hasServerData);

  // Filter products by tag
  const filterProductsByTag = useCallback((products, tagSlug) => {
    if (!tagSlug || !products.length) return products;
    
    return products.filter(product => {
      if (!product.tags || !Array.isArray(product.tags)) return false;
      return product.tags.some(tag => tag.slug === tagSlug);
    });
  }, []);

  // Fetch data
  const fetchData = useCallback(async () => {
    if (dataFetched) return;
    
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [categoriesData, productsData, tagsData] = await Promise.all([
        apiCache.fetchWithCache(getCategoriesUrl()),
        apiCache.fetchWithCache(getProductsUrl()),
        apiCache.fetchWithCache(getTagsUrl())
      ]);

      // Filter products by tag
      const filteredProducts = filterProductsByTag(productsData.results || productsData, tagSlug);

      setCategories(categoriesData.results || categoriesData);
      setProducts(filteredProducts);
      setTags(tagsData.results || tagsData);
      setDataFetched(true);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [tagSlug, filterProductsByTag, dataFetched]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle category change
  const handleCategoryChange = useCallback((newCategory) => {
    if (newCategory) {
      router.push(`/cakes/${newCategory}`);
    }
  }, [router]);

  // Use product filters hook
  const {
    filteredProducts,
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    isFiltering
  } = useProductFilters(products, handleCategoryChange);

  // Get current tag name
  const currentTag = tags.find(tag => tag.slug === tagSlug);

  // useProductFilters seeds filteredProducts to [] and only fills it after a 300ms
  // debounce, so without this the server would render "No products found" over a
  // list it had just fetched.
  const visibleProducts =
    filteredProducts.length > 0 ? filteredProducts : searchTerm ? [] : products;

  // Breadcrumb items
  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Cakes", href: "/cakes" },
    { name: "Tags", href: "/cakes/tags" },
    { name: currentTag?.name || tagSlug, href: `/cakes/tags/${tagSlug}` }
  ];

  // Meta data - dynamically generated from API with fallback
  // The metaData object that used to live here fed a <Head> block, which the
  // App Router ignores. SEO tags for this route are now declared with
  // generateMetadata() in page.js.

  if (loading) {
    return (
      <>
        {/* The breadcrumb carries the page's <h1>; without it the server HTML has
            no heading at all, since this component fetches client-side. */}
        <Breadcrumb
          title={tagHeading(tagSlug)}
          items={[
            { label: "Cakes", href: "/cakes" },
            { label: "Tags", href: "/cakes/tags" },
            { label: titleFromSlug(tagSlug) },
          ]}
        />
        <div className="container mt-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="container mt-5">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error Loading Products</h4>
            <p>{error}</p>
            <hr />
            <p className="mb-0">
              <button 
                className="btn btn-primary" 
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>

      <div className="container mt-5">
        <Breadcrumb 
          title={currentTag ? `${currentTag.name} Cakes` : "Tagged Cakes"}
          items={breadcrumbItems}
        />

        <div className="row">
          <div className="col-lg-12">
            <div className="shop__option">
              <ProductFilters
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                sortBy={sortBy}
                setSortBy={setSortBy}
                isFiltering={isFiltering}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="shop__product__option">
              <div className="row">
                {visibleProducts.length > 0 ? (
                  visibleProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <div className="col-12">
                    <div className="text-center py-5">
                      <h4>No products found</h4>
                      <p className="text-muted">
                        {searchTerm 
                          ? `No products found matching "${searchTerm}" in this tag.`
                          : `No products found for the tag "${currentTag?.name || tagSlug}".`
                        }
                      </p>
                      <button 
                        className="btn btn-primary"
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedCategory("");
                          setSortBy("default");
                        }}
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tags section hidden for now */}
        {/* {tags.length > 0 && (
          <div className="row mt-5">
            <div className="col-lg-12">
              <h5>All Tags</h5>
              <ProductTags tags={tags} maxTags={20} />
            </div>
          </div>
        )} */}
      </div>
    </>
  );
} 