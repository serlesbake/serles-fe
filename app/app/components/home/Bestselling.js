'use client';

import React from 'react';
import './productgrid.scss';

import Image from 'next/image';
import Link from 'next/link';
import styles from './Bestselling.module.css';
import { logImageError, getFallbackImage } from '../../utils/imageUtils';

/**
 * Presentational only. BestsellingWrapper is a server component that fetches and
 * passes `initialProducts` in, so the products are in the server HTML.
 *
 * This used to keep its own copy of the fetch behind a useEffect - carrying the
 * same `data.results` bug as the wrapper against an API that returns a bare array,
 * so the fallback path could never have produced products either. It stays a
 * client component only for the image onError handler.
 */
export default function Bestselling({ initialProducts = [] }) {
  const products = initialProducts;
  


  // If no products, show a message
  if (!products || products.length === 0) {
    return (
      <section className="product spad">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h1 text-left">Bestselling Cakes</h2>
            <Link href={`/cakes`} className="btn bg-primary-light">View All</Link>
          </div>
          <div className="row">
            <div className="col-12">
              <p className={styles.loadingMessage}>No bestselling products available at the moment.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  function ProductCard({ product }) {
    const handleImageError = (e) => {
      logImageError(product.featured_image?.url, 'Bestselling', new Error('Product image failed to load'));
      e.target.src = getFallbackImage('product');
    };

    return (
      <div className="col-lg-3 col-6" key={product.id}>
        <Link href={product.category?.slug && product.slug 
          ? `/cakes/${product.category.slug}/${product.slug}`
          : '/cakes'
        }>  
          <div className={`product__item ${styles.productItem}`}>
            <div className="product__item__pic set-bg border-r">
              <Image
                src={product.featured_image?.url || getFallbackImage('product')}
                alt={product.name || 'Cake'}
                width={300}
                height={300}
                className={styles.productImage}
                onError={handleImageError}
                priority={true}
              />
              <div className={`product__label ${styles.productLabel}`}>
                <span>{product.category?.name || 'Cake'}</span>
              </div>
            </div>
            <div className="product__item__text">
              <p className='p '>
                <span className='p text-decoration-none text-black'>
                  {product.name}
                </span>
              </p>
              <p className="product__item__price">{product.price_range}</p>
              <div className="cart_add">
                <p>View Details</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <section className="product spad">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h1 text-left">Bestselling Cakes</h2>
          <Link href={`/cakes?is_best_seller=true`} className="btn bg-primary-light">View All</Link>
        </div>
        <div className="row">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
