import Link from 'next/link';
import styles from './page.module.css';
import Banner from './components/home/Banner';
import Category from './components/home/category';
import BestsellingWrapper from './components/home/BestsellingWrapper';
import About from './components/home/About';
import MilestoneBar from './components/home/milestone';
import Menu from './components/home/Menu';
import Team from './components/home/Team';
import Social from './components/home/Social';
import FeaturedCakeCTA from './components/home/cta';
import { getProductsUrl, getCategoriesUrl, getProductDetailUrl } from './config/api';
import apiCache from './utils/cache';
import { fetchCatalogJson, catalogList } from './utils/catalog';

export const revalidate = 60;

async function getHomeMenuData() {
  try {
    const [productsPayload, categoriesPayload] = await Promise.all([
      fetchCatalogJson(getProductsUrl()),
      fetchCatalogJson(getCategoriesUrl()),
    ]);
    const products = catalogList(productsPayload);
    const categories = catalogList(categoriesPayload);
    const detailed = await Promise.all(products.map(async (product) => {
      try { return await apiCache.fetchWithCache(getProductDetailUrl(product.id)); }
      catch { return product; }
    }));
    return { products: detailed, categories, catalogLoaded: true };
  } catch (error) {
    console.error('Unable to server-render homepage menu:', error);
    return { products: [], categories: [], catalogLoaded: false };
  }
}
export const metadata = {
  // Title covers BOTH proven search clusters, because they are the same customers.
  //
  // Business Profile data (Mar-Oct 2026): "cake shop near me" 71, "bakery near me"
  // 48, "bakery" 35, plus two more bakery variants. The owner confirms that locally
  // "bakery" IS the word for where you buy a cake - there are no separate cake
  // shops here - so the bakery cluster is cake-buying intent, not mismatched
  // traffic. An earlier version of this title dropped "bakery" on the assumption
  // that it brought bread-and-buns searchers. That assumption was wrong.
  //
  // 44 chars.
  title: "Cake Shop & Bakery in Tenkasi | Serle’s Bake",
  description: "Looking for a bakery or cake shop near me? Serle’s Bake bakes fresh homemade cakes to order in Tenkasi - birthdays, custom designs, eggless on request.",
  keywords: "bakery near me, cake shop near me, bakery Tenkasi, cake shop Tenkasi, bakery shop near me, homemade cakes, birthday cakes, eggless cakes Tenkasi",
};
  export default async function Home() {
  const { products, categories, catalogLoaded } = await getHomeMenuData();
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Category />
        <Banner />
        <About />
        <MilestoneBar />
        <Menu initialProducts={products} initialCategories={categories} initialCatalogLoaded={catalogLoaded} />
        <BestsellingWrapper /> 
        <Team />
        <FeaturedCakeCTA />
        <Social />
      </main>
    </div>
  );
}
