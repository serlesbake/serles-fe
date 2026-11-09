import Social from "../components/home/Social";
import Breadcrumb from "../components/Breadcrumb";
import { buildMetadata } from '../utils/blog';

export const metadata = buildMetadata({
  path: '/testimonial',
  title: "Customer Reviews | Homemade Cakes in Tenkasi",
  description: "See what our happy customers say about Serle’s Bake – Tenkasi’s trusted cake shop for birthday cakes, brownies & custom creations with same-day delivery.",
  keywords: "cake shop reviews tenkasi, serles bake testimonials, customer feedback, best cake shop tenkasi",
});
export default function SocialPage() {
  return (
    <>
      <Breadcrumb title="Testimonials" />
      <Social />
    </>
  );
}
