'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Page Transitions ─────────────────────────────────────────────────────────

export function animatePageIn(node: HTMLElement) {
  return gsap.fromTo(
    node,
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
  );
}

export function animatePageOut(node: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    gsap.to(node, {
      opacity: 0,
      y: -24,
      duration: 0.4,
      ease: 'power3.in',
      onComplete: resolve,
    });
  });
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

export function animateHero(
  headline: HTMLElement,
  subtitle: HTMLElement,
  cta: HTMLElement
) {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.fromTo(headline, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.9 })
    .fromTo(subtitle, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
    .fromTo(cta, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5 }, '-=0.4');
  return tl;
}

// ─── Scroll Animations ────────────────────────────────────────────────────────

export function animateOnScroll(
  elements: HTMLElement | HTMLElement[] | NodeList,
  options?: gsap.TweenVars
) {
  const defaults: gsap.TweenVars = {
    opacity: 0,
    y: 40,
    duration: 0.7,
    ease: 'power3.out',
    stagger: 0.12,
    scrollTrigger: {
      trigger: Array.isArray(elements)
        ? (elements as HTMLElement[])[0]
        : (elements as HTMLElement),
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  };

  return gsap.fromTo(
    elements,
    { opacity: 0, y: 40 },
    { ...defaults, ...options }
  );
}

export function animateSectionTitle(element: HTMLElement) {
  return gsap.fromTo(
    element,
    { opacity: 0, x: -30 },
    {
      opacity: 1,
      x: 0,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
      },
    }
  );
}

// ─── Card Hover ───────────────────────────────────────────────────────────────

export function addCardHover(card: HTMLElement) {
  card.addEventListener('mouseenter', () => {
    gsap.to(card, { y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.12)', duration: 0.3, ease: 'power2.out' });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { y: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.06)', duration: 0.3, ease: 'power2.out' });
  });
}

// ─── Staggered Grid ──────────────────────────────────────────────────────────

export function animateCardGrid(cards: NodeList | HTMLElement[]) {
  return gsap.fromTo(
    cards,
    { opacity: 0, y: 50, scale: 0.95 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: (cards as HTMLElement[])[0],
        start: 'top 85%',
      },
    }
  );
}

// ─── Counter Animation ────────────────────────────────────────────────────────

export function animateCounter(element: HTMLElement, end: number, duration = 2) {
  const obj = { value: 0 };
  return gsap.to(obj, {
    value: end,
    duration,
    ease: 'power1.out',
    onUpdate: () => {
      element.textContent = Math.round(obj.value).toLocaleString();
    },
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
      once: true,
    },
  });
}
