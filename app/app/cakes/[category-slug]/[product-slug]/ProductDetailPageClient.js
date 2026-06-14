"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Head from "next/head";
import { notFound } from "next/navigation";
import { getProductsUrl, getCategoriesUrl, getProductDetailUrl } from "../../../config/api";
import Breadcrumb from "../../../components/Breadcrumb";
import ProductCard from "../../../components/ProductCard";
import ProductFAQ from "../../../components/ProductFAQ";
import apiCache from "../../../utils/cache";

export default function ProductDetailPageClient({ params }) {
  const categorySlug = params.categorySlug ?? params["category-slug"];
  const productSlug = params.productSlug ?? params["product-slug"];
  const router = useRouter();
  
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [activeAccordion, setActiveAccordion] = useState('description');
  const [customMessage, setCustomMessage] = useState("Happy Birthday ❤️");

  // Fetch data only once with caching
  useEffect(() => {
    if (dataFetched) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Use cached API calls
        const [productsData, categoriesData] = await Promise.all([
          apiCache.fetchWithCache(getProductsUrl()),
          apiCache.fetchWithCache(getCategoriesUrl())
        ]);

        const allProducts = Array.isArray(productsData?.results) ? productsData.results : Array.isArray(productsData) ? productsData : [];
        const allCategories = Array.isArray(categoriesData?.results) ? categoriesData.results : Array.isArray(categoriesData) ? categoriesData : [];

        // Find the specific product from the list
        const foundProductFromList = allProducts.find(p => 
          p.slug === productSlug && p.category?.slug === categorySlug
        );

        if (!foundProductFromList) {
          notFound();
        }

        // Fetch individual product data to get weight_options (with caching)
        const individualProductData = await apiCache.fetchWithCache(getProductDetailUrl(foundProductFromList.id));

        // Get related products (same category, different products)
        const related = allProducts.filter(p => 
          p.category?.slug === categorySlug && p.id !== foundProductFromList.id
        ).slice(0, 4);

        setProduct(individualProductData);
        setCategories(allCategories);
        setRelatedProducts(related);
        
        // Set default selected weight (first available weight option)
        if (individualProductData.weight_options && individualProductData.weight_options.length > 0) {
          setSelectedWeight(individualProductData.weight_options[0]);
        }
        
        setDataFetched(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categorySlug, productSlug, dataFetched]);

  // Handle quantity changes
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  // Handle weight selection
  const handleWeightChange = (weightOption) => {
    setSelectedWeight(weightOption);
  };

  // Handle accordion changes
  const handleAccordionChange = (accordionId) => {
    setActiveAccordion(activeAccordion === accordionId ? null : accordionId);
  };

  // Handle WhatsApp enquiry
  const handleWhatsAppEnquiry = () => {
    const message = `Hi! I'm interested in ordering the ${product.name} cake.

Product Details:
- Name: ${product.name}
- Weight: ${selectedWeight?.display_name || 'Standard'}
- Quantity: ${quantity}
- Price: ${getTotalPrice()}

Custom Message: ${customMessage}

Please contact me for more details. Thank you!`;

    const whatsappUrl = `https://wa.me/916383070725?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Get product images
  const getProductImages = () => {
    const images = [];
    
    // Add featured image first
    if (product?.featured_image?.url) {
      images.push(product.featured_image.url);
    }
    
    // Add other images
    if (product?.images && Array.isArray(product.images)) {
      product.images.forEach(img => {
        if (img.url && !images.includes(img.url)) {
          images.push(img.url);
        }
      });
    }
    
    // Fallback to placeholder
    if (images.length === 0) {
      images.push("/img/placeholder-product.jpg");
    }
    
    return images;
  };

  // Get current price based on selected weight
  const getCurrentPrice = () => {
    if (selectedWeight && selectedWeight.price) {
      return `₹${selectedWeight.price}`;
    }
    return product?.price_range?.replace(/\$/g, '₹') || "Price not available";
  };

  // Get unit price for quantity calculation
  const getUnitPrice = () => {
    if (selectedWeight && selectedWeight.price) {
      return parseFloat(selectedWeight.price);
    }
    return 0;
  };

  // Get total price based on quantity and selected weight
  const getTotalPrice = () => {
    const unitPrice = getUnitPrice();
    const total = unitPrice * quantity;
    return `₹${total.toFixed(2)}`;
  };

  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  if (!product) {
    return <div className="text-center py-5">Product not found</div>;
  }

  const productImages = getProductImages();
  const currentCategory = categories.find(c => c.slug === categorySlug);

  return (
    <>
      <Head>
        <title>{product.name ? `${product.name} | Serle's Bake` : "Serle's Bake"}</title>
        <meta name="description" content={product.short_description || (product.description || '').slice(0, 160)} />
        <link rel="canonical" href={`https://www.serlesbake.in/cakes/${categorySlug}/${product.slug}`} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.short_description || (product.description || '').slice(0, 160)} />
        <meta property="og:image" content={product.featured_image?.url || 'https://www.serlesbake.in/img/logo.png'} />
        <meta property="og:url" content={`https://www.serlesbake.in/cakes/${categorySlug}/${product.slug}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product.name} />
        <meta name="twitter:description" content={product.short_description || (product.description || '').slice(0, 160)} />
        <meta name="twitter:image" content={product.featured_image?.url || 'https://www.serlesbake.in/img/logo.png'} />
      </Head>

      <style jsx>{`
        @keyframes glitter {
          0%, 100% {
            background-position: 0% 50%;
            box-shadow: 0 0 20px rgba(37, 211, 102, 0.3);
          }
          25% {
            background-position: 100% 50%;
            box-shadow: 0 0 30px rgba(37, 211, 102, 0.5);
          }
          50% {
            background-position: 50% 100%;
            box-shadow: 0 0 25px rgba(37, 211, 102, 0.4);
          }
          75% {
            background-position: 50% 0%;
            box-shadow: 0 0 35px rgba(37, 211, 102, 0.6);
          }
        }

        .whatsapp-btn {
          background: linear-gradient(45deg, #25D366, #128C7E, #25D366);
          background-size: 200% 200%;
          animation: glitter 3s ease-in-out infinite;
          position: relative;
          overflow: hidden;
        }

        .whatsapp-btn::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transform: rotate(45deg);
          animation: glitter 2s linear infinite;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 15px 0;
        }

        .quantity-btn {
          width: 40px;
          height: 40px;
          border: 2px solid #ff91a4;
          background: #ff91a4;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }

        .quantity-btn:hover {
          background: #8f0e1c;
          border-color: #8f0e1c;
          transform: scale(1.1);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        }

        .quantity-btn:active {
          transform: scale(0.95);
        }

        .quantity-input {
          width: 60px;
          height: 40px;
          text-align: center;
          border: 2px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          color: #333;
          background: white;
          transition: all 0.3s ease;
        }

        .quantity-input:focus {
          outline: none;
          border-color: #ff91a4;
          box-shadow: 0 0 0 3px rgba(182, 17, 35, 0.1);
        }

        .price-display {
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          border: 2px solid #8f0e1c;
          border-radius: 10px;
          padding: 15px;
          margin: 15px 0;
          text-align: center;
        }

        .unit-price {
          font-size: 16px;
          color: #666;
          margin-bottom: 5px;
        }

        .total-price {
          font-size: 24px;
          font-weight: bold;
          color: #8f0e1c;
        }

        .quantity-label {
          font-weight: bold;
          color: #333;
          margin-bottom: 10px;
        }

        .accordion-item {
          border: 2px solid #f0f0f0;
          border-radius: 12px;
          margin-bottom: 15px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .accordion-item:hover {
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .accordion-header {
          border: none;
          padding: 18px 25px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 700;
          color: #333;
          font-size: 16px;
          position: relative;
          background:  #ffffff;
          width: 100%;
        }

        .accordion-header::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: linear-gradient(135deg, #ff91a4, #ffb3c1);
          transition: all 0.3s ease;
        }

        .accordion-header:hover {
          background: linear-gradient(135deg, #ffffff, #f8f9fa);
          color: #ff91a4;
        }

        .accordion-header.active {
          background: linear-gradient(135deg, #ff91a4, #ffb3c1);
          transition: all 0.3s ease;
          color: white;
        }

        .accordion-header.active::before {
          background: linear-gradient(135deg, #8f0e1c, #b61123);
        }

        .accordion-icon {
          transition: transform 0.3s ease;
          font-size: 20px;
          color: #ff91a4;
        }

        .accordion-header.active .accordion-icon {
          transform: rotate(180deg);
          color: white;
        }

        .accordion-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease;
          background: white;
        }

        .accordion-content.active {
          max-height: 600px;
          padding: 25px;
          border-top: 1px solid #f0f0f0;
        }

        .accordion-body {
          line-height: 1.8;
          color: #555;
        }

        .accordion-body h6 {
          color: #333;
          font-weight: 700;
          margin-bottom: 15px;
          font-size: 18px;
        }

        .accordion-body p {
          margin-bottom: 15px;
        }

        .accordion-body ul {
          padding-left: 20px;
        }

        .accordion-body li {
          margin-bottom: 8px;
          position: relative;
        }

        .accordion-body li::before {
          content: '•';
          color: #ff91a4;
          font-weight: bold;
          position: absolute;
          left: -15px;
        }

        .sticky-image-container {
          position: sticky;
          top: 20px;
          height: fit-content;
          z-index: 10;
          max-height: calc(100vh - 40px);
          overflow: hidden;
        }

        .product-details-container {
          position: relative;
          z-index: 1;
        }

        .related-products-section {
          position: relative;
          z-index: 5;
          margin-top: 80px;
          padding-top: 50px;
          border-top: 2px solid #f0f0f0;
          clear: both;
        }

        .product-details-row {
          position: relative;
          z-index: 1;
        }

        @media (max-width: 991px) {
          .sticky-image-container {
            position: static;
            margin-bottom: 30px;
            max-height: none;
            overflow: visible;
          }
          
          .related-products-section {
            margin-top: 50px;
          }
        }
      `}</style>

      {/* Breadcrumb Begin */}
      <Breadcrumb 
        title={product.name} 
        items={[
          { label: "Cakes", href: "/cakes" },
          { label: currentCategory?.name || "Category", href: `/cakes/${categorySlug}` },
          { label: product.name }
        ]} 
      />
      {/* Breadcrumb End */}

      {/* Shop Details Section Begin */}
      <section className="product-details spad product-details-container">
        <div className="container">
          <div className="row product-details-row">
            <div className="col-lg-6">
              <div className="product__details__img sticky-image-container">
                <div className="product__details__big__img">
                  <Image
                    src={productImages[selectedImage] || "/img/placeholder.jpg"}
                    alt={product.name}
                    width={500}
                    height={500}
                    style={{ objectFit: "cover" }}
                    className="big_img"
                  />
                </div>
                <div className="product__details__thumb">
                  {productImages.map((image, index) => (
                    <div 
                      key={index} 
                      className={`pt__item ${selectedImage === index ? 'active' : ''}`}
                      onClick={() => setSelectedImage(index)}
                      style={{ cursor: 'pointer' }}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} - Image ${index + 1}`}
                        width={100}
                        height={100}
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="product__details__text">
                <h3>{product.name}</h3>
                
                
                {/* Price Display */}
                <div className="price-display">
                  <div className="unit-price">
                    Unit Price: {getCurrentPrice()}
                  </div>
                  <div className="total-price">
                    Total: {getTotalPrice()}
                  </div>
                </div>
                
                <p>{product.short_description || product.description}</p>
                
                {/* Weight Options */}
                {product.weight_options && product.weight_options.length > 0 && (
                  <div className="product__details__widget">
                    <h6>Select Weight:</h6>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      {product.weight_options.map((weightOption, index) => (
                        <button
                          key={index}
                          type="button"
                          className={`btn ${selectedWeight?.id === weightOption.id ? 'btn-primary-light' : 'btn-outline-primary'}`}
                          onClick={() => handleWeightChange(weightOption)}
                          style={{
                            border: selectedWeight?.id === weightOption.id ? '2px solid #ff91a4' : '2px solid #ddd',
                            backgroundColor: selectedWeight?.id === weightOption.id ? '#ff91a4' : 'transparent',
                            color: selectedWeight?.id === weightOption.id ? 'white' : '#ff91a4',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            fontSize: '14px',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {weightOption.display_name?.replace(/\$/g, '₹')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="product__details__quantity">
                  <div className="quantity-label">Quantity:</div>
                  <div className="quantity-controls">
                    <button 
                      className="quantity-btn bg-primary-light"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      value={quantity} 
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      className="quantity-input"
                      min="1"
                    />
                    <button 
                      className="quantity-btn bg-primary-light"
                      onClick={() => handleQuantityChange(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Custom Message */}
                <div className="product__details__widget mb-3">
                  <h6>Custom Message:</h6>
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Enter your custom message for the cake..."
                    className="form-control"
                    rows="3"
                    style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '8px' }}
                  />
                </div>

                {/* WhatsApp Enquiry Button */}
                <button 
                  type="button" 
                  className="primary-btn whatsapp-btn"
                  onClick={handleWhatsAppEnquiry}
                  style={{
                    color: 'white',
                    border: 'none',
                    padding: '15px 30px',
                    borderRadius: '8px',
                    fontSize: '18px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    width: '100%',
                    marginTop: '10px'
                  }}
                >
                  <i className="fab fa-whatsapp me-2"></i>
                  WhatsApp Enquiry
                </button>

                <ul className="mt-3">
                  {/* <li><b>Availability:</b> <span>In Stock</span></li> */}
                  <li><b>SKU:</b> <span>{product.sku || 'N/A'}</span></li>
                  <li><b>Category:</b> <span>{product.category?.name || 'Cake'}</span></li>
                </ul>

                {/* Product Details Accordion */}
                <div className="product__details__accordion mt-5">
                  <h4 style={{ 
                    color: '#333', 
                    fontWeight: '700', 
                    marginBottom: '20px',
                    borderBottom: '3px solid #ff91a4',
                    paddingBottom: '10px'
                  }}>
                    Product Details
                  </h4>
                  {/* Description Accordion */}
                  <div className="accordion-item">
                    <button 
                      className={`accordion-header ${activeAccordion === 'description' ? 'active' : ''}`}
                      onClick={() => handleAccordionChange('description')}
                    >
                      <span>Product Description</span>
                      <i className={`fa fa-chevron-down accordion-icon ${activeAccordion === 'description' ? 'active' : ''}`}></i>
                    </button>
                    <div className={`accordion-content ${activeAccordion === 'description' ? 'active' : ''}`}>
                      <div className="accordion-body">
                        <h6>Product Information</h6>
                        <p>{product.description || product.short_description || 'No description available.'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information Accordion */}
                  <div className="accordion-item">
                    <button 
                      className={`accordion-header ${activeAccordion === 'additional' ? 'active' : ''}`}
                      onClick={() => handleAccordionChange('additional')}
                    >
                      <span>Additional Information</span>
                      <i className={`fa fa-chevron-down accordion-icon ${activeAccordion === 'additional' ? 'active' : ''}`}></i>
                    </button>
                    <div className={`accordion-content ${activeAccordion === 'additional' ? 'active' : ''}`}>
                      <div className="accordion-body">
                        <h6>Additional Information</h6>
                        <p>This cake is made with the finest ingredients and baked fresh to order. Perfect for birthdays, anniversaries, and special celebrations.</p>
                        <ul>
                          <li>Fresh ingredients</li>
                          <li>Customizable design</li>
                          <li>Home delivery available</li>
                          <li>Made to order</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Reviews Accordion */}
                  {/* <div className="accordion-item">
                    <button 
                      className={`accordion-header ${activeAccordion === 'reviews' ? 'active' : ''}`}
                      onClick={() => handleAccordionChange('reviews')}
                    >
                      <span>Customer Reviews & Location</span>
                      <i className={`fa fa-chevron-down accordion-icon ${activeAccordion === 'reviews' ? 'active' : ''}`}></i>
                    </button>
                    <div className={`accordion-content ${activeAccordion === 'reviews' ? 'active' : ''}`}>
                      <div className="accordion-body">
                        <h6>Customer Reviews</h6>
                        <div className="row">
                          <div className="col-lg-12">
                            <iframe
                              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3930.1234567890123!2d77.12345678901234!3d8.12345678901234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwMDcnMjAuMCJOIDc3wrAwNycwMC4wIkU!5e0!3m2!1sen!2sin!4v1234567890123"
                              width="100%"
                              height="300"
                              style={{ border: 0 }}
                              allowFullScreen=""
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                            <p className="mt-3">
                              <a 
                                href="https://www.google.com/maps/place/Serle's+Bake" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn btn-outline-primary"
                              >
                                View on Google Maps
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Shop Details Section End */}

      {/* Product FAQ (SEO-friendly JSON-LD + visible FAQ) */}
      <section className="container">
        <div className="row">
          <div className="col-lg-12">
            <ProductFAQ product={product} phone="916383070725" whatsappNumber="916383070725" />
          </div>
        </div>
      </section>

      {/* Spacer to prevent overlap */}
      <div style={{ height: '50px', clear: 'both' }}></div>

      {/* Related Products Section Begin */}
      <section className="related spad related-products-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h3 style={{ 
                color: '#333', 
                fontWeight: '700', 
                marginBottom: '30px',
                textAlign: 'center',
                position: 'relative'
              }}>
                <span style={{ 
                  background: 'white', 
                  padding: '0 20px',
                  position: 'relative',
                  zIndex: '1'
                }}>
                  Related Products
                </span>
                <div style={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '0', 
                  right: '0', 
                  height: '2px', 
                  background: 'linear-gradient(90deg, transparent, #ff91a4, transparent)',
                  zIndex: '0'
                }}></div>
              </h3>
            </div>
          </div>
          <div className="row">
            {relatedProducts.length > 0 ? (
              relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <h4>No related products found</h4>
                <p className="text-muted">Check back later for more products in this category.</p>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Related Products Section End */}
    </>
  );
} 