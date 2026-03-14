'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Branch } from '@/lib/types';

gsap.registerPlugin(ScrollTrigger);

function BranchLogoCard({ branch }: { branch: Branch }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const onEnter = () => {
    gsap.to(cardRef.current, { scale: 1.05, duration: 0.32, ease: 'power2.out' });
    gsap.to(imgRef.current, { scale: 1.08, duration: 0.38, ease: 'power2.out' });
    gsap.to(glowRef.current, { opacity: 1, duration: 0.3 });
  };

  const onLeave = () => {
    gsap.to(cardRef.current, { scale: 1, duration: 0.45, ease: 'power2.inOut' });
    gsap.to(imgRef.current, { scale: 1, duration: 0.5, ease: 'power2.inOut' });
    gsap.to(glowRef.current, { opacity: 0, duration: 0.4 });
  };

  return (
    <Link
      ref={cardRef}
      href={`/branches/${branch.slug}`}
      className="branch-logo-card block relative overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-800/60 hover:border-amber-500/40 transition-colors duration-300"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      aria-label={branch.name}
    >
      {/* Ambient glow */}
      <div
        ref={glowRef}
        className="absolute inset-0 opacity-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(245,158,11,0.13), transparent 70%)' }}
      />

      {/* Logo */}
      <div className="aspect-square p-5 sm:p-7 relative">
        <div ref={imgRef} className="relative w-full h-full">
          <Image
            src={branch.logo}
            alt={branch.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain"
          />
        </div>
      </div>
    </Link>
  );
}

export function BranchLogoGrid({ branches }: { branches: Branch[] }) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.branch-logo-card');
      gsap.set(cards, { opacity: 0, y: 48, scale: 0.88 });

      ScrollTrigger.create({
        trigger: gridRef.current,
        start: 'top 82%',
        once: true,
        onEnter: () => {
          gsap.to(cards, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: 'power3.out',
            stagger: { amount: 0.65, from: 'start' },
          });
        },
      });
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
    >
      {branches.map((branch) => (
        <BranchLogoCard key={branch.id} branch={branch} />
      ))}
    </div>
  );
}
