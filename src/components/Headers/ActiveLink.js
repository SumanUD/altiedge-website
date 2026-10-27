'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function ActiveLink() {
  const pathname = usePathname();

  useEffect(() => {    
    const links = document.querySelectorAll('nav a');
    links.forEach(link => {
      if (link.getAttribute('data-href') === pathname) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }, [pathname]);

  return null;
}
