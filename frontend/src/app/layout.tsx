import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

const outfit = Outfit({
  variable: '--font-heading',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Shashika Dayarathna | CSE Undergrad & Developer',
  description: 'CSE Undergraduate @ University of Moratuwa. Explorer of low-level kernel tweaks, systems, and modern app development.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-200 overflow-x-hidden selection:bg-indigo-500 selection:text-white">
        
        {/* Decorative background blobs */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-500/10 blur-[120px] mix-blend-screen opacity-50 animate-pulse"></div>
          <div className="absolute top-[20%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-pink-500/10 blur-[120px] mix-blend-screen opacity-50 animate-pulse [animation-delay:2s]"></div>
          <div className="absolute bottom-[-10%] left-[20%] w-[45vw] h-[45vw] rounded-full bg-purple-500/10 blur-[120px] mix-blend-screen opacity-50 animate-pulse [animation-delay:4s]"></div>
        </div>

        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
