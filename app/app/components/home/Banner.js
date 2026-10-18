'use client';
import { useState, useEffect } from "react";

import { API_CONFIG } from '../../config/api';

// Goes through config/api.js rather than reading the env var directly. Reading it
// here bypassed liveApiBase(), so the live homepage was still loading banner
// images from serlesbackend.vercel.app - the stale deployment.
const API_BASE_URL = API_CONFIG.BASE_URL;

// Banner slides.
//
// A slide is either `image` (artwork with the text baked in) or `variant`
// (rendered in markup here). The delivery slide is markup so the offer can be
// changed in code without commissioning new artwork - useful for anything with a
// price or a date in it.
//
// The slide this replaced was an Independence Day promotion dated Aug 14-15. It
// was still the first thing visitors saw in mid-October. Anything date-bound
// needs an owner to retire it, or it quietly goes stale.
const staticBanners = [
  {
    "id": 1,
    "variant": "delivery",
    "title": "Home Delivery ₹50",
    "description": "Home delivery ₹50 for the first 5 km, then ₹10 per extra kilometre.",
    "is_active": true,
    "order": 0
  },
  {
    "id": 2,
    "title": "Free Customization",
    "description": "Get your dream cake with free customization! Design your perfect cake with our expert bakers.",
    "image": `${API_BASE_URL}/api/media/banners/freecustomization.png`,
    "is_active": true,
    "order": 1
  },

];

export default function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides
  useEffect(() => {
    if (staticBanners.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % staticBanners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="container pt-0">
      <div className="banner-container">
        <div className="banner-slider">
          {staticBanners.map((banner, index) => (
            <a href="https://wa.me/916383070725" target="_blank" rel="noopener noreferrer"
              key={banner.id}
              className={`banner-slide ${banner.variant ? `banner-${banner.variant}` : ''} ${index === currentSlide ? 'active' : ''}`}
              style={banner.image ? { backgroundImage: `url(${banner.image})` } : undefined}
              aria-label={banner.description}
            >
              {banner.variant === 'delivery' && (
                <div className="delivery-inner">
                  <p className="delivery-kicker">Now Available</p>
                  <p className="delivery-head">Home Delivery</p>
                  <p className="delivery-price">
                    &#8377;50
                    <span className="delivery-within">first 5 km</span>
                  </p>
                  <p className="delivery-extra">then &#8377;10 per extra km</p>
                  <span className="delivery-cta">Order on WhatsApp</span>
                </div>
              )}
            </a>
          ))}
        </div>
        
        {staticBanners.length > 1 && (
          <div className="banner-dots">
            {staticBanners.map((_, index) => (
              <button
                key={index}
                className={`banner-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .banner-container {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          position: relative;
        }

        .banner-slider {
          position: relative;
          height: 250px;
          overflow: hidden;
        }

        .banner-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          opacity: 0;
          transition: opacity 0.5s ease-in-out;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }


        /* Delivery slide: rendered rather than an image, so the price and radius
           can be edited in code. Sized to sit beside the artwork banner. */
        .banner-delivery {
          background: linear-gradient(135deg, #b61123 0%, #e4718a 55%, #f3a6b6 100%);
          color: #fff;
          text-align: center;
          padding: 16px;
        }

        .delivery-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          line-height: 1.1;
        }

        .delivery-kicker {
          margin: 0;
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          opacity: 0.9;
        }

        .delivery-head {
          margin: 0;
          font-size: clamp(1.5rem, 6vw, 2.4rem);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .delivery-price {
          margin: 4px 0 0;
          font-size: clamp(2.2rem, 10vw, 3.4rem);
          font-weight: 800;
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .delivery-within {
          font-size: clamp(0.8rem, 3vw, 1rem);
          font-weight: 600;
          opacity: 0.95;
        }

        .delivery-extra {
          margin: 2px 0 0;
          font-size: clamp(0.75rem, 3vw, 0.95rem);
          font-weight: 600;
          opacity: 0.95;
        }

        .delivery-cta {
          margin-top: 10px;
          background: #fff;
          color: #b61123;
          font-weight: 700;
          font-size: 0.85rem;
          padding: 8px 18px;
          border-radius: 999px;
        }

        .delivery-note {
          margin: 8px 0 0;
          font-size: 0.7rem;
          opacity: 0.9;
        }

        .banner-slide.active {
          opacity: 1;
        }

        .banner-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          padding: 15px;
          background: rgba(255, 255, 255, 0.9);
        }

        .banner-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: none;
          background: rgba(0, 0, 0, 0.3);
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .banner-dot.active {
          background: #e4718a;
        }

        /* Desktop: Show 2 banners side by side */
        @media (min-width: 768px) {
          .banner-slider {
            height: 300px;
            display: flex;
            gap: 20px;
            padding: 20px;
          }

          .banner-slide {
            position: relative;
            opacity: 1;
            flex: 1;
            border-radius: 8px;
          }

          .banner-dots {
            display: none;
          }
        }

        /* Mobile: Show 1 banner at a time */
        @media (max-width: 767px) {
          .banner-slider {
            height: 200px;
          }
        }
      `}</style>
    </section>
  );
}
