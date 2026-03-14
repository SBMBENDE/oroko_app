'use client';

import { useEffect, useRef, RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animateOnScroll, animateCardGrid, addCardHover } from '@/animations';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Animates an element into view when it scrolls into the viewport.
 */
export function useScrollAnimation<T extends HTMLElement>(
  options?: gsap.TweenVars
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      animateOnScroll(ref.current!, options);
    }, ref);
    return () => ctx.revert();
  }, [options]);

  return ref;
}

/**
 * Animates a grid of card children when the container scrolls into view.
 */
export function useCardGridAnimation<T extends HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const cards = ref.current.querySelectorAll<HTMLElement>('[data-card]');
    if (!cards.length) return;
    const ctx = gsap.context(() => {
      animateCardGrid(Array.from(cards));
    }, ref);
    return () => ctx.revert();
  }, []);

  return ref;
}

/**
 * Adds GSAP hover lift effect to a card element.
 */
export function useCardHover<T extends HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    addCardHover(ref.current);
  }, []);

  return ref;
}

/**
 * Page entrance animation.
 */
export function usePageAnimation<T extends HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current!,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return ref;
}
