'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaMotorcycle, FaWhatsapp, FaArrowRight } from 'react-icons/fa';
import { API_CONFIG } from '../../config/api';

const staticBanners = [
  {
    id: 1,
    variant: 'delivery',
    title: 'Home Delivery \u20b950',
    description: 'Order cake delivery from our Ilanji bakery. \u20b950 for the first 5 km, then \u20b910 per additional km. Up to 20 km by road, subject to address and availability checks.',
    href: 'https://wa.me/916383070725?text=Hi%21%20I%20would%20like%20to%20check%20cake%20delivery%20from%20Ilanji.',
  },
  {
    id: 2,
    title: 'Cake customization',
    description: "Ask Serle's Bake about your cake design and customization.",
    image: `${API_CONFIG.BASE_URL}/api/media/banners/freecustomization.png`,
    href: 'https://wa.me/916383070725',
  },
];

export default function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const interval = setInterval(() => setCurrentSlide(previous => (previous + 1) % staticBanners.length), 7000);
    return () => clearInterval(interval);
  }, [paused]);

  return (
    <section className="container pt-0" data-contact-source="home_banner" aria-label="Bakery offers and delivery">
      <div className="banner-container"
        onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}>
        <div className="banner-slider">
          {staticBanners.map((banner, index) => (
            <a href={banner.href} target="_blank" rel="noopener noreferrer" key={banner.id}
              className={`banner-slide ${banner.variant ? `banner-${banner.variant}` : ''} ${index === currentSlide ? 'active' : ''}`}
              style={banner.image ? { backgroundImage: `url(${banner.image})`, backgroundSize: 'contain', backgroundColor: '#ff91a4' } : undefined}
              aria-label={banner.description}>
              {banner.variant === 'delivery' && (
                <div className="delivery-inner">
                  <div className="delivery-copy">
                    <p className="delivery-kicker"><FaMotorcycle aria-hidden="true" /> Home delivery</p>
                    <p className="delivery-head">A little joy,<br />delivered.</p>
                    <p className="delivery-origin">From Ilanji, with love.</p>
                    <div className="delivery-price-row">
                      <span className="delivery-price"><span className="delivery-currency">&#8377;</span>50</span>
                      <span className="delivery-within">delivery for the<br /><strong>first 5 km</strong></span>
                    </div>
                    <p className="delivery-extra">Then &#8377;10 per additional km</p>
                  </div>
                  <div className="delivery-art" aria-hidden="true">
                    <span className="delivery-spark">&#10022;</span>
                    <div className="delivery-photo">
                      <Image
                        src="https://cdn.serlesbake.in/products/premium-cake/white-forest/20250811_230051.jpg"
                        alt=""
                        title="White Forest cake from Serle's Bake"
                        width={360} height={440}
                        sizes="(max-width: 767px) 130px, 180px"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <span className="delivery-seal">baked<br /><strong>with love</strong></span>
                  </div>
                  <div className="delivery-bottom">
                    <span className="delivery-cta"><FaWhatsapp aria-hidden="true" /> Order on WhatsApp <FaArrowRight className="delivery-arrow" aria-hidden="true" /></span>
                    <p className="delivery-note">Up to 20 km by road &middot; address &amp; availability confirmed on WhatsApp</p>
                  </div>
                </div>
              )}
            </a>
          ))}
        </div>
        <div className="banner-dots" aria-label="Choose a banner">
          {staticBanners.map((banner, index) => (
            <button key={banner.id} type="button" className={`banner-dot ${index === currentSlide ? 'active' : ''}`}
              aria-label={`Show ${banner.title}`} aria-pressed={index === currentSlide}
              onClick={() => setCurrentSlide(index)} />
          ))}
        </div>
      </div>
      <style jsx>{`
        .banner-container { position: relative; padding: 14px; border: 1px solid #f2e5df; border-radius: 22px; background: #fffdfb; box-shadow: 0 10px 32px rgba(74, 25, 39, .07); }
        .banner-slider { position: relative; height: 354px; overflow: hidden; border-radius: 15px; }
        .banner-slide { position: absolute; inset: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-size: cover; background-position: center; background-repeat: no-repeat; text-decoration: none; opacity: 0; visibility: hidden; pointer-events: none; transition: opacity .35s ease; }
        .banner-slide.active { opacity: 1; visibility: visible; pointer-events: auto; }
        .banner-slide:focus-visible { outline: 3px solid #e4a84c; outline-offset: -5px; }
        .banner-delivery { --art-width: clamp(98px, 12vw, 180px); overflow: hidden; background: #671d32; }
        .banner-delivery::before { content: ''; position: absolute; width: 320px; height: 320px; border-radius: 50%; right: -120px; top: -110px; background: #812b42; }
        .banner-delivery::after { content: ''; position: absolute; width: 260px; height: 260px; border: 1px solid rgba(255, 222, 196, .15); border-radius: 50%; right: -120px; bottom: -140px; }
        .delivery-inner { position: relative; z-index: 1; display: flex; flex-direction: column; width: 100%; height: 100%; padding: 23px; text-align: left; }
        .delivery-copy { width: calc(100% - var(--art-width) - 12px); }
        .delivery-kicker { display: flex; align-items: center; gap: 8px; margin: 0 0 13px; color: #f1c5b2; font-size: 10px; font-weight: 700; letter-spacing: .15em; line-height: 1.4; text-transform: uppercase; }
        .delivery-kicker :global(svg) { flex-shrink: 0; font-size: 19px; }
        .delivery-head { margin: 0; color: #fff7ed; font-family: Georgia, 'Times New Roman', serif; font-size: clamp(29px, 3vw, 37px); font-weight: 700; line-height: 1.08; letter-spacing: -.035em; }
        .delivery-origin { margin: 10px 0 7px; color: #eed8cd; font-size: 12px; line-height: 1.5; }
        .delivery-price-row { display: flex; align-items: center; gap: 12px; }
        .delivery-price { display: inline-flex; align-items: flex-start; gap: 2px; color: #fff8ed; font-size: 57px; font-weight: 800; line-height: 1.05; letter-spacing: -.06em; }
        .delivery-currency { padding-top: 5px; font-size: 27px; line-height: 1.2; letter-spacing: 0; }
        .delivery-within { padding-top: 2px; color: #f1ded5; font-size: 12px; line-height: 1.45; }
        .delivery-within strong { color: #fff8ed; font-weight: 700; }
        .delivery-extra { margin: 7px 0 0; color: #f1ded5; font-size: 11px; line-height: 1.5; }
        .delivery-art { position: absolute; top: 78px; right: 22px; width: var(--art-width); }
        .delivery-photo { position: relative; width: 100%; aspect-ratio: 4 / 5; overflow: hidden; border: 5px solid #fae8db; border-radius: 100px 100px 22px 22px; background: #fae8db; transform: rotate(5deg); box-shadow: 0 12px 25px rgba(36, 9, 19, .22); }
        .delivery-spark { position: absolute; top: -29px; right: 4px; color: #f4c6a7; font-size: 32px; line-height: 1; }
        .delivery-seal { position: absolute; bottom: -9px; left: -17px; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 61px; height: 61px; border: 3px solid #671d32; border-radius: 50%; background: #f7cdb4; color: #671d32; font-family: Georgia, serif; font-size: 11px; line-height: 1.2; transform: rotate(-10deg); }
        .delivery-seal strong { font-size: 11px; font-style: italic; }
        .delivery-bottom { position: relative; z-index: 2; margin-top: auto; padding-top: 16px; }
        .delivery-cta { display: inline-flex; align-items: center; gap: 8px; padding: 11px 15px; border-radius: 8px; background: #fff7eb; color: #671d32; font-size: 12px; font-weight: 700; line-height: 1.3; box-shadow: 0 4px 0 rgba(30, 7, 14, .12); transition: transform .2s ease, background .2s ease; }
        .delivery-cta :global(svg) { flex-shrink: 0; font-size: 18px; }
        .delivery-cta :global(.delivery-arrow) { margin-left: 3px; font-size: 11px; }
        .banner-delivery:hover .delivery-cta { background: #ffe4cb; transform: translateY(-2px); }
        .delivery-note { margin: 12px 0 0; color: #ead3cb; font-size: 10px; line-height: 1.5; }
        .banner-dots { display: flex; justify-content: center; gap: 4px; padding-top: 9px; }
        .banner-dot { display: grid; place-items: center; width: 30px; height: 24px; border: 0; border-radius: 6px; padding: 0; background: transparent; cursor: pointer; }
        .banner-dot::after { content: ''; width: 7px; height: 7px; border-radius: 20px; background: #dac4c5; transition: width .2s ease; }
        .banner-dot.active::after { width: 23px; background: #8f2d47; }
        .banner-dot:focus-visible { outline: 2px solid #8f2d47; }
        @media (min-width: 768px) {
          .banner-slider { display: flex; gap: 16px; height: 354px; border-radius: 0; }
          .banner-slide { position: relative; inset: auto; flex: 1; min-width: 0; opacity: 1; visibility: visible; pointer-events: auto; border-radius: 14px; }
          .banner-dots { display: none; }
        }
        @media (min-width: 768px) and (max-width: 991px) {
          .delivery-inner { padding: 19px; }
          .delivery-head { font-size: 29px; }
          .delivery-price { font-size: 49px; }
          .delivery-art { right: 16px; top: 103px; }
          .delivery-copy { width: calc(100% - 91px); }
          .delivery-price-row { gap: 8px; }
          .delivery-within { font-size: 10px; }
          .delivery-kicker { letter-spacing: .1em; }
        }
        @media (max-width: 767px) {
          .banner-delivery { --art-width: clamp(96px, 28vw, 122px); }
          .delivery-inner { padding: 20px; }
          .delivery-head { font-size: clamp(27px, 8vw, 32px); }
          .delivery-art { top: 95px; right: 16px; }
        }
        @media (max-width: 359px) {
          .banner-container { padding: 9px; }
          .banner-delivery { --art-width: 92px; }
          .delivery-inner { padding: 18px; }
          .delivery-head { font-size: 27px; }
          .delivery-copy { width: calc(100% - 99px); }
          .delivery-origin { font-size: 11px; }
          .delivery-price { font-size: 49px; }
          .delivery-price-row { gap: 7px; }
          .delivery-within { font-size: 10px; }
          .delivery-art { top: 105px; right: 16px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .banner-slide, .delivery-cta, .banner-dot::after { transition: none; }
        }
      `}</style>
    </section>
  );
}
