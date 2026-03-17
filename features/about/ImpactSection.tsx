'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, MapPin, Globe, Calendar } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { icon: Users,    target: 800, suffix: '+', label: 'Active Members',  desc: 'Registered across all chapters' },
  { icon: MapPin,   target: 10,  suffix: '',  label: 'Chapters',        desc: 'Active chapters across Europe' },
  { icon: Globe,    target: 6,   suffix: '+', label: 'Countries',       desc: 'Nations with OCA-EU presence' },
  { icon: Calendar, target: 15,  suffix: '+', label: 'Events / Year',   desc: 'Cultural gatherings annually' },
];

export function ImpactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const numRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const tweens = stats.map((stat, i) => {
      const el = numRefs.current[i];
      if (!el) return null;

      const obj = { val: 0 };
      return gsap.to(obj, {
        val: stat.target,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
        onUpdate() {
          el.textContent = Math.round(obj.val) + stat.suffix;
        },
        onComplete() {
          el.textContent = stat.target + stat.suffix;
        },
      });
    });

    return () => {
      tweens.forEach(t => t?.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-14 md:py-20 bg-zinc-900 border-y border-zinc-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3 block">
            Our Impact
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Uniting Oroko Sons & Daughters across Europe.
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-800 rounded-2xl overflow-hidden">
          {stats.map(({ icon: Icon, suffix, label, desc }, i) => (
            <div key={label} className="bg-zinc-900 p-6 md:p-8 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-amber-600/15 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-amber-400" />
              </div>
              <span
                ref={el => { numRefs.current[i] = el; }}
                className="text-4xl md:text-5xl font-bold text-amber-400 leading-none block mb-1"
              >
                0{suffix}
              </span>
              <span className="text-white font-semibold text-sm uppercase tracking-wide block mb-1">{label}</span>
              <span className="text-zinc-500 text-xs leading-relaxed hidden md:block">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
