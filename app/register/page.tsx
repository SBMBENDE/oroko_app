'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api/auth.api';
import { chaptersApi } from '@/lib/api/members.api';

interface Chapter { _id: string; name: string; slug: string; country: string; }

export default function RegisterPage() {
  const router = useRouter();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    password: '', country: '', chapter: '',
  });
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    chaptersApi.getAll().then(({ data }) => setChapters(data.data ?? [])).catch(() => {});
  }, []);

  const set = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.register({
        firstName: form.firstName,
        lastName:  form.lastName,
        email:     form.email,
        password:  form.password,
        country:   form.country,
        chapter:   form.chapter || undefined,
      });
      setSuccess(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-stone-950 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-white mb-3">Registration submitted!</h1>
          <p className="text-stone-400 mb-6">
            Check your email to verify your address. Once verified, your application
            will be reviewed by an admin.
          </p>
          <Link href="/login" className="text-amber-400 hover:underline">
            Back to Login
          </Link>
        </div>
      </main>
    );
  }

  const inputCls = "w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-sm placeholder:text-stone-500 focus:outline-none focus:border-amber-400 transition-colors";

  return (
    <main className="min-h-screen bg-stone-950 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-2">OCA-EU</p>
          <h1 className="text-3xl font-bold text-white">Join OCA-EU</h1>
          <p className="text-stone-400 mt-2 text-sm">Apply for membership — approval required</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-300 text-sm font-medium mb-2">First Name</label>
              <input required value={form.firstName} onChange={(e) => set('firstName', e.target.value)} className={inputCls} placeholder="John" />
            </div>
            <div>
              <label className="block text-stone-300 text-sm font-medium mb-2">Last Name</label>
              <input required value={form.lastName} onChange={(e) => set('lastName', e.target.value)} className={inputCls} placeholder="Doe" />
            </div>
          </div>

          <div>
            <label className="block text-stone-300 text-sm font-medium mb-2">Email</label>
            <input type="email" required autoComplete="email" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputCls} placeholder="you@example.com" />
          </div>

          <div>
            <label className="block text-stone-300 text-sm font-medium mb-2">Password</label>
            <input type="password" required autoComplete="new-password" value={form.password} onChange={(e) => set('password', e.target.value)} className={inputCls} placeholder="Min 8 chars, 1 uppercase, 1 number" />
          </div>

          <div>
            <label className="block text-stone-300 text-sm font-medium mb-2">Country of Residence</label>
            <input required value={form.country} onChange={(e) => set('country', e.target.value)} className={inputCls} placeholder="France" />
          </div>

          <div>
            <label className="block text-stone-300 text-sm font-medium mb-2">Chapter <span className="text-stone-500">(optional)</span></label>
            <select value={form.chapter} onChange={(e) => set('chapter', e.target.value)} className={inputCls + ' appearance-none'}>
              <option value="">Select your chapter</option>
              {chapters.map((ch) => (
                <option key={ch._id} value={ch._id}>{ch.name}</option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-white font-semibold rounded-xl py-3 transition-colors">
            {loading ? 'Submitting…' : 'Submit Application'}
          </button>
        </form>

        <p className="text-center text-stone-400 text-sm mt-6">
          Already a member?{' '}
          <Link href="/login" className="text-amber-400 hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
