"use client";

import { motion, Variants } from "framer-motion";
import { Terminal, Code, Cpu, ShieldAlert, Smartphone, Database, Mail, Github, Linkedin, BookOpen, Film, Compass } from "lucide-react";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center py-20 px-6 sm:px-12 lg:px-24">
      {/* Hero Section */}
      <motion.section
        className="w-full max-w-4xl text-center mt-12 mb-24"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">
          Hi there, I&apos;m Shashika! 👋
        </h1>
        <h3 className="text-xl md:text-2xl text-zinc-300 font-medium mb-8">
          CSE Undergrad @ University of Moratuwa 🎓 | Pure/Vibe Coder ✨ | OS Tinkerer 🐧
        </h3>
        <p className="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-3xl mx-auto">
          I&apos;m a Computer Science and Engineering undergraduate currently exploring everything from low-level kernel tweaks to modern app development. My development process heavily relies on <strong>Pure coding / Vibe coding</strong>—diving in, breaking things, patching them up, and figuring it out along the way.
        </p>
      </motion.section>

      {/* Tech Stack Segment */}
      <motion.section
        className="w-full max-w-5xl mb-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <motion.h2 variants={fadeInUp} className="text-3xl font-bold mb-10 text-center flex items-center justify-center gap-3">
          <Terminal className="text-indigo-400" /> Tech Stack & Arsenal
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div variants={fadeInUp} className="glass-card">
            <h3 className="text-xl font-semibold mb-4 text-indigo-300 flex items-center gap-2">
              <Code size={20} /> Languages
            </h3>
            <p className="text-zinc-400">Python, Java, C++, Kotlin</p>
          </motion.div>

          <motion.div variants={fadeInUp} className="glass-card">
            <h3 className="text-xl font-semibold mb-4 text-pink-300 flex items-center gap-2">
              <Smartphone size={20} /> Web & Mobile
            </h3>
            <p className="text-zinc-400">Next.js, React, Flutter, Android, Figma</p>
          </motion.div>

          <motion.div variants={fadeInUp} className="glass-card">
            <h3 className="text-xl font-semibold mb-4 text-purple-300 flex items-center gap-2">
              <Cpu size={20} /> AI & LLMs
            </h3>
            <p className="text-zinc-400">Gemini, Claude, Antigravity, Gen AI & ML, MCP Servers</p>
          </motion.div>

          <motion.div variants={fadeInUp} className="glass-card">
            <h3 className="text-xl font-semibold mb-4 text-green-300 flex items-center gap-2">
              <ShieldAlert size={20} /> OS & Hardware
            </h3>
            <p className="text-zinc-400">Windows, Linux, Kernel Tweaking, Vivado, Patching</p>
          </motion.div>

          <motion.div variants={fadeInUp} className="glass-card lg:col-span-2">
            <h3 className="text-xl font-semibold mb-4 text-blue-300 flex items-center gap-2">
              <Database size={20} /> Tools & Cloud
            </h3>
            <p className="text-zinc-400">Firebase, Cloud Firestore, Vercel, Google Cloud, Git & GitHub</p>
          </motion.div>
        </div>
      </motion.section>

      {/* What I'm Up To */}
      <motion.section
        className="w-full max-w-4xl mb-24 glass p-8 rounded-2xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
      >
        <h2 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
          🔭 What I&apos;m Up To
        </h2>
        <ul className="space-y-4 text-lg text-zinc-300">
          <li className="flex items-start gap-3">
            <span className="text-xl">🧠</span> Diving deep into Generative AI, ML, and configuring MCP servers.
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl">💻</span> Experimenting with OS management, custom tweaks, and kernel-level debugging.
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl">📱</span> Building, scripting, and sketching out UI designs across frameworks like Next.js and Flutter.
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl">🏗️</span> Architecting scalable backend solutions and structuring complex NoSQL databases.
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl">🧩</span> Leveling up my Data Structures and Algorithms (DSA) game.
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl">✨</span> Embracing the chaos of Pure coding / Vibe coding to turn abstract ideas into functional software.
          </li>
        </ul>
      </motion.section>

      {/* Outside the Terminal */}
      <motion.section
        className="w-full max-w-4xl mb-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <motion.h2 variants={fadeInUp} className="text-3xl font-bold mb-10 text-center">
          ⚡ Outside the Terminal
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={fadeInUp} className="glass-card text-center flex flex-col items-center">
            <BookOpen className="text-indigo-400 w-12 h-12 mb-4" />
            <p className="text-zinc-300">Immersing myself in the pages of a good novel.</p>
          </motion.div>
          <motion.div variants={fadeInUp} className="glass-card text-center flex flex-col items-center">
            <Film className="text-pink-400 w-12 h-12 mb-4" />
            <p className="text-zinc-300">Watching documentaries to learn more about the world.</p>
          </motion.div>
          <motion.div variants={fadeInUp} className="glass-card text-center flex flex-col items-center">
            <Compass className="text-emerald-400 w-12 h-12 mb-4" />
            <p className="text-zinc-300">Studying philosophy and on a continuous journey of finding myself.</p>
          </motion.div>
        </div>

        <motion.blockquote
          variants={fadeInUp}
          className="mt-12 text-center text-xl text-zinc-400 italic border-l-4 border-indigo-500 pl-6 py-2 mx-auto max-w-2xl"
        >
          &quot;We suffer more often in imagination than in reality.&quot; — Seneca
        </motion.blockquote>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        className="w-full max-w-2xl text-center glass-card"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h2 className="text-3xl font-bold mb-6">📫 Let&apos;s Connect</h2>
        <p className="text-zinc-400 mb-8">
          Whether you want to collaborate on a project, talk about OS patching, or just say hi, my inbox is always open.
        </p>
        <div className="flex justify-center gap-6">
          <a
            href="mailto:dayarathnaamst.24@uom.lk"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full transition-all text-white font-medium border border-white/10"
          >
            <Mail size={20} /> Email Me
          </a>
          <a
            href="https://www.linkedin.com/in/shashika-dayarathna-420875359"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#0077B5]/20 hover:bg-[#0077B5]/40 px-6 py-3 rounded-full transition-all text-white font-medium border border-[#0077B5]/30"
          >
            <Linkedin size={20} /> LinkedIn
          </a>
        </div>
      </motion.section>
    </main>
  );
}
