"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
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

/* ── All available images in /images/ ── */
const ALL_IMAGES = [
  "/images/IMG20250529191734.jpg",
  "/images/IMG20250608163444.jpg",
  "/images/IMG20250830225703.jpg",
  "/images/IMG20250922185808.jpg",
  "/images/IMG20251029190139.jpg",
  "/images/IMG_0615.jpg",
  "/images/IMG_0713.PNG",
  "/images/IMG_0721.JPG",
  "/images/IMG_0727.JPG",
  "/images/IMG_0732.JPG",
  "/images/IMG_0738.JPG",
  "/images/IMG_20210915_191342.jpg",
  "/images/IMG_20221110_172236.jpg",
  "/images/IMG_20230121_190329.jpg",
  "/images/IMG_20230930_221850.jpg",
  "/images/IMG_20240313_115136.jpg",
];

/* ── Pick N random unique items from an array ── */
function pickRandom<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

/* ── Random aspect ratios for variety ── */
const RATIOS = ["16 / 9", "4 / 3", "3 / 2", "1 / 1", "5 / 4", "3 / 4"];
function pickRandomRatios(): string[] {
  return [0, 1, 2].map(() => RATIOS[Math.floor(Math.random() * RATIOS.length)]);
}

/* ── Per-heading image layouts (percentage-based, avoid center) ── */
// Each layout has 3 positions: { top, left, rotate }
// All positions stay near the edges so they never overlap the centered headings.
const LAYOUTS = [
  // Heading 0 — top-left, bottom-right, left-middle
  [
    { top: "6%", left: "5%", },
    { top: "58%", left: "74%", },
    { top: "60%", left: "8%", },
  ],
  // Heading 1 — top-right, bottom-left, right-middle
  [
    { top: "5%", left: "72%", },
    { top: "62%", left: "4%", },
    { top: "55%", left: "76%", },
  ],
  // Heading 2 — top-left + top-right split, bottom-center-right
  [
    { top: "4%", left: "8%" },
    { top: "8%", left: "70%" },
    { top: "62%", left: "68%" },
  ],
  // Heading 3 — left column stacked, one right
  [
    { top: "8%", left: "4%", },
    { top: "55%", left: "6%", },
    { top: "10%", left: "74%", },
  ],
  // Heading 4 — diagonal: top-right, center-left, bottom-right
  [
    { top: "4%", left: "68%", },
    { top: "38%", left: "3%", },
    { top: "58%", left: "72%", },
  ],
];

export default function WhyUsSection() {
  const { isReady } = useSmoothScroll();
  const sectionRef = useRef<HTMLElement | null>(null);
  const whyRef = useRef<HTMLSpanElement | null>(null);
  const usTextRef = useRef<HTMLSpanElement | null>(null);
  const headingsWrapRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  /* ── Image trail state ── */
  const [trailImages, setTrailImages] = useState<string[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const [activeLayout, setActiveLayout] = useState(0);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  /* ── Animate images in/out ── */
  useEffect(() => {
    const layout = LAYOUTS[activeLayout] || LAYOUTS[0];

    imageRefs.current.forEach((ref, i) => {
      if (!ref) return;

      if (isHovering && trailImages.length > 0) {
        gsap.killTweensOf(ref);
        gsap.set(ref, {
          scale: 0.85,
          opacity: 0,
          clipPath: "inset(100% 0% 0% 0%)",
        });
        gsap.to(ref, {
          scale: 1,
          opacity: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.5,
          delay: i * 0.12,
          ease: "power3.out",
        });
      } else {
        gsap.killTweensOf(ref);
        gsap.to(ref, {
          scale: 0.92,
          opacity: 0,
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.6,
          delay: i * 0.06,
          ease: "power2.inOut",
        });
      }
    });
  }, [isHovering, trailImages, activeLayout]);

  /* ── Track mouse for subtle parallax on images ── */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!sectionRef.current || !isHovering) return;
      const bounds = sectionRef.current.getBoundingClientRect();
      // Normalize to -1..1 from center
      const nx = ((e.clientX - bounds.left) / bounds.width - 0.5) * 2;
      const ny = ((e.clientY - bounds.top) / bounds.height - 0.5) * 2;

      // Apply subtle translate shift per image (different depth)
      imageRefs.current.forEach((ref, i) => {
        if (!ref) return;
        const factor = (i + 1) * 6;
        gsap.to(ref, {
          x: nx * factor,
          y: ny * factor,
          duration: 0.8,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    },
    [isHovering]
  );

  /* ── Hover handlers ── */
  const [imageRatios, setImageRatios] = useState<string[]>(["16 / 9", "4 / 3", "3 / 2"]);

  const handleEnter = useCallback((i: number) => {
    setActiveIndex(i);
    setActiveLayout(i % LAYOUTS.length);
    setTrailImages(pickRandom(ALL_IMAGES, 3));
    setImageRatios(pickRandomRatios());
    setIsHovering(true);
  }, []);

  const handleLeave = useCallback(() => {
    setActiveIndex(null);
    setIsHovering(false);
  }, []);

  const handlePointerEnter = useCallback((e: React.PointerEvent, i: number) => {
    if (e.pointerType === "mouse") {
      handleEnter(i);
    }
  }, [handleEnter]);

  const handlePointerLeave = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === "mouse") {
      handleLeave();
    }
  }, [handleLeave]);

  const handleClick = useCallback((i: number) => {
    if (activeIndex === i) {
      handleLeave();
    } else {
      handleEnter(i);
    }
  }, [activeIndex, handleEnter, handleLeave]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      id="why-us-section"
      style={{ minHeight: "100vh", backgroundColor: "#f5f2ec" }}
      onMouseMove={handleMouseMove}
    >
      <div className="relative w-full h-screen">
        {/* ── WHY / US — large ghost text ── */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span
            ref={whyRef}
            className="font-bold uppercase text-black will-change-transform"
            style={{
              fontSize: "clamp(5rem, 14vw, 19rem)",
              letterSpacing: "-0.05em",
              lineHeight: 1,
            }}
          >
            Why
          </span>
          <span
            ref={usTextRef}
            className="font-bold uppercase text-black will-change-transform"
            style={{
              fontSize: "clamp(5rem, 14vw, 19rem)",
              letterSpacing: "-0.05em",
              lineHeight: 1,
              marginLeft: "0.12em",
            }}
          >
            Us ?
          </span>
        </div>

        {/* ── Scattered hover images ── */}
        <div
          className="absolute inset-0 z-[5] pointer-events-none"
          aria-hidden="true"
        >
          {[0, 1, 2].map((i) => {
            const layout = LAYOUTS[activeLayout] || LAYOUTS[0];
            const pos = layout[i];
            return (
              <div
                key={i}
                ref={(el) => {
                  imageRefs.current[i] = el;
                }}
                className="absolute will-change-transform"
                style={{
                  top: pos.top,
                  left: pos.left,
                  width: "clamp(140px, 20vw, 320px)",
                  aspectRatio: imageRatios[i] || "16 / 9",
                  borderRadius: "20px",
                  overflow: "hidden",
                  opacity: 0,
                  boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                  transition: "top 1.2s cubic-bezier(0.22,1,0.36,1), left 1.2s cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                {trailImages[i] && (
                  <Image
                    src={trailImages[i]}
                    alt=""
                    fill
                    sizes="200px"
                    style={{ objectFit: "cover" }}
                    quality={75}
                    priority={false}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* ── Center headings (absolute-centered so nothing pushes them) ── */}
        <div
          ref={headingsWrapRef}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center"
        >
          <p className="md:hidden text-black/40 text-[10px] font-mono tracking-[0.2em] uppercase mb-8 opacity-70">
            [ Tap headings to reveal ]
          </p>
          <div className="flex flex-col items-center gap-2 md:gap-3 lg:gap-4">
            {WHY_US_ITEMS.map((item, i) => (
              <div
                key={item.heading}
                className="why-us-row"
                style={{ opacity: 0 }}
              >
                <h3
                  className="why-us-heading font-bold uppercase text-center cursor-pointer select-none"
                  style={{
                    fontSize: "clamp(1.8rem, 3.4vw, 2.6rem)",
                    letterSpacing: "-0.06em",
                    lineHeight: 1,
                    color:
                      activeIndex === null || activeIndex === i
                        ? "#1a1a1a"
                        : "rgba(26, 26, 26, 0.15)",
                  }}
                  onPointerEnter={(e) => handlePointerEnter(e, i)}
                  onPointerLeave={handlePointerLeave}
                  onClick={() => handleClick(i)}
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
              fontSize: "clamp(0.85rem, 1.7vw, 1rem)",
              letterSpacing: "0.08em",
              color: "rgba(0, 0, 0, 0.85)",
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
