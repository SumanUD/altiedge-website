import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer>
      <div className="footer">
        <div className="logo">
          {/* <img src="assets/icons/logo.png" alt=""></img> */}
          <h2>altiedge</h2>
        </div>
        <div className="footer-nav">
          <div className="footer-nav-section">
            <div className="footer-heading">Quick Menu</div>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="readiness-test">AltiEdge Readiness Test</Link></li>
              <li><Link href="programs-&-events">Program & Events</Link></li>
              <li><Link href="about-us">About Us</Link></li>
              <li><Link href="/faq">FAQ</Link></li>

            </ul>
          </div>

          <div className="footer-nav-section">
            <div className="footer-heading">connect with us</div>
            <ul>
              <li><Link href="https://www.instagram.com/altiedge/?hl=en">Instagram</Link></li>
              <li><Link href="https://in.linkedin.com/company/altiedge">LinkedIn</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <p className="footer-background">
          altiedge
      </p>
    </footer>
  )
}
