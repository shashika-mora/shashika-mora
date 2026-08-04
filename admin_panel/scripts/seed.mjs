import { initializeApp } from 'firebase/app';
import {
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword
} from 'firebase/auth';
import {
  getFirestore, doc, setDoc, collection, getDocs, addDoc
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAac_iowJD9hfZy-B-0pLUOjkPoACCOf_s",
  authDomain: "shashika-dev.firebaseapp.com",
  projectId: "shashika-dev",
  storageBucket: "shashika-dev.firebasestorage.app",
  messagingSenderId: "230922791117",
  appId: "1:230922791117:web:8183f156c7daef05d76184"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function seed() {
  console.log("🔥 Starting Firestore Data Seeding for shashika-dev...");

  const adminEmail = "admin@shashika.lk";
  const adminPass = "Admin#2026Dragon!";

  console.log("--> Authenticating admin user...");
  try {
    await signInWithEmailAndPassword(auth, adminEmail, adminPass);
    console.log("   Signed in as admin@shashika.lk");
  } catch (err) {
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
      try {
        await createUserWithEmailAndPassword(auth, adminEmail, adminPass);
        console.log("   Created admin account admin@shashika.lk");
      } catch (createErr) {
        console.log("   Could not create admin account:", createErr.message);
      }
    } else {
      console.log("   Auth notice:", err.message);
    }
  }

  // 1. Config / About Document
  console.log("--> Setting config/about...");
  await setDoc(doc(db, 'config', 'about'), {
    name: "Shashika Dayarathna",
    title: "CSE Undergraduate @ University of Moratuwa",
    bio: "I'm a Computer Science and Engineering undergraduate who enjoys building practical solutions, exploring intelligent systems, and learning how software and hardware work beneath the surface.",
    secondaryBio: "Driven by curiosity and a passion for systems architecture, I continuously build projects spanning full-stack web applications, low-level system programming, and embedded hardware design.",
    githubUrl: "https://github.com/shashika-mora",
    linkedinUrl: "https://www.linkedin.com/in/shashika-dayarathna-420875359",
    email: "dayarathnaamst.24@uom.lk",
    emailPersonal: "shashikatheekshana67@gmail.com",
    contactEmail: "dayarathnaamst.24@uom.lk",
    resumeUrl: "",
    location: "Colombo, Sri Lanka",
    isAvailable: true,
    availabilityStatus: "Available for Opportunities"
  }, { merge: true });

  // Helper to seed collection
  async function seedCollection(colName, items) {
    console.log(`--> Seeding collection '${colName}'...`);
    const colRef = collection(db, colName);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      for (const item of items) {
        await addDoc(colRef, {
          ...item,
          createdAt: new Date(),
        });
      }
      console.log(`   Added ${items.length} items to '${colName}'.`);
    } else {
      console.log(`   Collection '${colName}' already has ${snapshot.size} documents.`);
    }
  }

  // 2. Projects
  await seedCollection('projects', [
    {
      title: "Pintos OS Kernel Enhancements",
      description: "Implemented priority scheduling, user program execution, virtual memory management, and file system extensions in Pintos x86 operating system.",
      tags: ["C", "Operating Systems", "x86 Assembly", "Concurrency"],
      githubUrl: "https://github.com/shashika-mora",
      liveUrl: "",
      imageUrl: "/dragonpit/caraxes_1.jpg",
      featured: true,
      visibility: true,
      order: 1,
      dragonAlias: "CARAXES"
    },
    {
      title: "The Dragonpit — Personal Portfolio & Admin Platform",
      description: "A fire-themed Next.js 15 & Firebase full-stack portfolio with GSAP animations, custom design system, and real-time Firestore content management.",
      tags: ["Next.js", "TypeScript", "Firebase", "TailwindCSS", "GSAP"],
      githubUrl: "https://github.com/shashika-mora",
      liveUrl: "https://shashika-dev.web.app",
      imageUrl: "/dragonpit/vermithor_1.jpg",
      featured: true,
      visibility: true,
      order: 2,
      dragonAlias: "VERMITHOR"
    },
    {
      title: "Autonomous Swarm Robotics Simulator",
      description: "Multi-agent obstacle avoidance and path planning simulation using decentralized consensus algorithms in Python and PyGame.",
      tags: ["Python", "Algorithms", "Robotics", "Simulation"],
      githubUrl: "https://github.com/shashika-mora",
      liveUrl: "",
      imageUrl: "/dragonpit/meleys_1.jpg",
      featured: true,
      visibility: true,
      order: 3,
      dragonAlias: "MELEYS"
    }
  ]);

  // 3. Blogs
  await seedCollection('blogs', [
    {
      title: "Installing & Debugging Pintos OS on WSL2",
      slug: "install-pintos-on-wsl",
      excerpt: "A step-by-step guide on compiling GCC 4.4 cross-compilers and setting up QEMU for Pintos OS inside WSL2.",
      content: "## Overview\nSetting up Pintos OS on modern 64-bit Linux environments like WSL2 requires setting up legacy 32-bit x86 toolchains...\n\n### Prerequisites\n- WSL2 with Ubuntu 22.04 LTS\n- QEMU / Bochs x86 emulator\n- GDB with 32-bit architecture support\n\n### Step-by-Step Toolchain Compilation...\n",
      published: true,
      tags: ["C", "Pintos", "Linux", "WSL"],
      dragonAlias: "DREAMFYRE",
      publishedAt: new Date().toISOString()
    },
    {
      title: "Building a Daily AI Briefing Pipeline",
      slug: "daily-briefing-with-chatgpt",
      excerpt: "Automating RSS feeds, paper summaries, and tech news with Node.js and LLM API integrations.",
      content: "## Architectural Overview\nIn this writeup we discuss building a serverless node worker that polls top ArXiv preprints and tech RSS feeds, runs them through Gemini / ChatGPT summarization prompts, and delivers a formatted daily briefing...\n",
      published: true,
      tags: ["AI", "Node.js", "Automation"],
      dragonAlias: "SILVERWING",
      publishedAt: new Date().toISOString()
    }
  ]);

  // 4. Competitions
  await seedCollection('competitions', [
    {
      title: "IEEEXtreme 17.0 Programming Competition",
      organizer: "IEEE World Headquarters",
      rank: "National Top 50 Rank",
      date: "2023",
      description: "24-hour virtual competitive programming challenge tackling advanced algorithms, graph theory, and dynamic programming problems.",
      order: 1
    },
    {
      title: "MoraXtreme 8.0",
      organizer: "IEEE Student Branch — University of Moratuwa",
      rank: "Finalist & Top 10 Team",
      date: "2024",
      description: "Inter-university competitive programming contest testing speed, problem-solving, and team coordination under tight time constraints.",
      order: 2
    }
  ]);

  // 5. Skills
  await seedCollection('skills', [
    {
      category: "Programming Languages",
      items: ["C / C++", "Python", "TypeScript", "JavaScript", "Java", "SQL", "Assembly (x86)"],
      order: 1
    },
    {
      category: "Frontend & UI Engineering",
      items: ["Next.js", "React", "TailwindCSS", "GSAP Animations", "HTML5 / CSS3", "Vite"],
      order: 2
    },
    {
      category: "Backend & Cloud Systems",
      items: ["Node.js", "Express", "Firebase / Firestore", "PostgreSQL", "REST APIs", "Docker"],
      order: 3
    }
  ]);

  // 6. Thoughts
  await seedCollection('thoughts', [
    {
      content: "Simplicity in systems architecture is not the absence of complexity, but the mastery of it.",
      author: "Shashika",
      likes: 12,
      dislikes: 0
    },
    {
      content: "Building software is like riding dragons—it takes vision to soar and discipline not to get burned by edge cases.",
      author: "Shashika",
      likes: 8,
      dislikes: 0
    }
  ]);

  console.log("✅ Seeding completed successfully!");
  process.exit(0);
}

seed().catch(err => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
