"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSmoothScroll } from "./SmoothScrollProvider";

gsap.registerPlugin(ScrollTrigger);

/* ────────────────────────────────────────────────────────────
   Inline SVG logos – monochromatic marks for a premium feel.
   Replace these with actual client logos when available.
   ──────────────────────────────────────────────────────────── */
const CLIENT_LOGOS: { name: string; svg: React.ReactNode }[] = [
  {
    name: "Prestige Estates",
    svg: (
      <svg viewBox="0 0 180 48" fill="currentColor" className="client-logo-svg">
        <path d="M8 38V10h8.5c2.5 0 4.5.7 5.9 2 1.4 1.3 2.1 3.1 2.1 5.2 0 2.2-.7 3.9-2.1 5.2-1.4 1.3-3.4 2-5.9 2H12.5v13.6H8zM12.5 21h4c1.4 0 2.5-.4 3.3-1.1.8-.8 1.2-1.8 1.2-3.1 0-1.3-.4-2.3-1.2-3.1-.8-.8-1.9-1.1-3.3-1.1h-4V21z" />
        <text x="30" y="32" fontSize="15" fontWeight="600" letterSpacing="0.12em" fill="currentColor" fontFamily="sans-serif">PRESTIGE</text>
        <text x="30" y="44" fontSize="7" letterSpacing="0.3em" fill="currentColor" fontFamily="sans-serif" opacity="0.6">ESTATES</text>
      </svg>
    ),
  },
  {
    name: "Meridian Group",
    svg: (
      <svg viewBox="0 0 180 48" fill="currentColor" className="client-logo-svg">
        <polygon points="8,38 14,10 20,28 26,10 32,38" strokeWidth="0" />
        <text x="38" y="30" fontSize="14" fontWeight="500" letterSpacing="0.08em" fill="currentColor" fontFamily="sans-serif">MERIDIAN</text>
        <line x1="38" y1="34" x2="110" y2="34" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
        <text x="38" y="42" fontSize="7" letterSpacing="0.25em" fill="currentColor" fontFamily="sans-serif" opacity="0.55">GROUP</text>
      </svg>
    ),
  },
  {
    name: "Aura Developers",
    svg: (
      <svg viewBox="0 0 180 48" fill="currentColor" className="client-logo-svg">
        <circle cx="16" cy="24" r="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="16" cy="24" r="6" fill="currentColor" opacity="0.25" />
        <text x="34" y="28" fontSize="15" fontWeight="600" letterSpacing="0.1em" fill="currentColor" fontFamily="sans-serif">AURA</text>
        <text x="34" y="40" fontSize="6.5" letterSpacing="0.3em" fill="currentColor" fontFamily="sans-serif" opacity="0.5">DEVELOPERS</text>
      </svg>
    ),
  },
  {
    name: "Horizon Architects",
    svg: (
      <svg viewBox="0 0 200 48" fill="currentColor" className="client-logo-svg">
        <rect x="6" y="16" width="24" height="2" fill="currentColor" />
        <rect x="6" y="23" width="18" height="2" fill="currentColor" opacity="0.6" />
        <rect x="6" y="30" width="24" height="2" fill="currentColor" />
        <text x="38" y="28" fontSize="13" fontWeight="500" letterSpacing="0.1em" fill="currentColor" fontFamily="sans-serif">HORIZON</text>
        <text x="38" y="39" fontSize="6.5" letterSpacing="0.28em" fill="currentColor" fontFamily="sans-serif" opacity="0.5">ARCHITECTS</text>
      </svg>
    ),
  },
  {
    name: "Nexus Realty",
    svg: (
      <svg viewBox="0 0 180 48" fill="currentColor" className="client-logo-svg">
        <path d="M8 38V10h4l12 20V10h4v28h-4L12 18v20H8z" />
        <text x="34" y="30" fontSize="14" fontWeight="500" letterSpacing="0.1em" fill="currentColor" fontFamily="sans-serif">NEXUS</text>
        <text x="34" y="41" fontSize="6.5" letterSpacing="0.3em" fill="currentColor" fontFamily="sans-serif" opacity="0.5">REALTY</text>
      </svg>
    ),
  },
  {
    name: "Vertex Studios",
    svg: (
      <svg viewBox="0 0 180 48" fill="currentColor" className="client-logo-svg">
        <polygon points="16,8 28,40 4,40" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <polygon points="16,18 22,34 10,34" fill="currentColor" opacity="0.15" />
        <text x="36" y="28" fontSize="14" fontWeight="600" letterSpacing="0.08em" fill="currentColor" fontFamily="sans-serif">VERTEX</text>
        <text x="36" y="40" fontSize="6.5" letterSpacing="0.28em" fill="currentColor" fontFamily="sans-serif" opacity="0.5">STUDIOS</text>
      </svg>
    ),
  },
  {
    name: "Atlas Infra",
    svg: (
      <svg viewBox="0 0 180 48" fill="currentColor" className="client-logo-svg">
        <path d="M4 38L16 10l12 28h-5l-3-7H12l-3 7H4zm10.5-11h7L18 18l-3.5 9z" />
        <text x="36" y="28" fontSize="14" fontWeight="500" letterSpacing="0.1em" fill="currentColor" fontFamily="sans-serif">ATLAS</text>
        <text x="36" y="40" fontSize="7" letterSpacing="0.25em" fill="currentColor" fontFamily="sans-serif" opacity="0.5">INFRA</text>
      </svg>
    ),
  },
  {
    name: "Elevate Design Co",
    svg: (
      <svg viewBox="0 0 200 48" fill="currentColor" className="client-logo-svg">
        <rect x="6" y="10" width="22" height="28" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <rect x="10" y="14" width="14" height="10" rx="1" fill="currentColor" opacity="0.15" />
        <text x="36" y="27" fontSize="12" fontWeight="600" letterSpacing="0.06em" fill="currentColor" fontFamily="sans-serif">ELEVATE</text>
        <text x="36" y="39" fontSize="6" letterSpacing="0.3em" fill="currentColor" fontFamily="sans-serif" opacity="0.5">DESIGN CO.</text>
      </svg>
    ),
  },
];

export default function ClientLogoTicker() {
  const { isReady } = useSmoothScroll();
  const sectionRef = useRef<HTMLElement | null>(null);
  const labelRef = useRef<HTMLParagraphElement | null>(null);
  const tickerWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isReady) return;

    const scrollContainer = document.querySelector(
      "#smooth-scroll-container"
    ) as HTMLElement;

    const ctx = gsap.context(() => {
      /* ── Label fade-in ── */
      if (labelRef.current) {
        gsap.fromTo(
          labelRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              scroller: scrollContainer,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      /* ── Ticker track fade-in ── */
      if (tickerWrapRef.current) {
        gsap.fromTo(
          tickerWrapRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              scroller: scrollContainer,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isReady]);

  /* We duplicate the list 4× so the CSS animation has enough content to
     scroll infinitely without visible gaps. */
  const repeatedLogos = [
    ...CLIENT_LOGOS,
    ...CLIENT_LOGOS,
    ...CLIENT_LOGOS,
    ...CLIENT_LOGOS,
  ];

  return (
    <section
      ref={sectionRef}
      className="relative z-10 bg-[#f5f2ec] overflow-hidden"
      id="client-logos-section"
    >
      {/* ── Subtle top divider ── */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 xl:px-20">
        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(0,0,0,0.4) 20%, rgba(0,0,0,0.4) 80%, transparent)",
          }}
        />
      </div>

      <div className="py-14 md:py-20 lg:py-24">
        {/* ── Label ── */}
        <p
          ref={labelRef}
          className="text-center text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-black/85 font-medium mb-10 md:mb-14"
          style={{ opacity: 0 }}
        >
          Trusted By Industry Leaders
        </p>

        {/* ── Ticker ── */}
        <div
          ref={tickerWrapRef}
          className="client-ticker-wrap"
          style={{ opacity: 0 }}
        >
          {/* Fade masks on edges */}
          <div className="client-ticker-mask-left" />
          <div className="client-ticker-mask-right" />

          <div className="client-ticker-track" aria-hidden="true">
            {repeatedLogos.map((logo, i) => (
              <div key={`${logo.name}-${i}`} className="client-ticker-item">
                {logo.svg}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
