'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api/auth.api';
import { useAuthStore } from '@/lib/store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authApi.login(form);
      setAuth(data.data.user, data.data.accessToken);

      const role: string = data.data.user.role;
      if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? 'Login failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-stone-950 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-2">OCA-EU</p>
          <h1 className="text-3xl font-bold text-white">Welcome back</h1>
          <p className="text-stone-400 mt-2 text-sm">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-stone-300 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-sm placeholder:text-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-stone-300 text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-sm placeholder:text-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div className="text-right">
            <Link href="/forgot-password" className="text-amber-400 text-sm hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-white font-semibold rounded-xl py-3 transition-colors"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-stone-400 text-sm mt-6">
          Not a member yet?{' '}
          <Link href="/register" className="text-amber-400 hover:underline font-medium">
            Apply to join
          </Link>
        </p>
      </div>
    </main>
  );
}
