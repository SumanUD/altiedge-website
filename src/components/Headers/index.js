'use client'

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../assets/icons/logo.webp';
import { HamburgerToggle } from './HamburgerToggle';
import ScrollEffect from './ScrollEffect';
import ActiveLink from './ActiveLink';

export const Header = () => {
  const pathname = usePathname().replace(/\/$/, '');
  const links = [
    { href: '/', name: 'Home' },
    { href: '/about-us', name: 'About Us' },
    { href: '/readiness-test', name: 'AltiEdge Readiness Test' },
    { href: '/programs-&-events', name: 'Programs & Events' },
    { href: '/blogs', name: 'Blogs' },
    // { href: '/blogs', name: 'Get In Touch' },
  ];

  return (
    <nav className="header-nav">
      <div className="navigation">
        <div className="logo">
          <Link href="/">
            <Image src={logo} alt="logo" width={50} height={50} />
          </Link>
        </div>
        <div className="menu-section">
          <ul>
            {links.map((link) => (
              <li key={link.href}>
                <Link 
                  href={link.href}
                  className={pathname === link.href ? 'active' : ''}
                >
                  {link.name}
                </Link>
              </li>
            ))}

            <li>
               <Link href="/contact-us" className='onlyMobile'>
                <button className="get-in-touch">Get In Touch</button>
              </Link>
            </li>
          </ul>

          
        </div>
        <HamburgerToggle />
        <div className="action-section">
          <Link href="/contact-us">
            <button className="get-in-touch">Get In Touch</button>
          </Link>
        </div>
      </div>
      <ScrollEffect />
      <ActiveLink />
    </nav>
  );
};
