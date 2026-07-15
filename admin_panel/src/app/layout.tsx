'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app } from '../lib/firebase';
import { Inter, Outfit } from 'next/font/google';
import AdminSidebar from '../components/AdminSidebar';
import './globals.css';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

const outfit = Outfit({
  variable: '--font-heading',
  subsets: ['latin'],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || '';
      const isAdminUser = currentUser && currentUser.email?.toLowerCase() === adminEmail.toLowerCase();

      if (currentUser && !isAdminUser) {
        signOut(auth);
        setUser(null);
        router.replace('/login');
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (loading) return;

    if (!user && pathname !== '/login') {
      router.replace('/login');
    } else if (user && pathname === '/login') {
      router.replace('/');
    }
  }, [user, pathname, loading, router]);

  // Render a loading spinner during initial authentication check
  const renderLoading = () => (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-500 border-r-2"></div>
        <p className="text-sm font-medium">Checking authentication...</p>
      </div>
    </div>
  );

  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full antialiased dark`}>
      <body className="min-h-full bg-slate-950 text-slate-100 flex overflow-x-hidden">
        {loading ? (
          renderLoading()
        ) : pathname === '/login' ? (
          /* Render login screen without sidebar layout */
          <div className="flex-1 min-h-screen">{children}</div>
        ) : (
          /* Render dashboard with admin sidebar */
          <div className="flex-grow flex">
            <AdminSidebar />
            <div className="flex-1 pl-64 min-h-screen flex flex-col">
              <main className="flex-grow p-8 md:p-12 overflow-x-hidden">
                {children}
              </main>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
