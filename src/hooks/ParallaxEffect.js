"use client";

import { useEffect } from "react";

export default function ParallaxEffect() {
  useEffect(() => {
    const parallax = document.querySelectorAll(".parallax-image");
    const speed = 0.45;

    // Ensure initial top = 0
    parallax.forEach((el) => (el.style.top = "0px"));

    const handleScroll = () => {
      parallax.forEach((el) => {
        const dist = window.scrollY - el.offsetTop;
        el.style.top = dist * speed + "px";
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return null; // No JSX output, just attaches effect
}
