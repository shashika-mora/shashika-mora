import { db } from './firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  setDoc,
  serverTimestamp,
  increment
} from 'firebase/firestore';

// --- TYPES ---
export type LoadState = 'loading' | 'success' | 'empty' | 'error';
export type ProjectFetchMode = 'all' | 'featured' | 'published';

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  techStack?: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured?: boolean;
  visibility?: boolean;
  order?: number;
  createdAt?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  category?: string;
  published?: boolean;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Competition {
  id: string;
  title: string;
  award?: string;
  date?: string;
  description?: string;
  imageUrl?: string;
  imageUrl2?: string;
  link?: string;
  order?: number;
  createdAt?: string;
}

export interface Thought {
  id: string;
  content: string;
  category?: string;
  date?: string;
  likes?: number;
  dislikes?: number;
  createdAt?: string;
}

export interface Skill {
  id: string;
  name: string;
  category?: string;
  level?: string | number;
  icon?: string;
  order?: number;
}

export interface AcademicRecord {
  id: string;
  degree?: string;
  institution?: string;
  period?: string;
  description?: string;
  gpa?: string;
  order?: number;
  createdAt?: string;
}

export interface AboutConfig {
  name?: string;
  role?: string;
  title?: string;
  subtitle?: string;
  bio?: string;
  secondaryBio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  email?: string;
  emailPersonal?: string;
  contactEmail?: string;
  resumeUrl?: string;
  avatarUrl?: string;
  availabilityStatus?: string;
  isAvailable?: boolean;
  heroPhrases?: string[];
  skills?: any[];
}

// --- BLOGS ---
export async function getBlogs(onlyPublished = false): Promise<BlogPost[]> {
  const colRef = collection(db, 'blogs');
  try {
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    let blogs = snapshot.docs.map(docSnap => {
      const data = docSnap.data() as Record<string, any>;
      return {
        id: docSnap.id,
        title: data.title || '',
        slug: data.slug || docSnap.id,
        content: data.content || '',
        ...data,
        createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() ? data.updatedAt.toDate().toISOString() : data.updatedAt,
        publishedAt: data.publishedAt?.toDate?.() ? data.publishedAt.toDate().toISOString() : data.publishedAt,
      } as BlogPost;
    });

    if (onlyPublished) {
      blogs = blogs.filter(b => b.published !== false);
    }
    return blogs;
  } catch (error) {
    console.error('Error getting blogs:', error);
    return [];
  }
}

export async function getPublishedBlogs(): Promise<BlogPost[]> {
  return getBlogs(true);
}

export async function getBlogBySlug(slug: string, publicOnly = false): Promise<BlogPost | null> {
  const colRef = collection(db, 'blogs');
  const q = query(colRef, where('slug', '==', slug), limit(1));
  try {
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const docSnap = snapshot.docs[0];
    const data = docSnap.data() as Record<string, any>;
    const blog = {
      id: docSnap.id,
      title: data.title || '',
      slug: data.slug || docSnap.id,
      content: data.content || '',
      ...data,
      createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : data.createdAt,
      updatedAt: data.updatedAt?.toDate?.() ? data.updatedAt.toDate().toISOString() : data.updatedAt,
      publishedAt: data.publishedAt?.toDate?.() ? data.publishedAt.toDate().toISOString() : data.publishedAt,
    } as BlogPost;

    if (publicOnly && blog.published === false) {
      return null;
    }
    return blog;
  } catch (error) {
    console.error('Error getting blog by slug:', error);
    return null;
  }
}

export async function addBlog(blogData: Partial<BlogPost>) {
  const colRef = collection(db, 'blogs');
  return await addDoc(colRef, {
    ...blogData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateBlog(id: string, blogData: Partial<BlogPost>) {
  const docRef = doc(db, 'blogs', id);
  return await updateDoc(docRef, {
    ...blogData,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteBlog(id: string) {
  const docRef = doc(db, 'blogs', id);
  return await deleteDoc(docRef);
}

// --- PROJECTS ---
export async function getProjects(fetchMode: ProjectFetchMode = 'all'): Promise<Project[]> {
  const colRef = collection(db, 'projects');
  let q;
  try {
    if (fetchMode === 'featured') {
      q = query(colRef, where('featured', '==', true), orderBy('order', 'asc'));
    } else {
      q = query(colRef, orderBy('order', 'asc'));
    }
    const snapshot = await getDocs(q);
    let projects = snapshot.docs.map(docSnap => {
      const data = docSnap.data() as Record<string, any>;
      return {
        id: docSnap.id,
        title: data.title || '',
        description: data.description || '',
        ...data,
        createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : data.createdAt,
      } as Project;
    });

    if (fetchMode === 'published' || fetchMode === 'featured') {
      projects = projects.filter(p => p.visibility !== false);
    }

    return projects;
  } catch (error) {
    console.error('Error getting projects:', error);
    return [];
  }
}

export async function getPublishedProjects(): Promise<Project[]> {
  return getProjects('published');
}

export async function getProjectById(id: string, publicOnly = false): Promise<Project | null> {
  const docRef = doc(db, 'projects', id);
  try {
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    const data = docSnap.data();
    const project = {
      id: docSnap.id,
      title: data.title || '',
      description: data.description || '',
      ...data,
      createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : data.createdAt,
    } as Project;

    if (publicOnly && project.visibility === false) {
      return null;
    }
    return project;
  } catch (error) {
    console.error('Error getting project by id:', error);
    return null;
  }
}

export async function addProject(projectData: Partial<Project>) {
  const colRef = collection(db, 'projects');
  return await addDoc(colRef, {
    ...projectData,
    createdAt: serverTimestamp(),
  });
}

export async function updateProject(id: string, projectData: Partial<Project>) {
  const docRef = doc(db, 'projects', id);
  return await updateDoc(docRef, projectData);
}

export async function deleteProject(id: string) {
  const docRef = doc(db, 'projects', id);
  return await deleteDoc(docRef);
}

// --- ACADEMICS ---
export async function getAcademics(): Promise<AcademicRecord[]> {
  const colRef = collection(db, 'academics');
  try {
    const q = query(colRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : data.createdAt,
      } as AcademicRecord;
    });
  } catch (error) {
    console.error('Error getting academics:', error);
    return [];
  }
}

export async function addAcademic(academicData: Partial<AcademicRecord>) {
  const colRef = collection(db, 'academics');
  return await addDoc(colRef, {
    ...academicData,
    createdAt: serverTimestamp(),
  });
}

export async function updateAcademic(id: string, academicData: Partial<AcademicRecord>) {
  const docRef = doc(db, 'academics', id);
  return await updateDoc(docRef, academicData);
}

export async function deleteAcademic(id: string) {
  const docRef = doc(db, 'academics', id);
  return await deleteDoc(docRef);
}

// --- CONFIG / ABOUT ---
export async function getAboutConfig(): Promise<AboutConfig | null> {
  const docRef = doc(db, 'config', 'about');
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as AboutConfig;
    }
    return null;
  } catch (error) {
    console.error('Error getting about config:', error);
    return null;
  }
}

export async function updateAboutConfig(aboutData: Partial<AboutConfig>) {
  const docRef = doc(db, 'config', 'about');
  return await setDoc(docRef, aboutData, { merge: true });
}

// --- MESSAGES ---
export async function getMessages() {
  const colRef = collection(db, 'messages');
  try {
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : data.createdAt,
      };
    });
  } catch (error) {
    console.error('Error getting messages:', error);
    return [];
  }
}

export async function addMessage(messageData: { name: string; email: string; subject?: string; message: string }) {
  const colRef = collection(db, 'messages');
  return await addDoc(colRef, {
    ...messageData,
    status: 'unread',
    createdAt: serverTimestamp(),
  });
}

export async function updateMessageStatus(id: string, status: string) {
  const docRef = doc(db, 'messages', id);
  return await updateDoc(docRef, { status });
}

export async function deleteMessage(id: string) {
  const docRef = doc(db, 'messages', id);
  return await deleteDoc(docRef);
}

// --- COMPETITIONS ---
export async function getCompetitions(): Promise<Competition[]> {
  const colRef = collection(db, 'competitions');
  try {
    const q = query(colRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        title: data.title || '',
        ...data,
        createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : data.createdAt,
      } as Competition;
    });
  } catch (error) {
    console.error('Error getting competitions:', error);
    return [];
  }
}

export async function addCompetition(competitionData: Partial<Competition>) {
  const colRef = collection(db, 'competitions');
  return await addDoc(colRef, {
    ...competitionData,
    createdAt: serverTimestamp(),
  });
}

export async function updateCompetition(id: string, competitionData: Partial<Competition>) {
  const docRef = doc(db, 'competitions', id);
  return await updateDoc(docRef, competitionData);
}

export async function deleteCompetition(id: string) {
  const docRef = doc(db, 'competitions', id);
  return await deleteDoc(docRef);
}

// --- THOUGHTS ---
export async function getThoughts(): Promise<Thought[]> {
  const colRef = collection(db, 'thoughts');
  try {
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        content: data.content || '',
        ...data,
        createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : data.createdAt,
      } as Thought;
    });
  } catch (error) {
    console.error('Error getting thoughts:', error);
    return [];
  }
}

export async function updateThoughtVote(id: string, updates: Record<string, number>) {
  const docRef = doc(db, 'thoughts', id);
  const updateObj: Record<string, any> = {};
  for (const [key, val] of Object.entries(updates)) {
    updateObj[key] = increment(val);
  }
  return await updateDoc(docRef, updateObj);
}

// --- SKILLS ---
export async function getSkills(): Promise<Skill[]> {
  const colRef = collection(db, 'skills');
  try {
    const q = query(colRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name || '',
        ...data,
      } as Skill;
    });
  } catch (error) {
    console.error('Error getting skills:', error);
    return [];
  }
}
