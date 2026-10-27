"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.lenis) {
      // Use Lenis's native scroll method
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      // Fallback for no smooth scroll
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        });
      });
    }
  }, [pathname]);

  return null;
}
