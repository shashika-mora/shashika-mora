import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import InteractiveBackground from '../components/InteractiveBackground';

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
        
        <InteractiveBackground />

        <div className="relative z-10 flex flex-col min-h-screen pointer-events-auto">
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
