import ProjectDetailClient from './ProjectDetailClient';
import { getProjects } from '../../../lib/firestore-service';

export async function generateStaticParams() {
  try {
    const projects = await getProjects('published');
    if (!projects || projects.length === 0) {
      return [];
    }
    return projects.map(project => ({
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
