import Link from "next/link";
import Breadcrumb from "../components/Breadcrumb";
import { getProductsUrl, getCategoriesUrl } from "../config/api";
import { fetchCatalogJson, catalogList } from "../utils/catalog";

export const revalidate = 3600;

const staticPages = [
  ["Home", "/"], ["Cakes", "/cakes"], ["Menu & Pricing", "/menu"],
  ["About", "/about"], ["Contact", "/contact"], ["Testimonials", "/testimonial"],
  ["Blog", "/blog"], ["Privacy Policy", "/privacy-policy"],
  ["Terms & Conditions", "/terms-conditions"],
];
async function getCatalogLinks() {
  try {
    const [productsPayload, categoriesPayload] = await Promise.all([
      fetchCatalogJson(getProductsUrl()),
      fetchCatalogJson(getCategoriesUrl()),
    ]);
    const products = catalogList(productsPayload);
    const categories = catalogList(categoriesPayload);
    return { products, categories };
  } catch (error) {
    console.error("Unable to load sitemap catalog:", error);
    return { products: [], categories: [] };
  }
}

function LinkList({ title, items }) {
  return (
    <section className="col-md-6 mb-4">
      <div style={{ background: "#f8f9fa", borderRadius: 15, padding: 25, height: "100%" }}>
        <h2 style={{ color: "#e4718a", marginBottom: 18, fontSize: "1.4rem" }}>{title}</h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {items.map(([label, href]) => (
            <li key={href} style={{ marginBottom: 10 }}>
              <Link href={href} style={{ color: "#333", textDecoration: "none" }}>• {label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default async function SiteMapPage() {
  const { products, categories } = await getCatalogLinks();
  const categoryLinks = categories
    .filter((category) => category.slug)
    .map((category) => [category.name, `/cakes/${category.slug}`]);
  const productLinks = products
    .filter((product) => product.slug && product.category?.slug)
    .map((product) => [product.name, `/cakes/${product.category.slug}/${product.slug}`]);
  const content = [
    <Breadcrumb key="breadcrumb" title="Site Map" />,
    <main key="content" style={{ background: "linear-gradient(135deg, #fef7f8 0%, #fff5f6 100%)", padding: "60px 0", minHeight: "70vh" }}>
      <div className="container">
        <h1 className="text-center mb-3" style={{ color: "#e4718a", fontWeight: 700 }}>Site Map</h1>
        <p className="text-center text-muted mb-5">Browse the pages, cake categories and products available at Serle&apos;s Bake.</p>
        <div className="row">
          <LinkList title="Main Pages" items={staticPages} />
          <LinkList title={`Cake Categories (${categoryLinks.length})`} items={categoryLinks.length ? categoryLinks : [["Browse all cakes", "/cakes"]]} />
          <LinkList title={`Products (${productLinks.length})`} items={productLinks.length ? productLinks : [["Browse all cakes", "/cakes"]]} />
          <LinkList title="Shop" items={[["Complete Menu & Pricing", "/menu"], ["All Cakes", "/cakes"], ["Cake Tags", "/cakes/tags"]]} />
        </div>
      </div>
    </main>,
  ];
  return content;
}
