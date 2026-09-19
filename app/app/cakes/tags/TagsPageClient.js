"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "../../components/Breadcrumb";
import apiCache from "../../utils/cache";
import { getProductsUrl, getTagsUrl } from "../../config/api";

export default function TagsPageClient({ initialTags, initialProducts }) {
  const router = useRouter();

  // page.js fetches this on the server and passes it in, so the tag list is in the
  // HTML crawlers receive. When the props are present we never fetch; the effect
  // below stays as a fallback for any caller that renders this without them.
  const hasServerData = Array.isArray(initialTags);

  const [tags, setTags] = useState(initialTags ?? []);
  const [products, setProducts] = useState(initialProducts ?? []);
  const [loading, setLoading] = useState(!hasServerData);
  const [error, setError] = useState(null);



  // Calculate product count for each tag
  const calculateTagCounts = useCallback((tags, products) => {
    return tags.map(tag => {
      const count = products.filter(product => 
        product.tags && Array.isArray(product.tags) && 
        product.tags.some(t => t.slug === tag.slug)
      ).length;
      return { ...tag, productCount: count };
    }).filter(tag => tag.productCount > 0); // Only show tags with products
  }, []);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [tagsData, productsData] = await Promise.all([
        apiCache.fetchWithCache(getTagsUrl()),
        apiCache.fetchWithCache(getProductsUrl())
      ]);

      const tagsList = tagsData.results || tagsData;
      const productsList = productsData.results || productsData;

      // Calculate tag counts
      const tagsWithCounts = calculateTagCounts(tagsList, productsList);

      setTags(tagsWithCounts);
      setProducts(productsList);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load tags. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [calculateTagCounts]);

  useEffect(() => {
    if (hasServerData) return;
    fetchData();
  }, [fetchData, hasServerData]);

  // Breadcrumb items
  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Cakes", href: "/cakes" },
    { name: "Tags", href: "/cakes/tags" }
  ];

  // Meta data - dynamically generated from API with fallback
  // The metaData object that used to live here fed a <Head> block, which the
  // App Router ignores. SEO tags for this route are now declared with
  // generateMetadata() in page.js.

  if (loading) {
    return (
      <>
        {/* The breadcrumb carries the page's <h1>. Rendering it only after the
            fetch resolves meant the server HTML had no heading at all. */}
        <Breadcrumb title="All Tags" items={[{ label: "Cakes", href: "/cakes" }, { label: "All Tags" }]} />
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
            <h4 className="alert-heading">Error Loading Tags</h4>
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
          title="All Tags"
          items={breadcrumbItems}
        />

        <div className="row">
          <div className="col-lg-12">
            <div className="section-title">
              <h2>Browse by Tags</h2>
              <p>Discover our cakes organized by tags and categories</p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            {tags.length > 0 ? (
              <div className="tags-grid">
                <div className="row">
                  {tags.map((tag) => (
                    <div key={tag.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                      <Link 
                        href={`/cakes/tags/${tag.slug}`}
                        className="tag-card text-decoration-none"
                        style={{
                          display: 'block',
                          padding: '20px',
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          textAlign: 'center',
                          transition: 'all 0.3s ease',
                          backgroundColor: '#fff',
                          color: '#333',
                          textDecoration: 'none'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-5px)';
                          e.target.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                          e.target.style.borderColor = '#b61123';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                          e.target.style.borderColor = '#e0e0e0';
                        }}
                      >
                        <h5 className="mb-2" style={{ color: '#b61123', fontWeight: '600' }}>
                          {tag.name}
                        </h5>
                        <p className="mb-0 text-muted">
                          {tag.productCount} {tag.productCount === 1 ? 'product' : 'products'}
                        </p>
                        {tag.description && (
                          <p className="mt-2 text-muted small">
                            {tag.description.length > 50 
                              ? `${tag.description.substring(0, 50)}...` 
                              : tag.description
                            }
                          </p>
                        )}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-5">
                <h4>No tags found</h4>
                <p className="text-muted">There are no tags available at the moment.</p>
                <Link href="/cakes" className="btn btn-primary">
                  Browse All Cakes
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-lg-12">
            <div className="text-center">
              <Link href="/cakes" className="btn btn-outline-primary">
                ← Back to All Cakes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 