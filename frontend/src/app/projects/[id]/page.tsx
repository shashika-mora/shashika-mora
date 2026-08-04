import ProjectDetailClient from './ProjectDetailClient';
import { getProjects } from '../../../lib/firestore-service';

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const timeout = new Promise<[]>((resolve) => setTimeout(() => resolve([]), 5000));
    const projects = await Promise.race([
      getProjects('published'),
      timeout,
    ]);
    if (!projects || projects.length === 0) {
      return [];
    }
    return (projects as Array<{id: string}>).map(project => ({
      id: project.id
    }));
  } catch (error) {
    console.error('Error generating static params for projects:', error);
    return [];
  }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <ProjectDetailClient params={resolvedParams} />;
}
