import ProjectDetailClient from './ProjectDetailClient';
import { getProjects } from '../../../lib/firestore-service';

export async function generateStaticParams() {
  try {
    const projects = await getProjects('published');
    if (!projects || projects.length === 0) {
      return [
        { id: 'buslk' },
        { id: 'portfolio' }
      ];
    }
    return projects.map(project => ({
      id: project.id
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default function Page({ params }) {
  return <ProjectDetailClient params={params} />;
}
