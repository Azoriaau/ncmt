"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#services", label: "Services" },
  { href: "#journey", label: "How we work" },
  { href: "#coverage", label: "Coverage" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <a href="#" className="font-semibold tracking-tight text-lg">
          NCMT<span className="text-accent">.</span>
        </a>
        <div className="hidden sm:flex items-center gap-8 text-sm text-muted">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="text-background bg-accent hover:bg-accent-dim transition-colors rounded-full px-4 py-1.5 font-medium"
          >
            Get a quote
          </a>
        </div>
      </nav>
    </header>
  );
}
