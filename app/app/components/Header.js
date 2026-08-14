'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FaEnvelope, FaPhone } from 'react-icons/fa';
import Wabtn from './ui/wabtn';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Offcanvas Menu Begin */}
      <div className={`offcanvas-menu-overlay ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}></div>
      <div className={`offcanvas-menu-wrapper ${isMenuOpen ? 'active' : ''}`}>
        {/* Close Button */}
        <div className="offcanvas__close" onClick={() => setIsMenuOpen(false)}>
          <i className="fa fa-times"></i>
        </div>
        
        {/* Logo Section */}
        <div className='d-flex align-items-center justify-content-start gap-3 p-3'>
          <Image src="/img/serlesbakelogo.webp" alt="Logo" width={60} height={60} />
          <p className='text-black h6 mb-0'>Serles Bake</p>
        </div>
        
        {/* Mobile Navigation Menu */}
        <div >
          <nav className="mobile-menu">
            <ul>
              <li><Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
              <li><Link href="/about" onClick={() => setIsMenuOpen(false)}>About</Link></li>
              <li><Link href="/cakes" onClick={() => setIsMenuOpen(false)}>Shop</Link></li>
              <li><Link href="/menu" onClick={() => setIsMenuOpen(false)}>Menu & Pricing</Link></li>
              <li><Link href="/blog" onClick={() => setIsMenuOpen(false)}>Blog</Link></li>
              <li><Link href="/testimonial" onClick={() => setIsMenuOpen(false)}>Testimonials</Link></li>
              <li><Link href="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
            </ul>
          </nav>
        </div>
        
        {/* Contact Info in Mobile Menu */}
        <div className="offcanvas__contact-info p-3">
          <div className="d-flex flex-column gap-3">
            <Link href="mailto:serlesbake@gmail.com" className="text-decoration-none d-flex align-items-center gap-2">
              <FaEnvelope size={20} className="text-primary" />
              <span className="text-dark">serlesbake@gmail.com</span>
            </Link>
            <Link href="tel:+916383070725" className="text-decoration-none d-flex align-items-center gap-2">
              <FaPhone size={20} className="text-primary" />
              <span className="text-dark">+91 63830 70725</span>
            </Link>
          </div>
        </div>
      </div>
      {/* Offcanvas Menu End */}

      {/* Header Section Begin */}
      <header className="header">
        <div className="header__top">
          <div className="container p-0">
            <div className="row p-0">
              <div className="col-lg-12 m-0 p-0">
                <div className="header-new ">
                  <div className="inner-header d-flex align-items-center justify-content-between gap-3">
                  <Link href="mailto:serlesbake@gmail.com" className="text-primary-light text-decoration-none d-none d-lg-block">
                    <i className="bi bi-envelope text-primary-light d-inline-flex align-items-center justify-content-center gap-3 h-100 ">
                      <FaEnvelope size={36} /> <p className='d-flex flex-column mb-0 h6 '>Email Us <span className="text-color">serlesbake@gmail.com</span></p>
                    </i>
                  </Link>
                  <Link href="/" className='text-decoration-none d-flex align-items-center gap-3 justify-content-center col-lg-6 logo-new'>
                      <Image src="/img/serlesbakelogo.webp" alt="Logo" width={70} height={70} />
                      <h1 className='h1 text-white fw -bold '>Serles Bake</h1>
                    </Link>
                  <Link href="tel:+916383070725" className="text-primary-light text-decoration-none d-none d-lg-block">
                    <i className="bi bi-telephone text-primary-light d-inline-flex align-items-center justify-content-center gap-3 h-100 ">
                      <FaPhone  size={36}  style={{transform: 'rotate(90deg)'}}/> <p className='d-flex flex-column mb-0 h6 '>Call Us <span className="text-color">+91 63830 70725</span></p>
                    </i>
                  </Link>
                  </div>
                </div>
                
              </div>
            </div>
            <div className="canvas__open" onClick={() => setIsMenuOpen(true)}>
              <i className="fa fa-bars"></i>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <nav className="header__menu mobile-menu">
                <ul>
                  <li><Link href="/">Home</Link></li>
                  <li><Link href="/about">About</Link></li>
                  {/* <li className="active"><Link href="/cakes">Shop</Link></li> */}
                  <li><Link href="/cakes">Shop</Link>
                    {/* <ul className="dropdown">
                      <li><Link href="/shop-details">Shop Details</Link></li>
                      <li><Link href="/shopping-cart">Shopping Cart</Link></li>
                      <li><Link href="/checkout">Check Out</Link></li>
                      <li><Link href="/wishlist">Wishlist</Link></li>
                      <li><Link href="/class">Class</Link></li>
                      <li><Link href="/blog-details">Blog Details</Link></li>
                    </ul> */}
                  </li>
                  <li><Link href="/menu">Menu&Pricing</Link></li>
                  <li><Link href="/blog">Blog</Link></li>
                  <li><Link href="/testimonial">Testimonials</Link></li>

                  <li><Link href="/contact">Contact</Link></li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </header>
      <Wabtn />
      {/* Header Section End */}
    </>
  );
} 