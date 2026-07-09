'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth';
import { app } from '../../../lib/firebase';
import { LogIn, Key, Mail, AlertCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Toggle to temporarily enable sign-up
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/admin/dashboard');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const auth = getAuth(app);

    try {
      if (isRegistering) {
        // Sign Up (Temporarily enabled for initial admin creation)
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        // Sign In
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push('/admin/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.message.replace('Firebase:', '').trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-6 relative">
      {/* Background Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[30%] w-[30vw] h-[30vw] rounded-full bg-indigo-500/10 blur-[100px] mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[30%] w-[30vw] h-[30vw] rounded-full bg-pink-500/10 blur-[100px] mix-blend-screen animate-pulse [animation-delay:2s]"></div>
      </div>

      <div className="w-full max-w-md z-10 animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="font-heading font-extrabold text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            SHASHIKA PORTFOLIO
          </Link>
          <h2 className="text-2xl font-bold text-white mt-4 font-heading">
            {isRegistering ? 'Create Admin Account' : 'Admin Panel Login'}
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {isRegistering
              ? 'Set up your administrator credentials'
              : 'Enter credentials to manage your website'}
          </p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 rounded-3xl border border-slate-900 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-pink-400 bg-pink-950/20 border border-pink-900/30 p-4 rounded-xl text-xs leading-relaxed">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : isRegistering ? 'Register Admin' : 'Login'}
              <LogIn size={16} />
            </button>
          </form>

          {/* Setup / Toggle Sign-up */}
          <div className="mt-8 pt-6 border-t border-slate-900 text-center">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-400 transition-colors font-medium"
            >
              <Sparkles size={12} />
              {isRegistering
                ? 'Back to Login'
                : 'Need to create the first admin? Setup Account'}
            </button>
            <p className="text-[10px] text-slate-500 mt-2">
              Note: Once you register your admin account, you should disable or comment out the registration code.
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="block text-center text-xs text-slate-400 hover:text-white mt-6 transition-colors"
        >
          Back to Live Site
        </Link>
      </div>
    </div>
  );
}
