import { Inter, Outfit, Crimson_Pro } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import InteractiveBackground from '../components/InteractiveBackground';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const outfit = Outfit({
  variable: '--font-heading',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'The Dragonpit | Shashika Dayarathna',
  description:
    'The Dragonpit is the dynamic portfolio of Shashika Dayarathna, a Computer Science and Engineering undergraduate at the University of Moratuwa, featuring projects, academic progress, competitions, technical writing and ongoing learning.',
  icons: [
    { rel: 'icon', url: '/dragonpit/my_banner.png', type: 'image/png' },
  ],
  openGraph: {
    title: 'The Dragonpit | Shashika Dayarathna',
    description: 'Ideas hatch here. Systems take flight.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased dark`}
    >
      <body
        style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}
        className="bg-[#080706] text-[#eee7dd]"
      >
        {/* Ember field background — aria-hidden canvas */}
        <InteractiveBackground />

        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', minHeight: '100vh', pointerEvents: 'auto' }}>
          <Navbar />
          <main style={{ flexGrow: 1 }}>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
