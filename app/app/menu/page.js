import AllProductsMenu from "@/app/components/AllProductsMenu";
import Breadcrumb from "@/app/components/Breadcrumb";
import Cta from "@/app/components/home/cta";
import { getProductsUrl, getCategoriesUrl, getProductDetailUrl } from "@/app/config/api";
import apiCache from "@/app/utils/cache";
import { fetchCatalogJson, catalogList } from "@/app/utils/catalog";
import JsonLd from "@/app/components/blog/JsonLd";

const SITE = 'https://www.serlesbake.in';

export const revalidate = 60;

async function getMenuData() {
  try {
    const [productsPayload, categoriesPayload] = await Promise.all([
      fetchCatalogJson(getProductsUrl(1, 100)),
      fetchCatalogJson(getCategoriesUrl()),
    ]);
    const products = catalogList(productsPayload);
    const categories = catalogList(categoriesPayload);
    const details = await Promise.all(products.map(async (product) => {
      try {
        return await apiCache.fetchWithCache(getProductDetailUrl(product.id));
      } catch {
        return product;
      }
    }));
    return { products: details, categories, catalogLoaded: true };
  } catch (error) {
    console.error("Unable to server-render menu catalog:", error);
    return { products: [], categories: [], catalogLoaded: false };
  }
}

export const metadata = {
  title: "Cake Menu & Prices | Homemade Cakes in Tenkasi",
  description: "Check out Serle’s Bake menu – birthday cakes, brownies, photo cakes, blackforest, red velvet & more. Fresh homemade cakes with doorstep delivery in Tenkasi.",
  keywords: "cake menu tenkasi, cake prices, custom cake cost, birthday cake pricing, wedding cake menu, homemade cakes tenkasi",
  openGraph: {
    title: "Cake Menu & Prices | Homemade Cakes in Tenkasi",
    description: "Check out Serle’s Bake menu – birthday cakes, brownies, photo cakes, blackforest, red velvet & more. Fresh homemade cakes with doorstep delivery in Tenkasi.",
    url: "https://www.serlesbake.in/menu",
    siteName: "Serle’s Bake",
    type: "website",
    images: [
      {
        url: "/img/logo.png",
        width: 1200,
        height: 630,
        alt: "Serle’s Bake Logo",
      },
    ],
    locale: "en_US",
    siteName: "Serle’s Bake",
    type: "website",
    twitter: {
      card: "summary_large_image",
      title: "Cake Menu & Prices | Homemade Cakes in Tenkasi",
      description: "Check out Serle’s Bake menu – birthday cakes, brownies, photo cakes, blackforest, red velvet & more. Fresh homemade cakes with doorstep delivery in Tenkasi.",
      images: ["/img/logo.png"],
    },
  },
  alternates: {
    canonical: "/menu",
  },  
};

export default async function MenuPage() {
  const { products, categories, catalogLoaded } = await getMenuData();
  const menuSchema = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${SITE}/menu#collection`,
      url: `${SITE}/menu`,
      name: 'Cake Menu & Prices',
      isPartOf: { '@id': `${SITE}/#website` },
      provider: { '@id': `${SITE}/#business` },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: products.length,
        itemListElement: products.map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: product.name,
          url: `${SITE}/cakes/${product.category?.slug}/${product.slug}`,
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
        { '@type': 'ListItem', position: 2, name: 'Menu & Pricing', item: `${SITE}/menu` },
      ],
    },
  ];
  return (
    <>
      <JsonLd data={menuSchema} />
      <Breadcrumb title="Menu & Pricing" />
      <AllProductsMenu initialProducts={products} initialCategories={categories} initialCatalogLoaded={catalogLoaded} />
      <Cta />
    </>
  );
}
