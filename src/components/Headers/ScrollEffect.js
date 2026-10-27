'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Hide the header while scrolling down, reveal it while scrolling up.
 *
 * Movement below this many pixels is treated as jitter rather than intent.
 * Mobile browsers emit a burst of tiny scroll deltas while the URL bar
 * collapses and throughout momentum scrolling; reacting to those was what made
 * the header flicker up and down on every small movement.
 */
const JITTER_THRESHOLD = 8;

/**
 * Below this width the hamburger is the only way to navigate, so the header
 * stays pinned. Hiding it meant that anywhere except the top of the page the
 * menu was simply unreachable until you scrolled back up -- which is what the
 * "hamburger disappears while scrolling" reports were about. Matches the
 * breakpoint in _header.scss where the desktop links collapse.
 */
const PINNED_BELOW = '(max-width: 1250px)';

export default function ScrollEffect() {
  const pathname = usePathname();

  useEffect(() => {
    const nav = document.querySelector('.header-nav');
    if (!nav) return;

    // The previous implementation animated inline `top`. Clear it so a stale
    // value can never fight the class-based transform used below.
    nav.style.top = '';

    let lastScrollY = Math.max(0, window.scrollY);
    let ticking = false;

    const show = () => nav.classList.remove('is-hidden');
    const hide = () => nav.classList.add('is-hidden');

    const update = () => {
      ticking = false;
      // iOS reports negative scrollY while rubber-banding at the top.
      const currentY = Math.max(0, window.scrollY);

      // Never hide where the hamburger is the only navigation available.
      if (window.matchMedia(PINNED_BELOW).matches) {
        show();
        lastScrollY = currentY;
        return;
      }

      // The mobile menu is rendered *inside* this fixed header, so hiding the
      // header drags the open menu -- and the hamburger needed to close it --
      // off screen with it, leaving no way back except reloading the page.
      if (document.body.classList.contains('menu-open')) {
        show();
        lastScrollY = currentY;
        return;
      }

      // Always visible near the top of the page. This is the guarantee that
      // the header can never be permanently lost: scrolling back up always
      // brings it back, whatever state the handler was left in.
      if (currentY <= nav.offsetHeight) {
        show();
        lastScrollY = currentY;
        return;
      }

      const delta = currentY - lastScrollY;
      if (Math.abs(delta) < JITTER_THRESHOLD) return;

      if (delta > 0) hide();
      else show();
      lastScrollY = currentY;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    // Opening the menu has to reveal the header even if it is hidden at that
    // moment, so watch the class the toggle writes rather than duplicating
    // the open/closed state here.
    const bodyObserver = new MutationObserver(() => {
      if (document.body.classList.contains('menu-open')) show();
    });
    bodyObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // `passive` lets the browser scroll without waiting on this handler.
    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      bodyObserver.disconnect();
    };
  }, []);

  // The header lives in the root layout and survives client-side navigation,
  // so a header left hidden on one page stayed hidden on the next one.
  useEffect(() => {
    const nav = document.querySelector('.header-nav');
    if (nav) nav.classList.remove('is-hidden');
  }, [pathname]);

  return null; // No UI
}
