import BlogPostClient from './BlogPostClient';
import { getPublishedBlogs } from '../../../lib/firestore-service';

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const timeout = new Promise<[]>((resolve) => setTimeout(() => resolve([]), 5000));
    const blogs = await Promise.race([
      getPublishedBlogs(),
      timeout,
    ]);
    if (!blogs || blogs.length === 0) {
      return [];
    }
    return (blogs as Array<{slug: string}>).map(blog => ({
      slug: blog.slug
    }));
  } catch (error) {
    console.error('Error generating static params for blogs:', error);
    return [];
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return <BlogPostClient params={resolvedParams} />;
}
