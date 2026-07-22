"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSmoothScroll } from "./SmoothScrollProvider";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const { isReady } = useSmoothScroll();
  const sectionRef = useRef<HTMLElement | null>(null);
  const imageWrapperRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const taglineRef = useRef<HTMLParagraphElement | null>(null);
  const aboutTextRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    // Wait until Locomotive Scroll is ready so scrollerProxy is wired
    if (!isReady) return;

    const scrollContainer = document.querySelector(
      "#smooth-scroll-container"
    ) as HTMLElement;

    const ctx = gsap.context(() => {
      // ── Parallax: image moves DOWN as section scrolls UP ──
      if (imageRef.current && sectionRef.current) {
        gsap.fromTo(
          imageRef.current,
          { yPercent: -20 },
          {
            yPercent: 20,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              scroller: scrollContainer,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      // ── Fade-in animations for text content ──
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          scroller: scrollContainer,
          start: "top 75%",
          end: "top 25%",
          toggleActions: "play none none none",
        },
      });

      if (taglineRef.current) {
        tl.fromTo(
          taglineRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          0
        );
      }

      if (headingRef.current) {
        tl.fromTo(
          headingRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
          0.15
        );
      }

      if (aboutTextRef.current) {
        tl.fromTo(
          aboutTextRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
          0.35
        );
      }

      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
          0.55
        );
      }

      // ── Image wrapper reveal ──
      if (imageWrapperRef.current) {
        tl.fromTo(
          imageWrapperRef.current,
          { opacity: 0, scale: 0.96, y: 60 },
          { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "power3.out" },
          0.1
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isReady]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 bg-[#f5f2ec]"
      id="about-section"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 xl:px-20 py-20 md:py-28 lg:py-36">
        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24 items-start">
          {/* ── LEFT COLUMN: Text Content ── */}
          <div className="flex flex-col justify-between h-full min-h-[500px] lg:min-h-[600px]">
            {/* Top: Tagline + Heading */}
            <div>
              <p
                ref={taglineRef}
                className="text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-black/50 mb-5 md:mb-6 font-medium"
                style={{ opacity: 0 }}
              >
                FROM CONCEPT TO EXECUTION — FUNCTIONAL, AESTHETIC, DECISION-READY
              </p>
              <h2
                ref={headingRef}
                className="text-black text-[2rem] md:text-[2.8rem] lg:text-[3.2rem] xl:text-[3.6rem] font-bold uppercase leading-[1.05] tracking-[-0.02em]"
                style={{ opacity: 0, maxWidth: "520px" }}
              >
                We Help Clients Visualize Their
                <br />
                <span className="inline-block ml-4 md:ml-6">DREAM SPACES</span>
                <br />
                <span className="inline-block ml-1">Before Building Them.</span>
              </h2>
            </div>

            {/* Bottom: About description + CTA */}
            <div className="mt-16 md:mt-20 lg:mt-0">
              <div
                ref={aboutTextRef}
                className="flex flex-col sm:flex-row gap-6 sm:gap-10 mb-10"
                style={{ opacity: 0 }}
              >
                <p className="text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-black/40 font-medium shrink-0 pt-1">
                  About
                </p>
                <p className="text-[11px] md:text-[12px] lg:text-[13px] leading-[1.8] text-black/70 uppercase tracking-[0.04em] max-w-[440px] font-light">
                  Golden Ratio Creation is a Bhopal-based design studio specializing in Interior Design and Miniature Model Making. We support Architects, Developers, and Businesses by delivering world-class designs and exact scale models.
                </p>
              </div>

              <a
                ref={ctaRef}
                href="#"
                className="about-cta-link group inline-flex items-center gap-2 text-[11px] md:text-[12px] tracking-[0.15em] uppercase text-black font-medium relative"
                style={{ opacity: 0 }}
              >
                <span className="about-cta-text">View Our Models</span>
                <svg
                  className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M4 12L12 4M12 4H5M12 4V11" />
                </svg>
              </a>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Parallax Image ── */}
          <div
            ref={imageWrapperRef}
            className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] xl:h-[680px] rounded-sm"
            style={{ opacity: 0 }}
          >
            <div
              ref={imageRef}
              className="absolute w-full h-full"
            >
              <Image
                src="/images/1bef8902-e0b0-409a-9571-d90359822153.png"
                alt="Modern architectural interior with dramatic lighting and premium finishes"
                fill
                className="object-cover rounded-[25px]"
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={90}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
