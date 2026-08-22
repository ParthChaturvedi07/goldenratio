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
      
      const words = headlineRef.current?.querySelectorAll(".headline-word");
      if (words && words.length > 0) {
        gsap.set(words, { yPercent: 100, opacity: 0 });
      }
      
      if (detailsRef.current) gsap.set(detailsRef.current, { y: 20, opacity: 0 });
      
      const descWords = descriptionRef.current?.querySelectorAll(".desc-word");
      if (descWords && descWords.length > 0) {
        gsap.set(descWords, { yPercent: 100, opacity: 0 });
      }

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

      // ── Headline words slide UP from below mask ──
      const animatingWords = headlineRef.current?.querySelectorAll(".headline-word");
      if (animatingWords && animatingWords.length > 0) {
        tl.to(
          animatingWords,
          { yPercent: 0, opacity: 1, duration: 1, stagger: 0.08, ease: "power4.out" },
          1.0
        );
      }

      // ── Details table fades in ──
      if (detailsRef.current) {
        tl.to(detailsRef.current, { y: 0, opacity: 1, duration: 0.9 }, 1.15);
      }

      // ── Description words slide UP from below mask (parallel) ──
      const descAnimatingWords = descriptionRef.current?.querySelectorAll(".desc-word");
      if (descAnimatingWords && descAnimatingWords.length > 0) {
        tl.to(
          descAnimatingWords,
          { yPercent: 0, opacity: 1, duration: 1, stagger: 0.03, ease: "power4.out" },
          1.0
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, [isPreloaderDone]);

  return (
    <div className="bg-[#f5f2ec] h-full pt-16 pb-4">
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

      <div ref={contentRef} className="pt-8 px-6 md:px-12 md:pt-10">
        {/* Index + Headline (left) / Project Details table (right) */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-16">
          <div className="lg:max-w-[58%]">
            <h1
              ref={headlineRef}
              className="text-black font-bold uppercase leading-[0.92] tracking-[-0.02em] flex flex-wrap"
              style={{ fontSize: "clamp(2.5rem, 3.7vw, 5rem)" }}
            >
              {"WE BUILD THE FUTURE IN MINIATURE".split(" ").map((word, i) => (
                <span
                  key={i}
                  className="overflow-hidden inline-block pb-[0.1em] mr-[0.25em]"
                >
                  <span className="headline-word inline-block origin-bottom">
                    {word}
                  </span>
                </span>
              ))}
            </h1>
          </div>

          <div ref={descriptionRef} className="lg:w-[350px] shrink-0 lg:pt-2">
            <p className="text-black/70 text-md md:text-lg leading-relaxed flex flex-wrap">
              {"We turn buildings, factories, and big ideas into detailed miniature models you can see, understand, and experience".split(" ").map((word, i) => (
                <span
                  key={i}
                  className="overflow-hidden inline-block pb-[0.1em] mr-[0.25em]"
                >
                  <span className="desc-word inline-block origin-bottom">
                    {word}
                  </span>
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* CTAs — full width, below headline/description row */}
        <div ref={detailsRef} className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/projects"
            className="shrink-0 whitespace-nowrap px-8 py-4 bg-black text-white rounded-full font-bold uppercase tracking-widest text-xs transition-transform hover:scale-105"
          >
            Our Projects
          </Link>
          <AnimatedLink
            href="/products"
            className="
                shrink-0
                whitespace-nowrap
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