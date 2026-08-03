import BlogPostClient from './BlogPostClient';
import { getPublishedBlogs } from '../../../lib/firestore-service';

export async function generateStaticParams() {
  try {
    const blogs = await getPublishedBlogs();
    if (!blogs || blogs.length === 0) {
      return [];
    }
    return blogs.map(blog => ({
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
