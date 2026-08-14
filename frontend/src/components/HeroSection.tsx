"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import MouseTrail from "./MouseTrail";
import AnimatedLink from "./ui/AnimatedLink";

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
    <div className="bg-[#f5f2ec] h-full pt-16 pb-14">
      {/* Video — curved hero, no overlaid text */}
      <section
        ref={heroRef}
        className="relative h-[45vh] min-h-[450px] overflow-hidden"
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

      <div ref={contentRef} className="pt-8 px-3 md:px-8 md:pt-10">
        {/* Index + Headline (left) / Project Details table (right) */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-16">
          <div className="lg:max-w-[58%]">
            <h1
              ref={headlineRef}
              className="text-black font-bold uppercase leading-[0.92] tracking-[-0.02em]"
              style={{ fontSize: "clamp(2.5rem, 3.7vw, 5rem)" }}
            >
              {/* Where Proportion Meets Clarity <br /> */}
              WE BUILD THE FUTURE IN MINIATURE
            </h1>
          </div>

          <div ref={descriptionRef} className="lg:w-[350px] shrink-0 lg:pt-2">
            <p className="text-black/70 text-md md:text-lg leading-relaxed">
              At Golden Ratio we blend Creativity, Engineering and Detailing to
              design the spaces of tomorrow — from miniature model to built
              reality, every proportion is considered with clarity and intent.
            </p>
          </div>
        </div>

        {/* CTAs — full width, below headline/description row */}
        <div ref={detailsRef} className="mt-8 md:mt-0 flex flex-wrap gap-4">
          <Link
            href="/projects"
            className="px-8 py-4 bg-black text-white rounded-full font-bold uppercase tracking-widest text-xs transition-transform hover:scale-105"
          >
            Our Projects
          </Link>
          <AnimatedLink
            href="/products"
            className="
                group
                relative
                overflow-hidden
                flex
                items-center
                justify-center
                gap-2
                text-black
                hover:text-white
                px-8 py-4 bg-transparent border border-black text-black rounded-full font-bold uppercase tracking-widest text-xs transition-all hover:bg-black/5 hover:scale-105
                "
          >
            Our Products
            <svg
              className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M4 12L12 4M12 4H5M12 4V11" />
            </svg>
          </AnimatedLink>
        </div>
      </div>
    </div>
  );
}