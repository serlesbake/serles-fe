import { notFound } from 'next/navigation';
import BlogArchive from '../../../components/blog/BlogArchive';
import { getCategories, getCategory, getCategoryPosts, getSidebarData } from '../../../utils/blogData';
import { blogCategoryPath, buildMetadata, SITE_NAME } from '../../../utils/blog';

// Next requires a literal here; mirrors BLOG_LIST_REVALIDATE in utils/blog.js.
export const revalidate = 300;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.filter((category) => category?.slug).map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    return { title: `Category not found | ${SITE_NAME}`, robots: { index: false, follow: false } };
  }

  return buildMetadata({
    meta: category.meta_data || {},
    title: `${category.name} | ${SITE_NAME} Blog`,
    description:
      category.description ||
      `Read our ${category.name.toLowerCase()} articles — cake guides, prices and celebration ideas from Serle's Bake in Tenkasi.`,
    path: blogCategoryPath(slug),
  });
}

export default async function BlogCategoryPage({ params }) {
  const { slug } = await params;

  const [category, posts, sidebar] = await Promise.all([
    getCategory(slug),
    getCategoryPosts(slug),
    getSidebarData(),
  ]);

  if (!category) notFound();

  return (
    <BlogArchive
      eyebrow="Category"
      title={category.name}
      description={category.description}
      posts={posts}
      sidebar={sidebar}
      breadcrumb={[{ name: category.name, path: blogCategoryPath(slug) }]}
    />
  );
}
