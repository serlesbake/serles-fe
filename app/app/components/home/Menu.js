'use client';
import { useEffect, useState } from "react";
import { getProductsUrl, getCategoriesUrl, getProductDetailUrl } from '../../config/api';
import apiCache from '../../utils/cache';
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import styles from './Menu.module.css';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Helper: normalize category key from API category name/slug
function getCategoryKeyFromProduct(product) {
  // Try slug first, fallback to name
  if (product.category) {
    if (product.category.slug) {
      // Our tabs use "flavored", "brownie", etc.
      // API slug is e.g. "flavored-cakes" or "brownie"
      if (product.category.slug.includes("flavored")) return "flavored";
      if (product.category.slug.includes("premium")) return "premium";
      if (product.category.slug.includes("custom")) return "custom";
      if (product.category.slug.includes("brownie")) return "brownie";
    }
    if (product.category.name) {
      const name = product.category.name.toLowerCase();
      if (name.includes("flavored")) return "flavored";
      if (name.includes("premium")) return "premium";
      if (name.includes("custom")) return "custom";
      if (name.includes("brownie")) return "brownie";
    }
  }
  return "";
}

export default function Menu({ initialProducts = [], initialCategories = [] }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const hasInitialData = initialProducts.length > 0 || initialCategories.length > 0;
  const [loading, setLoading] = useState(!hasInitialData);
  const [apiError, setApiError] = useState(null);
  const [displayLimit, setDisplayLimit] = useState(6); // Show only 6 products initially

  useEffect(() => {
    if (hasInitialData) return;
    const fetchData = async () => {
      setLoading(true);
      setApiError(null);
      
      try {
        // Fetch both products and categories in parallel
        const [productsData, categoriesData] = await Promise.all([
          apiCache.fetchWithCache(getProductsUrl()),
          apiCache.fetchWithCache(getCategoriesUrl())
        ]);
        
        // Handle the API response structure
        const productsItems = Array.isArray(productsData.results) ? productsData.results : productsData;
        const categoriesItems = Array.isArray(categoriesData.results) ? categoriesData.results : categoriesData;
        
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
        
        setProducts(detailedProducts);
        setCategories(categoriesItems);
      } catch (err) {
        console.error("Error fetching data:", err);
        setApiError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hasInitialData]);

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

  // Get limited products for display (no grouping - each product is separate)
  const displayProducts = filteredProducts.slice(0, displayLimit);
  const hasMoreProducts = filteredProducts.length > displayLimit;

  // Handle WhatsApp enquiry
  const handleWhatsAppEnquiry = (productName, weightOption = null) => {
    const message = `Hi! I'm interested in ordering the ${productName} cake.${weightOption ? `\n\nWeight: ${weightOption.display_name}\nPrice: ₹${weightOption.price}` : ''}\n\nPlease contact me for more details. Thank you!`;
    const whatsappUrl = `https://wa.me/916383070725?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Debug: Log category mapping
  console.log('Active category:', activeCategory);
  console.log('Categories from API:', categories);
  console.log('Category tabs:', categoryTabs);
  console.log('All products:', products.map(p => ({ name: p.name, category: p.category?.name, categorySlug: p.category?.slug })));
  console.log('Filtered products:', filteredProducts.map(p => p.name));

  return (
    <section style={{ background: "#fff", padding: "60px 0" }}>
      <div className="container">
        <div className="text-center mb-4">
          <div style={{ color: "#e4718a", fontWeight: 700, fontSize: "1.5rem" }} className="cursive mb-2">
            Menu &amp; Pricing
          </div>
          <h2 style={{ fontWeight: 800, fontSize: "2.2rem", margin: "0 0 10px 0", letterSpacing: "1px" }} className="h1 text-gray">
            EXPLORE OUR HOMEMADE <br /> CAKE COLLECTION
          </h2>
          <div style={{ width: 80, height: 4, background: "#e4718a", margin: "16px auto 0 auto", borderRadius: 2 }} />
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
                onClick={() => setActiveCategory(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Simple Menu List */}
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
              {displayProducts.length === 0 && (
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
              {displayProducts.map((product, idx) => (
                <div 
                  key={product.id || product.name + idx}
                  className={styles.menuItem}
                >
                  {/* Product Image */}
                  <div className={styles.menuItemImage}>
                    {product?.featured_image && product?.featured_image.url ? (
                      <img
                        src={product.featured_image.url}
                        alt={product.featured_image.alt_text || product.name}
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
                        {product.name}
                      </h5>
                      {product?.is_best_seller && (
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
                      <div className={styles.weightOptions}>
                        {/* Show weight options for this specific product */}
                        {product?.weight_options && product.weight_options.length > 0 ? (
                          product.weight_options.map((weightOption, weightIdx) => (
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
                                Starting from 1kg
                            </span>
                            
                            <span style={{
                              background: "#28a745",
                              color: "#fff",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontSize: "0.75rem",
                              fontWeight: "700"
                            }}>
                              {product?.price_range || 'Enquire'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: "8px", flexDirection: "row" }}>
                    {/* View Details Button */}
                    <Link
                      href={product?.category?.slug && product?.slug 
                        ? `/cakes/${product.category.slug}/${product.slug}`
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
                        // Use the first weight option if available, otherwise null
                        const weightOption = product?.weight_options?.[0] || null;
                        handleWhatsAppEnquiry(product.name, weightOption);
                      }}
                    >
                      <i className="fab fa-whatsapp" style={{ fontSize: "0.9rem" }}></i>
                      Order
                    </button>
                  </div>
                </div>
              ))}
            </div>

           

            {/* Always show View All Products button if there are products */}
            {displayProducts.length > 0 && (
              <div className="text-center mt-4">
                <Link
                  href="/menu"
                  style={{
                    background: "linear-gradient(135deg, #e4718a, #ff91a4)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50px",
                    padding: "12px 30px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    textDecoration: "none",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 15px rgba(228, 113, 138, 0.3)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-1px)";
                    e.target.style.boxShadow = "0 6px 20px rgba(228, 113, 138, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 4px 15px rgba(228, 113, 138, 0.3)";
                  }}
                >
                  <span>Browse Complete Menu</span>
                  <i className="fas fa-utensils"></i>
                </Link>
              </div>
            )}
          </>
        )}

        {/* Promotional Section */}
        <div style={{ 
          background: "linear-gradient(135deg, #fff5f7 0%, #ffeef2 100%)", 
          padding: "80px 0", 
          marginTop: "80px",
          borderTop: "3px solid #e4718a",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Decorative Elements */}
          <div style={{
            position: "absolute",
            top: "-50px",
            left: "-50px",
            width: "200px",
            height: "200px",
            background: "radial-gradient(circle, rgba(228, 113, 138, 0.1) 0%, transparent 70%)",
            borderRadius: "50%"
          }}></div>
          <div style={{
            position: "absolute",
            bottom: "-30px",
            right: "-30px",
            width: "150px",
            height: "150px",
            background: "radial-gradient(circle, rgba(228, 113, 138, 0.08) 0%, transparent 70%)",
            borderRadius: "50%"
          }}></div>

          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10 text-center">
                
                {/* All Flavored Cakes Available */}
                <div style={{ 
                  marginBottom: "60px",
                  background: "#fff",
                  padding: "40px",
                  borderRadius: "20px",
                  boxShadow: "0 10px 40px rgba(228, 113, 138, 0.15)",
                  border: "1px solid rgba(228, 113, 138, 0.1)"
                }}>
                  <div style={{
                    width: "80px",
                    height: "4px",
                    background: "linear-gradient(90deg, #e4718a, #ff91a4)",
                    margin: "0 auto 25px auto",
                    borderRadius: "2px"
                  }}></div>
                  
                  <h3 style={{
                    fontWeight: "800",
                    fontSize: "2.2rem",
                    color: "#231f20",
                    marginBottom: "25px",
                    background: "linear-gradient(135deg, #e4718a, #ff91a4)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  }}>
                    All Flavored Cakes Available
                  </h3>
                  <p style={{
                    color: "#555",
                    fontSize: "1.15rem",
                    lineHeight: "1.8",
                    margin: "0",
                    maxWidth: "800px",
                    margin: "0 auto"
                  }}>
                    Choose from a variety of flavors like <strong>Chocolate</strong>, <strong>Vanilla</strong>, <strong>Butterscotch</strong>, <strong>Red Velvet</strong>, <strong>Pineapple</strong>, <strong>Strawberry</strong>, <strong>Black Forest</strong>, <strong>White Forest</strong>, and more. Whether you're celebrating birthdays, anniversaries, or special moments, our cakes are tailored to your preferences and fully customizable!
                  </p>
                </div>

                {/* Home Delivery Available */}
                <div style={{ 
                  marginBottom: "50px",
                  background: "#fff",
                  padding: "40px",
                  borderRadius: "20px",
                  boxShadow: "0 10px 40px rgba(228, 113, 138, 0.15)",
                  border: "1px solid rgba(228, 113, 138, 0.1)",
                  position: "relative"
                }}>
                  <div style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    background: "#28a745",
                    color: "#fff",
                    padding: "8px 16px",
                    borderRadius: "20px",
                    fontSize: "0.9rem",
                    fontWeight: "600"
                  }}>
                    🚚 Same Day Delivery
                  </div>
                  
                  <div style={{
                    width: "80px",
                    height: "4px",
                    background: "linear-gradient(90deg, #28a745, #20c997)",
                    margin: "0 auto 25px auto",
                    borderRadius: "2px"
                  }}></div>
                  
                  <h3 style={{
                    fontWeight: "800",
                    fontSize: "2rem",
                    color: "#231f20",
                    marginBottom: "20px"
                  }}>
                    Home Delivery Available in Tenkasi
                  </h3>
                  
                  <div style={{
                    background: "linear-gradient(135deg, #28a745, #20c997)",
                    color: "#fff",
                    padding: "15px 30px",
                    borderRadius: "15px",
                    display: "inline-block",
                    marginBottom: "20px",
                    fontSize: "1.3rem",
                    fontWeight: "700",
                    boxShadow: "0 5px 20px rgba(40, 167, 69, 0.3)"
                  }}>
                    Just ₹50!
                  </div>
                  
                  <p style={{
                    color: "#555",
                    fontSize: "1.15rem",
                    lineHeight: "1.8",
                    margin: "0",
                    maxWidth: "700px",
                    margin: "0 auto"
                  }}>
                    Freshly baked goods delivered to your doorstep in and around Tenkasi.{" "}
                    <Link href="https://wa.me/916383070725?text=I%20want%20to%20order%20a%20cake" style={{ 
                      color: "#e4718a", 
                      fontWeight: "700", 
                      cursor: "pointer",
                      textDecoration: "underline",
                      textUnderlineOffset: "3px"
                    }}>
                      Order now
                    </Link>{" "}
                    and enjoy same-day delivery!
                  </p>
                </div>

                {/* Order Now Button */}
                <div className="d-flex justify-content-center">
                  <button
                    style={{
                      background: "linear-gradient(135deg, #e4718a, #ff91a4)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "50px",
                      padding: "20px 50px",
                      fontSize: "1.3rem",
                      fontWeight: "800",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: "0 8px 30px rgba(228, 113, 138, 0.4)",
                      position: "relative",
                      overflow: "hidden"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-3px) scale(1.05)";
                      e.target.style.boxShadow = "0 12px 40px rgba(228, 113, 138, 0.6)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0) scale(1)";
                      e.target.style.boxShadow = "0 8px 30px rgba(228, 113, 138, 0.4)";
                    }}
                    onClick={() => {
                      window.location.href = "https://wa.me/916383070725?text=I%20want%20to%20order%20a%20cake";
                    }}
                    className="d-flex align-items-center justify-content-center gap-3 text-center"
                  >
                    <span>Order Now</span>
                    <FaWhatsapp size={24}/>
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
       
        </div>
      </section>
  );
}
