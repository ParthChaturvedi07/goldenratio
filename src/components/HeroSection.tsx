"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import MouseTrail from "./MouseTrail";

export default function HeroSection() {
  const heroRef = useRef<HTMLElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const whiteWashRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // ── Media (video) slides DOWN from above + fades in ──
      if (mediaRef.current) {
        gsap.set(mediaRef.current, { yPercent: -8, opacity: 0, scale: 1.08 });
        tl.to(
          mediaRef.current,
          { yPercent: 0, opacity: 1, scale: 1, duration: 1.8 },
          0.1
        );
      }

      // ── White wash fades in after media arrives ──
      if (whiteWashRef.current) {
        gsap.set(whiteWashRef.current, { opacity: 0 });
        tl.to(whiteWashRef.current, { opacity: 1, duration: 1.2 }, 0.6);
      }

      // ── Headline slides UP from below + fades in ──
      if (headlineRef.current) {
        gsap.set(headlineRef.current, { y: 80, opacity: 0 });
        tl.to(
          headlineRef.current,
          { y: 0, opacity: 1, duration: 1.2 },
          0.5
        );
      }

      // ── Subtitle slides UP from below + fades in (slight delay) ──
      if (subtitleRef.current) {
        gsap.set(subtitleRef.current, { y: 50, opacity: 0 });
        tl.to(
          subtitleRef.current,
          { y: 0, opacity: 1, duration: 1 },
          0.8
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full h-dvh min-h-[600px] overflow-hidden"
      id="hero-section"
    >
      {/* Background Video — slides from top */}
      <div ref={mediaRef} className="absolute inset-0">
        <video
          src="/video/hero-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="object-cover w-full h-full"
        />
      </div>

      {/* Gradient overlay for text readability */}
      <div className="hero-gradient absolute inset-0 z-[2]" />

      {/* White blurry fade at top — strong like abvtek.com */}
      <div
        ref={whiteWashRef}
        className="absolute top-0 left-0 right-0 z-[3] pointer-events-none hero-top-fade"
      />

      {/* Mouse trail effect (desktop only) */}
      <MouseTrail containerRef={heroRef} />

      {/* Content — slides from bottom */}
      <div
        ref={contentRef}
        className="absolute inset-0 z-20 flex flex-col justify-end px-6 md:px-10 lg:px-12 pb-6 md:pb-10 lg:pb-12"
      >
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 lg:gap-8">
          {/* Headline */}
          <h1
            ref={headlineRef}
            className="text-white font-bold uppercase leading-[0.92] tracking-[-0.02em]"
            style={{
              fontSize: "clamp(2rem, 4vw, 5.5rem)",
              maxWidth: "75%",
            }}
          >
            WHERE DESIGN MEET DATA WHERE IDEAS BECOME BUILT REALITIES
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-white/90 text-xs md:text-sm uppercase tracking-[0.04em] leading-relaxed max-w-[300px] shrink-0 lg:text-right lg:self-end lg:pb-1"
          >
            At AbvTek, we blend innovation and
            <br className="hidden lg:block" /> intelligence to design the spaces
            of tomorrow
          </p>
        </div>
      </div>
    </section>
  );
}
