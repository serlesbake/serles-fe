'use client'
import Breadcrumb from "../components/Breadcrumb";
import Link from "next/link";
import sitemapUtils from "../utils/sitemap.mjs";
import { useEffect, useState } from "react";

// Metadata handled in layout.js

export default function SiteMapPage() {
  const [sitemapData, setSitemapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSitemapData() {
      try {
        const data = await sitemapUtils.generateSitemapData();
        setSitemapData(data);
      } catch (err) {
        console.error('Error fetching sitemap data:', err);
        setError('Failed to load sitemap data');
      } finally {
        setLoading(false);
      }
    }

    fetchSitemapData();
  }, []);

  if (loading) {
    return (
      <>
        <Breadcrumb title="Site Map" />
        <section style={{ 
          background: "linear-gradient(135deg, #fef7f8 0%, #fff5f6 100%)", 
          padding: "80px 0 60px",
          minHeight: "100vh"
        }}>
          <div className="container">
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading site map...</p>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (error || !sitemapData) {
    return (
      <>
        <Breadcrumb title="Site Map" />
        <section style={{ 
          background: "linear-gradient(135deg, #fef7f8 0%, #fff5f6 100%)", 
          padding: "80px 0 60px",
          minHeight: "100vh"
        }}>
          <div className="container">
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Error Loading Site Map</h4>
              <p>{error || 'Failed to load site map data'}</p>
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
        </section>
      </>
    );
  }

  const currentDate = sitemapUtils.formatDate(new Date());

  return (
    <>
      <Breadcrumb title="Site Map" headingLevel="h2" />
      
      <section style={{ 
        background: "linear-gradient(135deg, #fef7f8 0%, #fff5f6 100%)", 
        padding: "80px 0 60px",
        minHeight: "100vh"
      }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div style={{
                background: "#fff",
                borderRadius: "20px",
                padding: "40px",
                boxShadow: "0 8px 32px rgba(228, 113, 138, 0.1)",
                lineHeight: "1.8"
              }}>
                <h1 className="text-center mb-3" style={{ 
                  color: "#e4718a",
                  fontWeight: "700",
                  fontSize: "2.5rem"
                }}>
                  Site Map
                </h1>
                
                <p className="text-center text-muted mb-4" style={{ fontSize: "1.1rem" }}>
                  Navigate through all pages and sections of serlesbake.in
                </p>

                {/* Statistics Section */}
                <div className="row mb-5">
                  <div className="col-12">
                    <div style={{
                      background: "linear-gradient(135deg, #e4718a 0%, #f8a6b6 100%)",
                      borderRadius: "15px",
                      padding: "25px",
                      color: "#fff",
                      textAlign: "center"
                    }}>
                      <div className="row">
                        <div className="col-md-3 mb-3">
                          <div style={{ fontSize: "2rem", fontWeight: "700" }}>
                            {sitemapData.stats.totalProducts}
                          </div>
                          <div style={{ fontSize: "0.9rem", opacity: "0.9" }}>
                            Total Products
                          </div>
                        </div>
                        <div className="col-md-3 mb-3">
                          <div style={{ fontSize: "2rem", fontWeight: "700" }}>
                            {sitemapData.stats.totalCategories}
                          </div>
                          <div style={{ fontSize: "0.9rem", opacity: "0.9" }}>
                            Categories
                          </div>
                        </div>
                        <div className="col-md-3 mb-3">
                          <div style={{ fontSize: "2rem", fontWeight: "700" }}>
                            {sitemapData.stats.totalTags}
                          </div>
                          <div style={{ fontSize: "0.9rem", opacity: "0.9" }}>
                            Tags
                          </div>
                        </div>
                        <div className="col-md-3 mb-3">
                          <div style={{ fontSize: "2rem", fontWeight: "700" }}>
                            {sitemapData.stats.uniqueProductNames}
                          </div>
                          <div style={{ fontSize: "0.9rem", opacity: "0.9" }}>
                            Unique Products
                          </div>
                        </div>
                      </div>
                      <div className="mt-3" style={{ fontSize: "0.9rem", opacity: "0.8" }}>
                        Last updated: {currentDate}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  {/* Main Pages */}
                  <div className="col-md-6 mb-4">
                    <div style={{
                      background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                      borderRadius: "15px",
                      padding: "25px",
                      height: "100%"
                    }}>
                      <h3 style={{ 
                        color: "#e4718a", 
                        marginBottom: "1.5rem",
                        fontSize: "1.5rem",
                        fontWeight: "600"
                      }}>
                        🏠 Main Pages
                      </h3>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {sitemapData.staticPages.map((page, index) => (
                          <li key={index} style={{ marginBottom: "0.8rem" }}>
                            <Link href={page.path} style={{ 
                              color: "#333", 
                              textDecoration: "none",
                              fontSize: "1rem",
                              transition: "color 0.3s ease"
                            }}
                            onMouseEnter={(e) => e.target.style.color = "#e4718a"}
                            onMouseLeave={(e) => e.target.style.color = "#333"}
                            >
                              • {page.path === '/' ? 'Home Page' : page.path.slice(1).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Product Pages */}
                  <div className="col-md-6 mb-4">
                    <div style={{
                      background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                      borderRadius: "15px",
                      padding: "25px",
                      height: "100%"
                    }}>
                      <h3 style={{ 
                        color: "#e4718a", 
                        marginBottom: "1.5rem",
                        fontSize: "1.5rem",
                        fontWeight: "600"
                      }}>
                        🎂 Product Pages
                      </h3>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        <li style={{ marginBottom: "0.8rem" }}>
                          <Link href="/cakes" style={{ 
                            color: "#333", 
                            textDecoration: "none",
                            fontSize: "1rem",
                            transition: "color 0.3s ease"
                          }}
                          onMouseEnter={(e) => e.target.style.color = "#e4718a"}
                          onMouseLeave={(e) => e.target.style.color = "#333"}
                          >
                            • All Cakes ({sitemapData.stats.totalProducts} products)
                          </Link>
                        </li>
                        <li style={{ marginBottom: "0.8rem" }}>
                          <Link href="/cakes/tags" style={{ 
                            color: "#333", 
                            textDecoration: "none",
                            fontSize: "1rem",
                            transition: "color 0.3s ease"
                          }}
                          onMouseEnter={(e) => e.target.style.color = "#e4718a"}
                          onMouseLeave={(e) => e.target.style.color = "#333"}
                          >
                            • All Tags ({sitemapData.stats.totalTags} tags)
                          </Link>
                        </li>
                        <li style={{ marginBottom: "0.8rem" }}>
                          <Link href="/menu" style={{ 
                            color: "#333", 
                            textDecoration: "none",
                            fontSize: "1rem",
                            transition: "color 0.3s ease"
                          }}
                          onMouseEnter={(e) => e.target.style.color = "#e4718a"}
                          onMouseLeave={(e) => e.target.style.color = "#333"}
                          >
                            • Menu & Pricing
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Category Pages */}
                  <div className="col-md-6 mb-4">
                    <div style={{
                      background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                      borderRadius: "15px",
                      padding: "25px",
                      height: "100%"
                    }}>
                      <h3 style={{ 
                        color: "#e4718a", 
                        marginBottom: "1.5rem",
                        fontSize: "1.5rem",
                        fontWeight: "600"
                      }}>
                        📂 Categories ({sitemapData.categories.length})
                      </h3>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {sitemapData.categories.map((category, index) => (
                          <li key={index} style={{ marginBottom: "0.8rem" }}>
                            <Link href={`/cakes/${category.slug}`} style={{ 
                              color: "#333", 
                              textDecoration: "none",
                              fontSize: "1rem",
                              transition: "color 0.3s ease"
                            }}
                            onMouseEnter={(e) => e.target.style.color = "#e4718a"}
                            onMouseLeave={(e) => e.target.style.color = "#333"}
                            >
                              • {category.name} ({category.productCount} products)
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Tag Pages */}
                  <div className="col-md-6 mb-4">
                    <div style={{
                      background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                      borderRadius: "15px",
                      padding: "25px",
                      height: "100%"
                    }}>
                      <h3 style={{ 
                        color: "#e4718a", 
                        marginBottom: "1.5rem",
                        fontSize: "1.5rem",
                        fontWeight: "600"
                      }}>
                        🏷️ Popular Tags
                      </h3>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {sitemapData.tags
                          .filter(tag => tag.productCount > 0)
                          .sort((a, b) => b.productCount - a.productCount)
                          .slice(0, 10)
                          .map((tag, index) => (
                          <li key={index} style={{ marginBottom: "0.8rem" }}>
                            <Link href={`/cakes/tags/${tag.slug}`} style={{ 
                              color: "#333", 
                              textDecoration: "none",
                              fontSize: "1rem",
                              transition: "color 0.3s ease"
                            }}
                            onMouseEnter={(e) => e.target.style.color = "#e4718a"}
                            onMouseLeave={(e) => e.target.style.color = "#333"}
                            >
                              • {tag.name} ({tag.productCount} products)
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Quick Links Section */}
                <div className="mt-5">
                  <h3 style={{ 
                    color: "#e4718a", 
                    marginBottom: "1.5rem",
                    fontSize: "1.8rem",
                    fontWeight: "600",
                    textAlign: "center"
                  }}>
                    🔗 Quick Links
                  </h3>
                  <div className="row justify-content-center">
                    <div className="col-md-8">
                      <div style={{
                        background: "linear-gradient(135deg, #e4718a 0%, #f8a6b6 100%)",
                        borderRadius: "15px",
                        padding: "30px",
                        textAlign: "center"
                      }}>
                        <div className="row">
                          <div className="col-md-4 mb-3">
                            <Link href="tel:+916383070725" style={{ 
                              color: "#fff", 
                              textDecoration: "none",
                              fontSize: "1.1rem",
                              fontWeight: "600",
                              display: "block"
                            }}>
                              📞 Call Now
                            </Link>
                          </div>
                          <div className="col-md-4 mb-3">
                            <Link href="https://wa.me/916383070725" style={{ 
                              color: "#fff", 
                              textDecoration: "none",
                              fontSize: "1.1rem",
                              fontWeight: "600",
                              display: "block"
                            }}>
                              💬 WhatsApp
                            </Link>
                          </div>
                          <div className="col-md-4 mb-3">
                            <Link href="mailto:serlesbake@gmail.com" style={{ 
                              color: "#fff", 
                              textDecoration: "none",
                              fontSize: "1.1rem",
                              fontWeight: "600",
                              display: "block"
                            }}>
                              ✉️ Email Us
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* XML Sitemap Link */}
                <div className="text-center mt-4">
                  <p className="text-muted mb-2">
                    For search engines and developers:
                  </p>
                  <Link href="/sitemap.xml" style={{ 
                    color: "#e4718a", 
                    textDecoration: "none",
                    fontSize: "1rem",
                    fontWeight: "600"
                  }}>
                    📄 View XML Sitemap
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 