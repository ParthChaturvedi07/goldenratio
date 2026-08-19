"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

/* ────────────────────────────────────────────────────────────
   Client logos from public directory
   ──────────────────────────────────────────────────────────── */
const CLIENT_LOGOS: { name: string; src: string }[] = [
  { name: "Client 1", src: "/images/clients/logo01.png" },
  { name: "Client 2", src: "/images/clients/logo02.png" },
  { name: "Client 3", src: "/images/clients/logo03.png" },
  { name: "Client 4", src: "/images/clients/logo04.png" },
  { name: "Client 5", src: "/images/clients/logo05.png" },
  { name: "Client 6", src: "/images/clients/logo06.png" },
  { name: "Client 7", src: "/images/clients/logo07.png" },
  { name: "Client 8", src: "/images/clients/logo08.png" },
  { name: "Client 9", src: "/images/clients/logo09.png" },
];

export default function ClientLogoTicker() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const labelRef = useRef<HTMLParagraphElement | null>(null);
  const tickerWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
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
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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
              <div key={`${logo.name}-${i}`} className="client-ticker-item flex items-center justify-center px-4">
                <div className="relative w-[120px] h-[60px] md:w-[150px] md:h-[80px]">
                  <Image
                    src={logo.src}
                    alt={logo.name}
                    fill
                    className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                    sizes="(max-width: 768px) 120px, 150px"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
