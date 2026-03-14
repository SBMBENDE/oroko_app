'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_ITEMS, SITE_NAME } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { DonateButton } from '@/components/ui/DonateButton';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-100'
          : 'bg-transparent'
      )}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span
              className={cn(
                'font-bold text-lg tracking-tight transition-colors',
                scrolled ? 'text-stone-900' : 'text-white'
              )}
            >
              {SITE_NAME}
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    scrolled
                      ? 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-2">
            <DonateButton
              size="sm"
              variant={scrolled ? 'solid' : 'outline'}
              label="Donate"
            />
            <Button size="sm" variant={scrolled ? 'primary' : 'outline'}>
              Join OCA-EU
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className={cn('w-5 h-5', scrolled ? 'text-stone-900' : 'text-white')} />
            ) : (
              <Menu className={cn('w-5 h-5', scrolled ? 'text-stone-900' : 'text-white')} />
            )}
          </button>
        </div>

        {/* Mobile nav */}
        {isOpen && (
          <div className="md:hidden bg-white rounded-2xl shadow-lg mb-4 overflow-hidden border border-stone-100">
            <ul className="py-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="px-4 py-3 border-t border-stone-100 flex flex-col gap-2">
              <DonateButton size="sm" label="Donate" className="w-full justify-center" />
              <Button size="sm" className="w-full justify-center">
                Join OCA-EU
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
