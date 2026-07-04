'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authApi } from '@/lib/api/auth.api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await authApi.forgotPassword(email).catch(() => {});
    setSent(true);
    setLoading(false);
  };

  if (sent) return (
    <main className="min-h-screen bg-stone-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="text-5xl mb-4">📧</div>
        <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
        <p className="text-stone-400 mb-6">
          If <strong className="text-white">{email}</strong> is registered,
          a reset link has been sent. Check your inbox and spam folder.
        </p>
        <Link href="/login" className="text-amber-400 hover:underline">Back to Login</Link>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-stone-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Reset password</h1>
          <p className="text-stone-400 mt-2 text-sm">Enter your email and we&apos;ll send a reset link</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-5">
          <div>
            <label className="block text-stone-300 text-sm font-medium mb-2">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-sm placeholder:text-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
              placeholder="you@example.com" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-white font-semibold rounded-xl py-3 transition-colors">
            {loading ? 'Sending…' : 'Send Reset Link'}
          </button>
        </form>
        <p className="text-center text-stone-400 text-sm mt-6">
          <Link href="/login" className="text-amber-400 hover:underline">Back to Login</Link>
        </p>
      </div>
    </main>
  );
}
