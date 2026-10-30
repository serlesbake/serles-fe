'use client';
import { useEffect, useState } from "react";
import { getProductsUrl, getCategoriesUrl, getProductDetailUrl } from '../config/api';
import apiCache from '../utils/cache';
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import styles from './home/Menu.module.css';
import { trackStoreEvent } from '../utils/analytics';
import { fetchCatalogJson, catalogList } from '../utils/catalog';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function AllProductsMenu({ initialProducts = [], initialCategories = [], initialCatalogLoaded = false }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [loading, setLoading] = useState(!initialCatalogLoaded);
  const [apiError, setApiError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const pageSize = 12; // Number of products per page

  // Fetch products for a specific page
  const fetchProducts = async (page = 1, append = false) => {
    try {
      const productsData = await fetchCatalogJson(getProductsUrl(page, pageSize));
      
      // Handle the API response structure
      const productsItems = catalogList(productsData);
      
      // Update total products count
      if (productsData.count !== undefined) {
        setTotalProducts(productsData.count);
      }
      
      // Check if there are more pages
      const totalPages = Math.ceil((productsData.count || productsItems.length) / pageSize);
      setHasMorePages(
        Array.isArray(productsData.results) && page < totalPages
      );
      
      // Fetch detailed product data with weight options
      const detailedProducts = await Promise.all(
        productsItems.map(async (product) => {
          try {
            const detailedProduct = await apiCache.fetchWithCache(
              getProductDetailUrl(product.id)
            );
            return detailedProduct;
          } catch (error) {
            console.error(`Error fetching details for product ${product.id}:`, error);
            return product; // Return original product if detailed fetch fails
          }
        })
      );
      
      if (append) {
        setProducts(prev => [...prev, ...detailedProducts]);
      } else {
        setProducts(detailedProducts);
      }
      
      return detailedProducts;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const categoriesData = await fetchCatalogJson(getCategoriesUrl());
      const categoriesItems = catalogList(categoriesData);
      setCategories(categoriesItems);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (initialCatalogLoaded) return;
    const fetchInitialData = async () => {
      setLoading(true);
      setApiError(null);
      
      try {
        await Promise.all([
          fetchProducts(1, false),
          fetchCategories()
        ]);
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setApiError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [initialCatalogLoaded]);

  // Generate category tabs from API data
  const generateCategoryTabs = () => {
    const tabs = [
      { key: "all", label: "All Products" }
    ];

    // Add categories from API
    categories.forEach(category => {
      if (category.name && category.slug) {
        tabs.push({
          key: category.slug,
          label: category.name,
          category: category
        });
      }
    });

    return tabs;
  };

  const categoryTabs = generateCategoryTabs();

  // Filter products by active category
  const filteredProducts = activeCategory === "all" 
    ? products 
    : products.filter((p) => p.category?.slug === activeCategory);

  // Group by name, so that each name has multiple variants (if any)
  const grouped = {};
  filteredProducts.forEach((item) => {
    if (!grouped[item.name]) grouped[item.name] = [];
    grouped[item.name].push(item);
  });

  // Handle category change
  const handleCategoryChange = (categoryKey) => {
    setActiveCategory(categoryKey);
    setCurrentPage(1);
    setProducts([]); // Clear current products
    setHasMorePages(false);
    
    // Fetch products for the new category
    fetchProducts(1, false);
  };

  // Handle load more
  const handleLoadMore = async () => {
    if (loadingMore || !hasMorePages) return;
    
    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      await fetchProducts(nextPage, true); // Append new products
      setCurrentPage(nextPage);
    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Handle WhatsApp enquiry
  const handleWhatsAppEnquiry = (productName, weightOption = null) => {
    trackStoreEvent('whatsapp_enquiry', {
      item_name: productName,
      weight: weightOption?.display_name || 'Standard',
      value: Number(weightOption?.price) || undefined,
      currency: 'INR',
    });
    const message = `Hi! I'm interested in ordering the ${productName} cake.${weightOption ? `\n\nWeight: ${weightOption.display_name}\nPrice: ₹${weightOption.price}` : ''}\n\nPlease contact me for more details. Thank you!`;
    const whatsappUrl = `https://wa.me/916383070725?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section style={{ background: "#fff", padding: "60px 0" }}>
      <div className="container">
        <div className="text-center mb-4">
          <div style={{ color: "#e4718a", fontWeight: 700, fontSize: "1.5rem" }} className="cursive mb-2">
            Complete Menu &amp; Pricing
          </div>
          <h2 style={{ fontWeight: 800, fontSize: "2.2rem", margin: "0 0 10px 0", letterSpacing: "1px" }} className="h1 text-gray">
            ALL OUR HOMEMADE <br /> CAKE COLLECTION
          </h2>
          <div style={{ width: 80, height: 4, background: "#e4718a", margin: "16px auto 0 auto", borderRadius: 2 }} />
          <p style={{ color: "#666", fontSize: "1.1rem", marginTop: "20px", maxWidth: "600px", margin: "0 auto" }}>
            Browse through our complete collection of delicious cakes. Each cake is made with love and the finest ingredients.
          </p>
          
          {/* Quick Stats */}
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            gap: "30px", 
            marginTop: "30px",
            flexWrap: "wrap"
          }}>
            <div style={{
              background: "linear-gradient(135deg, #fff5f7 0%, #ffeef2 100%)",
              padding: "15px 25px",
              borderRadius: "15px",
              border: "2px solid #e4718a",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#e4718a" }}>
                {loading ? "—" : totalProducts || Object.keys(grouped).length}
              </div>
              <div style={{ fontSize: "0.9rem", color: "#666", fontWeight: "600" }}>
                Total Products
              </div>
            </div>
            <div style={{
              background: "linear-gradient(135deg, #fff5f7 0%, #ffeef2 100%)",
              padding: "15px 25px",
              borderRadius: "15px",
              border: "2px solid #e4718a",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#e4718a" }}>
                {loading ? "—" : categories.length}
              </div>
              <div style={{ fontSize: "0.9rem", color: "#666", fontWeight: "600" }}>
                Categories
              </div>
            </div>
            <div style={{
              background: "linear-gradient(135deg, #fff5f7 0%, #ffeef2 100%)",
              padding: "15px 25px",
              borderRadius: "15px",
              border: "2px solid #e4718a",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#e4718a" }}>
                🚚
              </div>
              <div style={{ fontSize: "0.9rem", color: "#666", fontWeight: "600" }}>
                Same Day Delivery
              </div>
            </div>
          </div>
        </div>
        
        {/* Category Tabs */}
        <div className="d-flex flex-wrap justify-content-center mb-5">
          <div style={{
            background: "#231f20",
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
          }}>
            {categoryTabs.map(tab => (
              <button
                key={tab.key}
                className={classNames(
                  "px-4 py-2 border-0 fw-bold",
                  activeCategory === tab.key
                    ? "bg-pink text-white"
                    : "bg-transparent text-white-50"
                )}
                style={{
                  background: activeCategory === tab.key ? "#e4718a" : "transparent",
                  color: activeCategory === tab.key ? "#fff" : "#e0e0e0",
                  border: "none",
                  outline: "none",
                  cursor: "pointer",
                  fontSize: "1rem",
                  transition: "background 0.2s"
                }}
                onClick={() => handleCategoryChange(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Count */}
        <div className="text-center mb-4">
          <p style={{ color: "#666", fontSize: "1rem" }}>
            {loading ? "Loading products…" : `Showing ${Object.keys(grouped).length} of ${totalProducts || Object.keys(grouped).length} products`}
            {activeCategory !== "all" && ` in ${categories.find(c => c.slug === activeCategory)?.name || activeCategory}`}
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : apiError ? (
          <div className="text-center py-5">
            <div className="alert alert-danger" role="alert">
              Error: {apiError}
            </div>
          </div>
        ) : !loading && !apiError && products.length === 0 ? (
          <div className="text-center py-5">
            <div style={{
              background: "linear-gradient(135deg, #fff5f7 0%, #ffeef2 100%)",
              padding: "40px",
              borderRadius: "20px",
              border: "2px dashed #e4718a"
            }}>
              <h4 style={{ color: "#e4718a" }}>No products available</h4>
              <p className="text-muted">Check back later for our delicious cakes!</p>
            </div>
          </div>
        ) : (
          <>
            <div className="menu-list">
              {Object.keys(grouped).length === 0 && (
                <div className="text-center py-5">
                  <div style={{
                    background: "linear-gradient(135deg, #fff5f7 0%, #ffeef2 100%)",
                    padding: "40px",
                    borderRadius: "20px",
                    border: "2px dashed #e4718a"
                  }}>
                    <h4 style={{ color: "#e4718a" }}>No items found in this category</h4>
                    <p className="text-muted">Try selecting a different category or check back later!</p>
                  </div>
                </div>
              )}
              {Object.entries(grouped).map(([name, items], idx) => (
                <div 
                  key={name + idx}
                  className={styles.menuItem}
                >
                  {/* Product Image */}
                  <div className={styles.menuItemImage}>
                    {items[0]?.featured_image && items[0]?.featured_image.url ? (
                      <img
                        src={items[0].featured_image.url}
                        alt={items[0].featured_image.alt_text || name}
                        loading={idx === 0 ? "eager" : "lazy"}
                        fetchPriority={idx === 0 ? "high" : "auto"}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover"
                        }}
                      />
                    ) : (
                      <div style={{
                        width: "100%",
                        height: "100%",
                        background: "#f8f9fa",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#e4718a"
                      }}>
                        <i className="fas fa-birthday-cake" style={{ fontSize: "1.5rem" }}></i>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className={styles.menuItemContent}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                      <h5 style={{
                        fontWeight: "700",
                        fontSize: "1rem",
                        color: "#231f20",
                        margin: 0,
                        flex: "1"
                      }}>
                        {name}
                      </h5>
                      {items[0]?.is_best_seller && (
                        <span style={{
                          background: "#e4718a",
                          color: "#fff",
                          padding: "2px 6px",
                          borderRadius: "10px",
                          fontSize: "0.65rem",
                          fontWeight: "600"
                        }}>
                          ⭐ Best
                        </span>
                      )}
                    </div>
                    
                    <div className={styles.weightOptions}>
                      {/* Weight and Price Options */}
                      {items.length > 0 && (
                        <div className={styles.weightOptions}>
                          {/* Show weight options if available */}
                          {items[0]?.weight_options && items[0].weight_options.length > 0 ? (
                            items[0].weight_options.map((weightOption, weightIdx) => (
                              <div key={weightIdx} className={styles.weightOption}>
                                <span style={{
                                  color: "#555",
                                  fontSize: "0.8rem",
                                  fontWeight: "600"
                                }}>
                                  {weightOption.display_name || `${weightOption.weight || 'Enquire'}`}
                                </span>
                                
                                <span style={{
                                  background: "#28a745",
                                  color: "#fff",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  fontSize: "0.75rem",
                                  fontWeight: "700"
                                }}>
                                  ₹{weightOption.price || 'Enquire'}
                                </span>
                              </div>
                            ))
                          ) : (
                            /* Fallback to price range if no weight options */
                            <div className={styles.weightOption}>
                              <span style={{
                                color: "#555",
                                fontSize: "0.8rem",
                                fontWeight: "600"
                              }}>
                                Starting from 500gms
                              </span> 
                              
                              <span style={{
                                background: "#28a745",
                                color: "#fff",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                fontSize: "0.75rem",
                                fontWeight: "700"
                              }}>
                                {items[0]?.price_range || 'Enquire'}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: "8px", flexDirection: "column" }}>
                    {/* View Details Button */}
                    <Link
                      href={items[0]?.category?.slug && items[0]?.slug 
                        ? `/cakes/${items[0].category.slug}/${items[0].slug}`
                        : '/cakes'
                      }
                      style={{
                        background: "#e4718a",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        padding: "8px 12px",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        cursor: "pointer",
                        textDecoration: "none",
                        textAlign: "center",
                        transition: "all 0.3s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "#8f0e1c";
                        e.target.style.transform = "translateY(-1px)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "#e4718a";
                        e.target.style.transform = "translateY(0)";
                      }}
                    >
                      <i className="fas fa-eye" style={{ fontSize: "0.7rem" }}></i>
                      View
                    </Link>

                    {/* WhatsApp Order Button */}
                    <button
                      className={styles.orderButton}
                      onClick={() => {
                        const weightOption = items[0]?.weight_options?.[0];
                        handleWhatsAppEnquiry(name, weightOption);
                      }}
                    >
                      <i className="fab fa-whatsapp" style={{ fontSize: "0.9rem" }}></i>
                      Order
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMorePages && (
              <div className="text-center mt-5">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  style={{
                    background: "linear-gradient(135deg, #e4718a, #ff91a4)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50px",
                    padding: "15px 40px",
                    fontSize: "1.1rem",
                    fontWeight: "700",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 5px 20px rgba(228, 113, 138, 0.3)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    opacity: loadingMore ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!loadingMore) {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 8px 25px rgba(228, 113, 138, 0.4)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loadingMore) {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 5px 20px rgba(228, 113, 138, 0.3)";
                    }
                  }}
                >
                  {loadingMore ? (
                    <>
                      <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      Loading...
                    </>
                  ) : (
                    <>
                      <span>Load More Products (Page {currentPage + 1})</span>
                      <i className="fas fa-arrow-down"></i>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Back to Home Menu */}
            <div className="text-center mt-4">
              <Link
                href="/"
                style={{
                  color: "#e4718a",
                  textDecoration: "none",
                  fontSize: "1rem",
                  fontWeight: "600",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "#8f0e1c";
                  e.target.style.transform = "translateX(-5px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "#e4718a";
                  e.target.style.transform = "translateX(0)";
                }}
              >
                <i className="fas fa-arrow-left"></i>
                Back to Home Menu
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
} 
