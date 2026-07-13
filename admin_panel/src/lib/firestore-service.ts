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
  serverTimestamp
} from 'firebase/firestore';

// --- BLOGS ---
export async function getBlogs(onlyPublished = false) {
  const colRef = collection(db, 'blogs');
  let q;
  try {
    q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    let blogs = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() ? data.updatedAt.toDate().toISOString() : data.updatedAt,
        publishedAt: data.publishedAt?.toDate?.() ? data.publishedAt.toDate().toISOString() : data.publishedAt,
      };
    });
    
    if (onlyPublished) {
      blogs = blogs.filter(b => b.published !== false); // default to true if undefined
    }
    return blogs;
  } catch (error) {
    console.error('Error getting blogs:', error);
    return [];
  }
}

export async function getBlogBySlug(slug) {
  const colRef = collection(db, 'blogs');
  const q = query(colRef, where('slug', '==', slug), limit(1));
  try {
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const docSnap = snapshot.docs[0];
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : data.createdAt,
      updatedAt: data.updatedAt?.toDate?.() ? data.updatedAt.toDate().toISOString() : data.updatedAt,
      publishedAt: data.publishedAt?.toDate?.() ? data.publishedAt.toDate().toISOString() : data.publishedAt,
    };
  } catch (error) {
    console.error('Error getting blog by slug:', error);
    return null;
  }
}

export async function addBlog(blogData) {
  const colRef = collection(db, 'blogs');
  return await addDoc(colRef, {
    ...blogData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateBlog(id, blogData) {
  const docRef = doc(db, 'blogs', id);
  return await updateDoc(docRef, {
    ...blogData,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteBlog(id) {
  const docRef = doc(db, 'blogs', id);
  return await deleteDoc(docRef);
}

// --- PROJECTS ---
export async function getProjects(fetchMode = 'all') { // 'all', 'featured', 'published'
  const colRef = collection(db, 'projects');
  let q;
  try {
    if (fetchMode === 'featured') {
      q = query(colRef, where('featured', '==', true), orderBy('order', 'asc'));
    } else {
      q = query(colRef, orderBy('order', 'asc'));
    }
    const snapshot = await getDocs(q);
    let projects = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : data.createdAt,
      };
    });

    if (fetchMode === 'published' || fetchMode === 'featured') {
      projects = projects.filter(p => p.visibility !== false); // hide drafts
    }
    
    return projects;
  } catch (error) {
    console.error('Error getting projects:', error);
    return [];
  }
}

export async function addProject(projectData) {
  const colRef = collection(db, 'projects');
  return await addDoc(colRef, {
    ...projectData,
    createdAt: serverTimestamp(),
  });
}

export async function updateProject(id, projectData) {
  const docRef = doc(db, 'projects', id);
  return await updateDoc(docRef, projectData);
}

export async function deleteProject(id) {
  const docRef = doc(db, 'projects', id);
  return await deleteDoc(docRef);
}

// --- ACADEMICS ---
export async function getAcademics() {
  const colRef = collection(db, 'academics');
  try {
    const q = query(colRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : data.createdAt,
      };
    });
  } catch (error) {
    console.error('Error getting academics:', error);
    return [];
  }
}

export async function addAcademic(academicData) {
  const colRef = collection(db, 'academics');
  return await addDoc(colRef, {
    ...academicData,
    createdAt: serverTimestamp(),
  });
}

export async function updateAcademic(id, academicData) {
  const docRef = doc(db, 'academics', id);
  return await updateDoc(docRef, academicData);
}

export async function deleteAcademic(id) {
  const docRef = doc(db, 'academics', id);
  return await deleteDoc(docRef);
}

// --- CONFIG / ABOUT ---
export async function getAboutConfig() {
  const docRef = doc(db, 'config', 'about');
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting about config:', error);
    return null;
  }
}

export async function updateAboutConfig(aboutData) {
  const docRef = doc(db, 'config', 'about');
  return await setDoc(docRef, aboutData, { merge: true });
}

// --- MESSAGES ---
export async function getMessages() {
  const colRef = collection(db, 'messages');
  try {
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : data.createdAt,
      };
    });
  } catch (error) {
    console.error('Error getting messages:', error);
    return [];
  }
}

export async function addMessage(messageData) {
  const colRef = collection(db, 'messages');
  return await addDoc(colRef, {
    ...messageData,
    status: 'unread',
    createdAt: serverTimestamp(),
  });
}

export async function updateMessageStatus(id, status) {
  const docRef = doc(db, 'messages', id);
  return await updateDoc(docRef, { status });
}

export async function deleteMessage(id) {
  const docRef = doc(db, 'messages', id);
  return await deleteDoc(docRef);
}

// --- COMPETITIONS ---
export async function getCompetitions() {
  const colRef = collection(db, 'competitions');
  try {
    const q = query(colRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : data.createdAt,
      };
    });
  } catch (error) {
    console.error('Error getting competitions:', error);
    return [];
  }
}

export async function addCompetition(competitionData) {
  const colRef = collection(db, 'competitions');
  return await addDoc(colRef, {
    ...competitionData,
    createdAt: serverTimestamp(),
  });
}

export async function updateCompetition(id, competitionData) {
  const docRef = doc(db, 'competitions', id);
  return await updateDoc(docRef, competitionData);
}

export async function deleteCompetition(id) {
  const docRef = doc(db, 'competitions', id);
  return await deleteDoc(docRef);
}
