import BlogPostClient from './BlogPostClient';
import { getBlogs } from '../../../lib/firestore-service';

export async function generateStaticParams() {
  try {
    const blogs = await getBlogs(true);
    if (!blogs || blogs.length === 0) {
      return [
        { slug: 'magic-of-vibe-coding' },
        { slug: 'my-journey-into-os-kernel-customization' },
        { slug: 'philosophy-of-vibe-coding' }
      ];
    }
    return blogs.map(blog => ({
      slug: blog.slug
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [
      { slug: 'magic-of-vibe-coding' },
      { slug: 'my-journey-into-os-kernel-customization' },
      { slug: 'philosophy-of-vibe-coding' }
    ];
  }
}

export default function Page({ params }) {
  return <BlogPostClient params={params} />;
}
