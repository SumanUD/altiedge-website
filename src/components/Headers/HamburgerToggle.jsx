'use client'
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export const HamburgerToggle = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleOpenMenu = () => {
    setMenuOpen(!menuOpen);
    document.body.classList.toggle("menu-open", !menuOpen);
  };

  // Close menu automatically on route change
  useEffect(() => {
    document.body.classList.remove("menu-open");
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div className="hamburger-menu">
      <div
        className={`hamburger ${menuOpen ? 'is-active' : ''}`}
        id="hamburger-1"
        onClick={handleOpenMenu}
      >
        <span className="line"></span>
        <span className="line"></span>
        <span className="line"></span>
      </div>
    </div>
  );
};
