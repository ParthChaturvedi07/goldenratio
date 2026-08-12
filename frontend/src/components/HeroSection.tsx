"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import MouseTrail from "./MouseTrail";

export default function HeroSection({ isPreloaderDone = true }: { isPreloaderDone?: boolean }) {
  const heroRef = useRef<HTMLElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const indexRef = useRef<HTMLSpanElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const detailsRef = useRef<HTMLDivElement | null>(null);
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial states
      if (mediaRef.current) gsap.set(mediaRef.current, { yPercent: -8, opacity: 0, scale: 1.08 });
      if (indexRef.current) gsap.set(indexRef.current, { opacity: 0, y: 12 });
      if (headlineRef.current) gsap.set(headlineRef.current, { y: 60, opacity: 0 });
      if (detailsRef.current) gsap.set(detailsRef.current, { y: 20, opacity: 0 });
      if (descriptionRef.current) gsap.set(descriptionRef.current, { y: 20, opacity: 0 });

      if (!isPreloaderDone) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // ── Media (video) slides DOWN from above + fades in ──
      if (mediaRef.current) {
        tl.to(mediaRef.current, { yPercent: 0, opacity: 1, scale: 1, duration: 1.8 }, 0.1);
      }

      // ── Index label fades in ──
      if (indexRef.current) {
        tl.to(indexRef.current, { y: 0, opacity: 1, duration: 0.6 }, 0.9);
      }

      // ── Headline slides UP from below + fades in ──
      if (headlineRef.current) {
        tl.to(headlineRef.current, { y: 0, opacity: 1, duration: 1.1 }, 1.0);
      }

      // ── Details table fades in ──
      if (detailsRef.current) {
        tl.to(detailsRef.current, { y: 0, opacity: 1, duration: 0.9 }, 1.15);
      }

      // ── Description slides UP from below + fades in ──
      if (descriptionRef.current) {
        tl.to(descriptionRef.current, { y: 0, opacity: 1, duration: 0.9 }, 1.3);
      }
    }, heroRef);

    return () => ctx.revert();
  }, [isPreloaderDone]);

  return (
    <div className="bg-[#f5f2ec] h-full px-6 pt-16 pb-14">
      {/* Video — curved hero, no overlaid text */}
      <section
        ref={heroRef}
        className="relative rounded-xl max-w-[97.5%] mx-auto h-[45vh] min-h-[500px] overflow-hidden"
        id="hero-section"
      >
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

        {/* Mouse trail effect (desktop only) */}
        {/* <MouseTrail containerRef={heroRef} /> */}
      </section>

      <div ref={contentRef} className="pt-10 px-3 md:px-8 md:pt-14 mt-8">
        {/* Index + Headline (left) / Project Details table (right) */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-16">
          <div className="lg:max-w-[58%]">
            <h1
              ref={headlineRef}
              className="text-black font-bold uppercase leading-[0.92] tracking-[-0.02em]"
              style={{ fontSize: "clamp(2rem, 3.7vw, 5rem)" }}
            >
              WHERE PROPORTION MEETS CLARITY FROM MINIATURE TO REALITY
            </h1>
          </div>

          <div ref={detailsRef} className="lg:w-[300px] shrink-0 lg:pt-2">
            <dl className="text-md md:text-lg text-black/80">
              <div className="flex justify-between py-2 border-t border-black/10">
                <dt className="text-black/50">Category</dt>
                <dd className="text-right max-w-[65%]">Architectural Visualization</dd>
              </div>
              <div className="flex justify-between py-2 border-t border-black/10">
                <dt className="text-black/50">Services</dt>
                <dd className="text-right max-w-[65%]">
                  Creativity, Engineering &amp; Detailing
                </dd>
              </div>
              <div className="flex justify-between py-2 border-t border-b border-black/10">
                <dt className="text-black/50">Year</dt>
                <dd className="text-right">2025</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Description — full width, below headline/details row */}
        <p
          ref={descriptionRef}
          className="mt-8 lg:mt-10 max-w-2xl text-black/70 text-md md:text-lg leading-relaxed"
        >
          At Golden Ratio we blend Creativity, Engineering and Detailing to
          design the spaces of tomorrow — from miniature model to built
          reality, every proportion is considered with clarity and intent.
        </p>
      </div>
    </div>
  );
}