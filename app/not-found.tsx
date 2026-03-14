import Link from 'next/link';
import { Globe } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-stone-950 text-white flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-amber-600/20 flex items-center justify-center mb-6">
        <Globe className="w-8 h-8 text-amber-500" />
      </div>
      <h1 className="text-7xl font-bold text-amber-400 mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-3">Page Not Found</h2>
      <p className="text-stone-400 max-w-sm mb-8">
        Sorry, we couldn&apos;t find the page you were looking for. It may have
        moved or no longer exists.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 font-medium transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
