import { notFound } from 'next/navigation';
import BlogArchive from '../../../components/blog/BlogArchive';
import { getTags, getTag, getTagPosts, getSidebarData } from '../../../utils/blogData';
import { blogTagPath, buildMetadata, SITE_NAME } from '../../../utils/blog';

// Next requires a literal here; mirrors BLOG_LIST_REVALIDATE in utils/blog.js.
export const revalidate = 300;

export async function generateStaticParams() {
  const tags = await getTags();
  return tags.filter((tag) => tag?.slug).map((tag) => ({ slug: tag.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tag = await getTag(slug);

  if (!tag) {
    return { title: `Tag not found | ${SITE_NAME}`, robots: { index: false, follow: false } };
  }

  return buildMetadata({
    meta: tag.meta_data || {},
    title: `${tag.name} Articles | ${SITE_NAME} Blog`,
    description:
      tag.description ||
      `Every Serle's Bake article tagged ${tag.name.toLowerCase()} — cake guides, prices and ordering tips from Tenkasi.`,
    path: blogTagPath(slug),
  });
}

export default async function BlogTagPage({ params }) {
  const { slug } = await params;

  const [tag, posts, sidebar] = await Promise.all([getTag(slug), getTagPosts(slug), getSidebarData()]);

  if (!tag) notFound();

  return (
    <BlogArchive
      eyebrow="Tag"
      title={tag.name}
      description={tag.description}
      posts={posts}
      sidebar={sidebar}
      breadcrumb={[{ name: tag.name, path: blogTagPath(slug) }]}
    />
  );
}
