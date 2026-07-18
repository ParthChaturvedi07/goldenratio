"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSmoothScroll } from "./SmoothScrollProvider";

gsap.registerPlugin(ScrollTrigger);

/* ── Content ─────────────────────────────────────────────── */
const WHY_US_ITEMS = [
  {
    heading: "Design + Model Under One Roof",
    description:
      "From design concept to physical model, we handle everything.",
  },
  {
    heading: "Precision & Detailing",
    description:
      "Scale accuracy from 1:50 to 1:300 with lighting and textures.",
  },
  {
    heading: "Client-Centric",
    description:
      "Designs focused on functionality, budget, and brand identity.",
  },
  {
    heading: "Expert Team",
    description:
      "Interior Designers, 3D Artists, Engineers & Master Model Makers.",
  },
  {
    heading: "On-Time Delivery",
    description:
      "Dedicated project tracking for interiors and models.",
  },
];

export default function WhyUsSection() {
  const { isReady } = useSmoothScroll();
  const sectionRef = useRef<HTMLElement | null>(null);
  const whyRef = useRef<HTMLSpanElement | null>(null);
  const usTextRef = useRef<HTMLSpanElement | null>(null);
  const headingsWrapRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  /* ── GSAP scroll-driven animation ── */
  useEffect(() => {
    if (!isReady) return;

    const scrollContainer = document.querySelector(
      "#smooth-scroll-container"
    ) as HTMLElement;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          scroller: scrollContainer,
          start: "top top",
          end: "+=200%",
          pin: true,
          pinType: "transform",
          scrub: 1,
          anticipatePin: 1,
        },
      });

      /* ── Phase 1: Split "WHY" left, "US" right & fade them ── */
      tl.to(
        whyRef.current,
        {
          xPercent: -110,
          opacity: 0.08,
          duration: 1,
          ease: "power2.inOut",
        },
        0
      );

      tl.to(
        usTextRef.current,
        {
          xPercent: 110,
          opacity: 0.08,
          duration: 1,
          ease: "power2.inOut",
        },
        0
      );

      /* ── Phase 2: Stagger headings up from below ── */
      if (headingsWrapRef.current) {
        const items =
          headingsWrapRef.current.querySelectorAll(".why-us-row");
        tl.fromTo(
          items,
          { y: 700, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.02,
            duration: 0.55,
            ease: "power2.inOut",
          },
          0.2
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isReady]);

  /* ── Hover handlers ── */
  const handleEnter = useCallback((i: number) => setActiveIndex(i), []);
  const handleLeave = useCallback(() => setActiveIndex(null), []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      id="why-us-section"
      style={{ minHeight: "100vh", backgroundColor: "#f5f2ec" }}
    >
      <div className="relative w-full h-screen">
        {/* ── WHY / US — large ghost text ── */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span
            ref={whyRef}
            className="font-bold uppercase text-black will-change-transform"
            style={{
              fontSize: "clamp(5rem, 14vw, 13rem)",
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}
          >
            Why
          </span>
          <span
            ref={usTextRef}
            className="font-bold uppercase text-black will-change-transform"
            style={{
              fontSize: "clamp(5rem, 14vw, 13rem)",
              letterSpacing: "-0.04em",
              lineHeight: 1,
              marginLeft: "0.12em",
            }}
          >
            Us
          </span>
        </div>

        {/* ── Center headings (absolute-centered so nothing pushes them) ── */}
        <div
          ref={headingsWrapRef}
          className="absolute inset-0 z-10 flex items-center justify-center"
        >
          <div className="flex flex-col items-center gap-2 md:gap-3 lg:gap-4">
            {WHY_US_ITEMS.map((item, i) => (
              <div
                key={item.heading}
                className="why-us-row"
                style={{ opacity: 0 }}
              >
                <h3
                  className="why-us-heading font-bold uppercase text-center cursor-pointer"
                  style={{
                    fontSize: "clamp(1.1rem, 3.2vw, 2.6rem)",
                    letterSpacing: "-0.01em",
                    lineHeight: 1,
                    color:
                      activeIndex === null || activeIndex === i
                        ? "#1a1a1a"
                        : "rgba(26, 26, 26, 0.15)",
                  }}
                  onMouseEnter={() => handleEnter(i)}
                  onMouseLeave={handleLeave}
                >
                  {item.heading}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* ── Hover description (pinned to bottom of viewport) ── */}
        <div className="absolute bottom-10 md:bottom-14 lg:bottom-16 left-0 right-0 z-10 flex justify-center px-8">
          <p
            className="text-center max-w-[520px] leading-relaxed font-light uppercase"
            style={{
              fontSize: "clamp(0.65rem, 1.1vw, 0.8rem)",
              letterSpacing: "0.08em",
              color: "rgba(0, 0, 0, 0.5)",
              opacity: activeIndex !== null ? 1 : 0,
              transform:
                activeIndex !== null
                  ? "translateY(0)"
                  : "translateY(12px)",
              transition:
                "opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1), transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {activeIndex !== null
              ? WHY_US_ITEMS[activeIndex].description
              : "\u00A0"}
          </p>
        </div>
      </div>
    </section>
  );
}
