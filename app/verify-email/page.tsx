'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api/auth.api';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [state, setState] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setState('error');
      setMessage('No verification token found in the URL.');
      return;
    }
    authApi.verifyEmail(token)
      .then(() => {
        setState('success');
        setTimeout(() => router.push('/login'), 3000);
      })
      .catch((err) => {
        setState('error');
        setMessage(err?.response?.data?.message ?? 'Verification failed. The link may have expired.');
      });
  }, [token, router]);

  return (
    <main className="min-h-screen bg-stone-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {state === 'loading' && (
          <>
            <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-stone-300">Verifying your email…</p>
          </>
        )}
        {state === 'success' && (
          <>
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-white mb-2">Email verified!</h1>
            <p className="text-stone-400 mb-4">
              Your account is pending admin approval. You&apos;ll be notified once approved.
            </p>
            <p className="text-stone-500 text-sm">Redirecting to login…</p>
          </>
        )}
        {state === 'error' && (
          <>
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-white mb-2">Verification failed</h1>
            <p className="text-stone-400 mb-6">{message}</p>
            <Link href="/login" className="text-amber-400 hover:underline">Back to Login</Link>
          </>
        )}
      </div>
    </main>
  );
}
