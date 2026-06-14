'use client';
import { useState, useEffect } from "react";

// Static banner data
const staticBanners = [
  {
    "id": 1,
    "title": "Independence Theme Cake",
    "description": "Soft sponge layers in saffron, white, and green with creamy frosting — perfect for Independence Day celebrations.",
    "image": "https://shop.serlesbake.in/api/media/banners/Independencedaycompressed.png",
    "is_active": true,
    "order": 0
  },
  {
    "id": 2,
    "title": "Free Customization",
    "description": "Get your dream cake with free customization! Design your perfect cake with our expert bakers.",
    "image": "https://shop.serlesbake.in/api/media/banners/freecustomization.png",
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
              className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
              style={{
                backgroundImage: `url(${banner.image})`,
              }}
            >
              
           
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
