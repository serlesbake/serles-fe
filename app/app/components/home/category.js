import Link from 'next/link';
import Image from 'next/image';
import { getCategoriesUrl } from '../../config/api';
import './productgrid.scss';

async function fetchCategories() {
  const res = await fetch(getCategoriesUrl());
  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }
  const categoriesData = await res.json();
  return categoriesData;
}

export default async function Category() {
  const categoriesData = await fetchCategories();
  return (
    <section className="container text-center pt-5">
      {/* The homepage's <h1>. It used to be the logo in the shared header, which
          made every page on the site claim "Serles Bake" as its main heading; with
          that unwrapped, this — the first heading on the page — becomes the real
          one. Wording matches the page title's primary keyword rather than the
          generic "Home Made Cakes". The `h2` class is kept, so nothing moves
          visually. This component is homepage-only. */}
      <h1 className='h2'>Homemade Cakes in Tenkasi</h1>
      <p className='p'>From Our Oven to Your Heart</p>
      <div className="product_grid">
        {categoriesData.map((category) => (
          <div className="product_grid_item" key={category.id}>
            <Link href={`/cakes/${category.slug}`} className='text-decoration-none'>
              <Image src={category.image || '/img/shop/product-1.jpg'} alt={category.name} width={100} height={100} />
              <h6 className='h6'>{category.name}</h6>
            </Link>
          </div>
        ))}
      </div>

    </section>
  );
}