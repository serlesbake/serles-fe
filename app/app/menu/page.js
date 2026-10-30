import AllProductsMenu from "@/app/components/AllProductsMenu";
import Breadcrumb from "@/app/components/Breadcrumb";
import Cta from "@/app/components/home/cta";
import { getProductsUrl, getCategoriesUrl, getProductDetailUrl } from "@/app/config/api";
import apiCache from "@/app/utils/cache";

export const revalidate = 60;

const asList = (payload) =>
  Array.isArray(payload?.results) ? payload.results : Array.isArray(payload) ? payload : [];

async function getMenuData() {
  try {
    const [productsPayload, categoriesPayload] = await Promise.all([
      apiCache.fetchWithCache(getProductsUrl(1, 100)),
      apiCache.fetchWithCache(getCategoriesUrl()),
    ]);
    const products = asList(productsPayload);
    const categories = asList(categoriesPayload);
    const details = await Promise.all(products.map(async (product) => {
      try {
        return await apiCache.fetchWithCache(getProductDetailUrl(product.id));
      } catch {
        return product;
      }
    }));
    return { products: details, categories };
  } catch (error) {
    console.error("Unable to server-render menu catalog:", error);
    return { products: [], categories: [] };
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
  const { products, categories } = await getMenuData();
  return (
    <>
      <Breadcrumb title="Menu & Pricing" />
      <AllProductsMenu initialProducts={products} initialCategories={categories} />
      <Cta />
    </>
  );
}
