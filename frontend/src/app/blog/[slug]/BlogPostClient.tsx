'use client';

import { useState, useEffect, use } from 'react';
import { getBlogBySlug } from '../../../lib/firestore-service';
import { Calendar, Tag, ArrowLeft, ArrowRight, User } from 'lucide-react';
import Link from 'next/link';
import MarkdownRenderer from '../../../components/MarkdownRenderer';

const DEFAULT_BLOGS = {
  'my-journey-into-os-kernel-customization': {
    title: 'My Journey into OS Kernel Customization',
    summary: 'An engineering undergraduate\'s dive into configuring, patching, and debugging Linux kernels from scratch, exploring the boundary between hardware and software.',
    content: `
Configuring and compiling your own Linux kernel is a rite of passage for computer engineering students. It bridges the gap between theoretical operating system concepts and real-world system engineering. 

Here's a breakdown of what I learned compiling and patching the Linux kernel:

## Why compile a custom kernel?
1. **Remove Unused Drivers**: Modern kernels include drivers for thousands of devices you don't own. A custom kernel compiles only what is on your motherboard, reducing boot time and memory footprint.
2. **Apply Custom Patches**: If you want to use experimental schedulers (like BMQ or PDS) or apply security enhancements, compiling from source is the only way.
3. **Optimized for Hardware**: You can target your exact CPU architecture flags (e.g., \`-march=native\`) rather than generic x86_64, allowing compiler optimizations specific to your processor instructions.

## Step 1: Gathering Hardware Information
Before changing anything, you must know what hardware is in your machine. I used \`lspci\`, \`lsusb\`, and \`lshw\` to dump the list of exact controllers (SATA, network cards, graphics) on my test PC.

## Step 2: The Configuration (\`.config\`)
This is where the magic happens. By running \`make menuconfig\`, you get an interactive shell interface to enable or disable kernel options.
* **[*] (Built-in)**: Compiles the driver directly into the kernel image. Essential for filesystem drivers (like ext4) and SATA controllers needed to boot.
* **[M] (Module)**: Compiles the driver as a separate file (\`.ko\`) loaded on demand. Great for USB peripherals, webcams, and wifi drivers.
* **[ ] (Disabled)**: Disables the subsystem entirely.

## Step 3: Compiling and Installing
Once config is saved, compile using:
\`\`\`bash
make -j$(nproc)
\`\`\`
This compiles using all available CPU threads. On my Victus laptop, compilation takes around 8 minutes.

Once compiled, install the modules and kernel:
\`\`\`bash
sudo make modules_install
sudo make install
\`\`\`
Finally, update the GRUB bootloader to point to the new kernel:
\`\`\`bash
sudo grub-mkconfig -o /boot/grub/grub.cfg
\`\`\`

## Key Takeaway
Compiling the kernel isn't about obtaining a magical 2x performance increase. It's about **understanding your hardware**. It forces you to learn how virtual file systems, network sockets, interrupts, and device drivers interconnect.

If you are a systems student, I highly recommend finding an old PC and running a custom kernel. There's nothing quite like the feeling of booting into a kernel you configured yourself!
`,
    tags: ['Linux', 'C', 'OS Dev'],
    publishedAt: '2026-07-09T00:00:00.000Z',
    createdAt: '2026-07-09T00:00:00.000Z',
  },
  'philosophy-of-vibe-coding': {
    title: 'Embracing the Vibe: The Philosophy of Pure/Vibe Coding',
    summary: 'A deep-dive into coding by instinct, diving straight into code, debugging rapidly, and resolving issues through iterative exploration.',
    content: `
We often talk about software engineering as a rigid science. There are specifications, UML diagrams, test suites, and strict design patterns. But when you are building something brand new, or trying to understand an unfamiliar codebase, there is a different mode of development that is equally powerful: **Vibe Coding**.

## What is Vibe Coding?
Vibe coding is the process of building software by **instinct and iteration**. Instead of spending days designing the perfect database schema or writing abstract architecture interfaces, you dive straight into writing code. You break things, look at the error messages, patch them up, and slowly steer the application towards a working state.

> "We suffer more often in imagination than in reality." — Seneca

Many programmers get stuck in "analysis paralysis"—worrying about future scaling or writing perfect code, which prevents them from building anything at all. Vibe coding prioritizes **momentum** and **feedback**.

## When Vibe Coding Works Best
1. **Prototyping & Hackathons**: When you need a proof of concept in 24 hours.
2. **Learning New Technologies**: Playing with an API or a new framework is much more educational when you break it rather than just reading documentation.
3. **Exploring Systems Debugging**: Low-level kernel tweaks or system integrations often don't have clean manuals. You have to change things and observe the console logs.

## The Pitfalls (and how to avoid them)
Vibe coding can lead to "spaghetti code" if you are not careful. The secret is knowing **when to shift gears**:
* **Vibe Mode**: Write code quickly, explore solutions, test ideas.
* **Refactor Mode**: Once the feature is working, stop, examine the hacks, clean up variables, deduplicate logic, and write tests.

Vibe coding is not about being lazy—it's about leveraging raw curiosity to build software. Don't be afraid to embrace the chaos!
`,
    tags: ['Coding', 'Philosophy', 'Vibe'],
    publishedAt: '2026-07-08T00:00:00.000Z',
    createdAt: '2026-07-08T00:00:00.000Z',
  }
};

export default function BlogPostClient({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      const data = await getBlogBySlug(slug);
      if (data) {
        setBlog(data);
      } else if (DEFAULT_BLOGS[slug]) {
        setBlog(DEFAULT_BLOGS[slug]);
      }
      setLoading(false);
    }
    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500 border-r-2 mb-4"></div>
        <p className="text-slate-400">Loading article...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="font-heading text-3xl font-extrabold text-white mb-4">Article Not Found</h2>
        <p className="text-slate-400 mb-8">The blog post you are looking for does not exist or has been removed.</p>
        <Link href="/blog" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 border border-slate-800 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all">
          <ArrowLeft size={14} /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 md:py-20 animate-fade-in-up">
      {/* Back button */}
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8 group">
        <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
        Back to Articles
      </Link>

      {/* Meta Info */}
      <div className="flex items-center flex-wrap gap-4 text-xs text-slate-400 mb-6">
        <span className="flex items-center gap-1.5">
          <Calendar size={12} className="text-slate-500" />
          {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </span>
        {blog.readingTime && (
          <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
            {blog.readingTime} min read
          </span>
        )}
        {blog.tags && blog.tags.length > 0 && (
          <span className="flex items-center gap-1">
            <Tag size={10} className="text-slate-500" />
            {blog.tags.join(', ')}
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
        {blog.title}
      </h1>

      {/* Summary */}
      <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed border-l-4 border-indigo-500/50 pl-4 py-1 mb-10 italic">
        {blog.summary}
      </p>

      {/* Cover Image if available */}
      {blog.imageUrl && (
        <div className="w-full h-80 md:h-[400px] rounded-3xl overflow-hidden mb-12 border border-slate-900">
          <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Content */}
      <article className="border-t border-slate-900 pt-8 mb-16">
        <MarkdownRenderer content={blog.content} />
      </article>

      {/* Author Card / Sign-off */}
      <div className="glass-card p-6 rounded-2xl flex items-center gap-4 border border-slate-900 mb-12">
        <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-full text-indigo-400 shrink-0">
          <User size={24} />
        </div>
        <div>
          <h4 className="font-heading font-semibold text-white">Shashika Dayarathna</h4>
          <p className="text-xs text-slate-400">CSE Undergrad @ University of Moratuwa. Vibe coder, Linux kernel enthusiast.</p>
        </div>
      </div>
    </div>
  );
}
