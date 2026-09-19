import { getProductsUrl } from '../../config/api';
import Bestselling from './Bestselling';

async function fetchBestselling() {
  try {
    const res = await fetch(getProductsUrl(), {
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      }
    });
    
    if (!res.ok) {
      console.error('Failed to fetch bestselling products:', res.status, res.statusText);
      return [];
    }
    
    const data = await res.json();

    // The catalog API returns a BARE ARRAY for /api/products/, not a paginated
    // { results: [...] } envelope. This read `data.results?.filter(...) || []`,
    // which was always undefined and so always fell through to [] - the homepage
    // has been rendering "No bestselling products available at the moment."
    // while five products were flagged is_best_seller. Accept either shape.
    const products = Array.isArray(data?.results)
      ? data.results
      : Array.isArray(data)
        ? data
        : [];

    return products.filter((product) => product.is_best_seller);
  } catch (error) {
    console.error('Error fetching bestselling products:', error);
    return [];
  }
}

export default async function BestsellingWrapper() {
  // Fetch initial data on the server
  const initialProducts = await fetchBestselling();
  
  return <Bestselling initialProducts={initialProducts} />;
} 