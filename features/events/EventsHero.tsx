'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function EventsHero() {
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(eyebrowRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 })
      .fromTo(headingRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.75 }, '-=0.35')
      .fromTo(bodyRef.current,    { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6  }, '-=0.45');
    return () => { tl.kill(); };
  }, []);

  return (
    <div className="max-w-2xl py-12 text-center md:text-left">
      <p ref={eyebrowRef} className="text-amber-400 text-sm font-medium uppercase tracking-widest mb-3">
        Agenda
      </p>
      <h1 ref={headingRef} className="text-4xl md:text-5xl font-bold mb-4">
        Events
      </h1>
      <p ref={bodyRef} className="text-stone-300 text-lg leading-relaxed">
        From cultural galas to professional workshops, OCA-EU hosts events
        that bring our communities together and create lasting connections.
      </p>
    </div>
  );
}
