import About from "../components/home/About";
import Milestones from "../components/home/milestone";
import Team from "../components/home/Team";
import Breadcrumb from "../components/Breadcrumb";

const TITLE = "About Us - Serle's Bake | Homemade Cakes in Tenkasi";
const DESCRIPTION =
  "Learn about Serle's Bake, your trusted homemade cake shop in Tenkasi. Our passion for baking and commitment to quality makes every celebration special.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: "about serles bake, tenkasi bakery, cake shop history, custom cake makers, homemade cake shop tenkasi",
  // Without this the page inherits `canonical: '/'` from the root layout and
  // reports itself to Google as a duplicate of the homepage.
  alternates: {
    canonical: "https://www.serlesbake.in/about",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://www.serlesbake.in/about",
    siteName: "Serle's Bake",
    type: "website",
    images: "/img/hero/hero-1.jpg",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/img/hero/hero-1.jpg"],
  },
};
export default function AboutPage() {
  return (
    <>
      <Breadcrumb title="About Us" />
      <About />
      <Milestones />
      <Team />
    </>
  );
}