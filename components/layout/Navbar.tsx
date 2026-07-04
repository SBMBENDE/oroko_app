'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { Menu, X, Globe, User, LogOut, LayoutDashboard, ShieldCheck, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_ITEMS, SITE_NAME } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { DonateButton } from '@/components/ui/DonateButton';
import { useAuthStore } from '@/lib/store/authStore';
import { authApi } from '@/lib/api/auth.api';
import Image from 'next/image';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  const handleLogout = async () => {
    await authApi.logout().catch(() => {});
    clearAuth();
    setUserMenuOpen(false);
    router.push('/');
  };

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Animate mobile menu open/close
  useEffect(() => {
    if (!menuRef.current) return;
    if (isOpen) {
      gsap.fromTo(
        menuRef.current,
        { opacity: 0, y: -24, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.38, ease: 'power3.out' }
      );
    } else {
      gsap.to(menuRef.current, {
        opacity: 0,
        y: -24,
        scale: 0.98,
        duration: 0.28,
        ease: 'power3.in',
      });
    }
  }, [isOpen]);

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

          {/* CTA — auth-aware */}
          <div className="hidden md:flex items-center gap-2">
            <DonateButton size="sm" variant={scrolled ? 'solid' : 'outline'} label="Donate" />
            {user ? (
              /* ── Logged-in user menu ── */
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={cn(
                    'flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium transition-colors',
                    scrolled ? 'text-stone-700 hover:bg-stone-100' : 'text-white/90 hover:bg-white/10'
                  )}
                >
                  {user.profilePhoto ? (
                    <Image src={user.profilePhoto} alt={user.firstName} width={28} height={28} className="w-7 h-7 rounded-full object-cover" unoptimized />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold">
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                  )}
                  <span>{user.firstName}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-stone-100 py-1.5 z-50">
                    <div className="px-4 py-2.5 border-b border-stone-100">
                      <p className="text-sm font-semibold text-stone-900">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-stone-400 capitalize">{user.role.replace(/_/g, ' ')}</p>
                    </div>
                    <Link href="/dashboard" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors">
                      <LayoutDashboard className="w-4 h-4 text-stone-400" /> Dashboard
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors">
                        <ShieldCheck className="w-4 h-4 text-amber-500" /> Admin Panel
                      </Link>
                    )}
                    <button onClick={handleLogout}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-stone-100 mt-1">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* ── Logged-out CTA ── */
              <>
                <Button size="sm" variant={scrolled ? 'primary' : 'outline'} asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button size="sm" variant="primary" asChild>
                  <Link href="/register">Join OCA-EU</Link>
                </Button>
              </>
            )}
          </div>

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
          <div
            ref={menuRef}
            className="md:hidden bg-white rounded-2xl shadow-lg mb-4 overflow-hidden border border-stone-100"
            style={{ opacity: 0 }}
          >
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
              {user ? (
                <>
                  <Button size="sm" className="w-full justify-center" asChild>
                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                      <LayoutDashboard className="w-4 h-4 mr-1.5" /> Dashboard
                    </Link>
                  </Button>
                  {isAdmin && (
                    <Button size="sm" variant="outline" className="w-full justify-center" asChild>
                      <Link href="/admin" onClick={() => setIsOpen(false)}>
                        <ShieldCheck className="w-4 h-4 mr-1.5" /> Admin
                      </Link>
                    </Button>
                  )}
                  <button onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="w-full text-sm text-red-600 font-medium py-2 flex items-center justify-center gap-1.5">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Button size="sm" variant="outline" className="w-full justify-center" asChild>
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <User className="w-4 h-4 mr-1.5" /> Sign In
                    </Link>
                  </Button>
                  <Button size="sm" className="w-full justify-center" asChild>
                    <Link href="/register" onClick={() => setIsOpen(false)}>Join OCA-EU</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
