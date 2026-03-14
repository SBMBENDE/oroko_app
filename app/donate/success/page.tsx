'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { Heart, CheckCircle, ArrowRight } from 'lucide-react';

export default function DonationSuccessPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !iconRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(iconRef.current, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' })
        .fromTo('.success-text', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.12 }, '-=0.2')
        .fromTo('.success-cta', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 }, '-=0.1');
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen bg-stone-950 flex items-center justify-center px-4 pt-20">
      <div ref={containerRef} className="max-w-md w-full text-center">
        {/* Animated icon */}
        <div ref={iconRef} className="relative inline-flex mb-8">
          <div className="w-24 h-24 rounded-full bg-amber-600/20 border border-amber-500/30 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-amber-400" />
          </div>
          <span className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <Heart className="w-4 h-4 text-white fill-current" />
          </span>
        </div>

        <h1 className="success-text text-4xl font-bold text-white mb-3" style={{ opacity: 0 }}>
          Thank you!
        </h1>
        <p className="success-text text-stone-300 text-lg leading-relaxed mb-2" style={{ opacity: 0 }}>
          Your donation to OCA-EU has been received.
        </p>
        <p className="success-text text-stone-400 text-sm mb-10" style={{ opacity: 0 }}>
          A confirmation will be sent to your email. Your generosity helps our community thrive.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="success-cta inline-flex items-center justify-center gap-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-3 transition-colors"
            style={{ opacity: 0 }}
          >
            Back to Home <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/projects"
            className="success-cta inline-flex items-center justify-center gap-2 rounded-full border border-stone-700 text-stone-300 hover:border-stone-500 hover:text-white font-medium px-6 py-3 transition-colors"
            style={{ opacity: 0 }}
          >
            See Our Projects
          </Link>
        </div>
      </div>
    </main>
  );
}
