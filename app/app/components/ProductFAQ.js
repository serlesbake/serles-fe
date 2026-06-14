"use client";
import { useState, useMemo } from "react";
import Head from "next/head";

function formatPrice(value) {
  if (value == null) return '';
  const num = parseFloat(value);
  if (Number.isNaN(num)) return String(value);
  return `₹${num.toFixed(2)}`;
}

export default function ProductFAQ({ product = {}, phone = "916383070725", whatsappNumber = "916383070725" }) {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = useMemo(() => {
    const items = [];

    // Weights
    if (product.weight_options && product.weight_options.length > 0) {
      const cleanName = (w) => {
        const dn = (w.display_name || w.name || '').trim();
        // remove trailing price-like fragments such as "- ₹399" or "- $10"
        return dn.replace(/\s*[-–—]\s*[₹$]?\s*[\d,\.]+.*$/g, '').trim();
      };

      const weightList = product.weight_options.map(w => {
        const name = cleanName(w);
        const price = w.price ? formatPrice(w.price) : '';
        return `${name}${price ? ` — ${price}` : ''}`.trim();
      }).join('; ');

      items.push({
        question: 'What weights are available for this cake?',
        answer: `Available weight options: ${weightList}.`,
        type: 'call',
        phoneLink: `tel:${phone}`
      });

      // Starting price
      const prices = product.weight_options.map(w => parseFloat(w.price || 0)).filter(p => !Number.isNaN(p));
      if (prices.length > 0) {
        const minPrice = Math.min(...prices);
        items.push({
          question: 'What is the starting price for this cake?',
          answer: `Prices start from ${formatPrice(minPrice)} for the smallest available weight.`
        });
      }
    } else if (product.price_range) {
      items.push({
        question: 'What is the price for this cake?',
        answer: `Price: ${product.price_range.replace(/\$/g, '₹')}. Contact us for exact quotes on custom orders.`
      });
    }

    // Delivery
    const deliveryText = product.delivery_info || product.delivery_details || product.delivery_time || '';
    items.push({
      question: 'What are the delivery options and charges?',
      answer: deliveryText || 'We offer home delivery within our service area. Delivery timings and charges depend on your location — enter your delivery address at checkout or contact us to confirm delivery charges.'
    });

    // WhatsApp
    const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi! I am interested in the ${product.name || 'cake'}.`)}`;
    items.push({
      question: 'How can I order via WhatsApp?',
      answer: `Start a WhatsApp chat with us: ${waLink} (or tap the button).`,
      type: 'whatsapp',
      waLink
    });

    // Call
    items.push({
      question: 'Can I call to place an order?',
      answer: `Yes — call us at ${phone}.`,
      type: 'call',
      phoneLink: `tel:${phone}`
    });

    // Payment / Amount
    items.push({
      question: 'How is the amount calculated and how do I pay?',
      answer: 'The amount shown is for the selected weight and quantity. Delivery charges (if any) are added at checkout. We accept cash on delivery and online payments — confirm available payment methods during checkout or by contacting us.'
    });

    // Cake customizations
    items.push({
      question: 'Can I customize the cake (message, photo, flavour)?',
      answer: 'Yes — most cakes can be customized with a message, photo print, flavour choice, and simple design changes. For complex custom designs, please contact us with the details and we will confirm feasibility and pricing.'
    });

    return items;
  }, [product, phone, whatsappNumber]);

  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(f => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer
      }
    }))
  }), [faqs]);

  const productJsonLd = useMemo(() => {
    if (!product || !product.name) return null;
    const images = [];
    if (product.featured_image?.url) images.push(product.featured_image.url);
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach(img => img.url && images.push(img.url));
    }

    const prices = (product.weight_options || []).map(w => parseFloat(w.price || 0)).filter(p => !Number.isNaN(p));
    const price = prices.length ? Math.min(...prices) : (product.price || null);

    const offers = price ? {
      "@type": "Offer",
      price: String(price),
      priceCurrency: "INR",
      url: `https://www.serlesbake.in/cakes/${product.category?.slug || ''}/${product.slug || ''}`
    } : undefined;

    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      image: images,
      description: product.short_description || product.description || '',
      sku: product.sku || undefined,
      brand: product.brand?.name || "Serle's Bake",
      offers
    };
  }, [product]);

  const breadcrumbJsonLd = useMemo(() => {
    const base = 'https://www.serlesbake.in';
    const items = [];
    items.push({ position: 1, name: 'Home', item: base });
    items.push({ position: 2, name: 'Cakes', item: `${base}/cakes` });
    if (product?.category?.name && product?.category?.slug) {
      items.push({ position: 3, name: product.category.name, item: `${base}/cakes/${product.category.slug}` });
    }
    if (product?.name && product?.slug && product?.category?.slug) {
      items.push({ position: items.length + 1, name: product.name, item: `${base}/cakes/${product.category.slug}/${product.slug}` });
    }

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map(i => ({
        "@type": "ListItem",
        position: i.position,
        name: i.name,
        item: i.item
      }))
    };
  }, [product]);

  const combinedJsonLd = [jsonLd];
  if (productJsonLd) combinedJsonLd.push(productJsonLd);
  if (breadcrumbJsonLd) combinedJsonLd.push(breadcrumbJsonLd);

  return (
    <div className="product-faq mt-5">
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedJsonLd) }}
        />
      </Head>

      <h4 style={{ color: '#333', fontWeight: 700, marginBottom: 16 }}>Frequently Asked Questions</h4>

      <style jsx>{`
        .accordion-item {
          border: 2px solid #f0f0f0;
          border-radius: 12px;
          margin-bottom: 15px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .accordion-header {
          border: none;
          padding: 14px 18px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 700;
          color: #333;
          background: #ffffff;
          width: 100%;
        }

        .accordion-header.active {
          background: linear-gradient(135deg, #ff91a4, #ffb3c1);
          color: white;
        }

        .accordion-icon {
          transition: transform 0.3s ease;
          font-size: 18px;
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
          padding: 16px 18px;
          border-top: 1px solid #f0f0f0;
        }

        .accordion-body {
          line-height: 1.8;
          color: #555;
        }
      `}</style>

      {faqs.map((f, idx) => (
        <div key={idx} className={`accordion-item`} style={{ marginBottom: 12 }}>
          <button
            className={`accordion-header ${openIndex === idx ? 'active' : ''}`}
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            style={{ width: '100%', textAlign: 'left' }}
          >
            <span>{f.question}</span>
            <i className={`fa fa-chevron-down accordion-icon ${openIndex === idx ? 'active' : ''}`} />
          </button>
          <div className={`accordion-content ${openIndex === idx ? 'active' : ''}`}>
            <div className="accordion-body">
              {f.type === 'whatsapp' ? (
                <>
                  <p>{f.answer}</p>
                  <a
                    href={f.waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-success"
                    style={{ marginTop: 8, color: 'white' }}
                  >
                    <i className="fab fa-whatsapp me-2"></i>
                    WhatsApp Us
                  </a>
                </>
              ) : f.type === 'call' ? (
                <>
                  <p>{f.answer}</p>
                  <a
                    href={f.phoneLink}
                    className="btn btn-outline-primary"
                    style={{ marginTop: 8 }}
                  >
                    <i className="fa fa-phone me-2"></i>
                    Call Us
                  </a>
                </>
              ) : (
                <p>{f.answer}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
