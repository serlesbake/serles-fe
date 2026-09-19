import AllProductsMenu from "@/app/components/AllProductsMenu";
import Breadcrumb from "@/app/components/Breadcrumb";
import Cta from "@/app/components/home/cta";

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

export default function MenuPage() {
  return (
    <>
      <Breadcrumb title="Menu & Pricing" />
      <AllProductsMenu />
      <Cta />
    </>
  );
}