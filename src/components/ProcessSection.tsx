"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSmoothScroll } from "./SmoothScrollProvider";

gsap.registerPlugin(ScrollTrigger);

/* ── Process Data ─────────────────────────────────────────── */
const processData = [
  {
    id: 1,
    number: "01",
    title: "Consultation & Site Visit",
    description:
      "Understand needs, measure space, collect drawings",
  },
  {
    id: 2,
    number: "02",
    title: "Design & 3D Concept",
    description:
      "Mood boards, 2D layouts, photorealistic 3D renders",
  },
  {
    id: 3,
    number: "03",
    title: "Model / Execution Approval",
    description:
      "Scale model or material samples for final sign-off",
  },
  {
    id: 4,
    number: "04",
    title: "Execution / Model Making",
    description:
      "Turnkey interior work OR detailed model fabrication",
  },
  {
    id: 5,
    number: "05",
    title: "Handover & Support",
    description:
      "Project delivery with post-service support",
  },
];

/* ── Card position class names (carousel state machine) ──── */
// The 5 positions cycle through as cards rotate:
// "act"      → front & center (active)
// "next"     → right side (upcoming)
// "new-next" → far right (hidden staging)
// "hide"     → far left (hidden staging)
// "prev"     → left side (outgoing)

export default function ProcessSection() {
  const { isReady } = useSmoothScroll();
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLDivElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);

  const [cards, setCards] = useState([
    "new-next",
    "hide",
    "prev",
    "act",
    "next",
  ]);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* ── GSAP scroll-triggered entrance ── */
  useEffect(() => {
    if (!isReady) return;

    const scrollContainer = document.querySelector(
      "#smooth-scroll-container"
    ) as HTMLElement;

    const ctx = gsap.context(() => {
      // Heading entrance
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              scroller: scrollContainer,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Carousel entrance
      if (carouselRef.current) {
        gsap.fromTo(
          carouselRef.current,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              scroller: scrollContainer,
              start: "top 70%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Footer entrance
      if (footerRef.current) {
        gsap.fromTo(
          footerRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              scroller: scrollContainer,
              start: "top 50%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isReady]);

  /* ── Carousel rotation ── */
  const next = useCallback(() => {
    // Reset all progress bars
    progressRefs.current.forEach((ref) => {
      if (ref) {
        ref.style.transition = "none";
        ref.style.width = "0%";
      }
    });

    setCards((prev) => {
      const newCards = [...prev];
      const lastCard = newCards.pop()!;
      newCards.unshift(lastCard);
      return newCards;
    });
  }, []);

  /* ── Auto-play timer ── */
  useEffect(() => {
    const duration = 4000; // 4 seconds per card

    progressInterval.current = setInterval(() => {
      next();
    }, duration);

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [next]);

  /* ── Progress bar animation for active card ── */
  useEffect(() => {
    const activeIndex = cards.indexOf("act");

    if (activeIndex !== -1) {
      const progressBar = progressRefs.current[activeIndex];

      if (progressBar) {
        // Reset width immediately with no transition
        progressBar.style.transition = "none";
        progressBar.style.width = "0%";

        // Wait for next frame to start smooth transition
        requestAnimationFrame(() => {
          progressBar.style.transition = "width 4s linear";
          progressBar.style.width = "100%";
        });
      }
    }
  }, [cards]);

  /* ── Manual navigation ── */
  const handleCardClick = useCallback(
    (clickedIndex: number) => {
      const clickedState = cards[clickedIndex];
      if (clickedState === "act") return; // Already active

      // Reset timer
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }

      // Reset all progress bars
      progressRefs.current.forEach((ref) => {
        if (ref) {
          ref.style.transition = "none";
          ref.style.width = "0%";
        }
      });

      next();

      // Restart timer
      progressInterval.current = setInterval(() => {
        next();
      }, 4000);
    },
    [cards, next]
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      id="process-section"
      style={{ minHeight: "100vh", backgroundColor: "#f5f2ec" }}
    >
      {/* ── Grid Background with Fading Edges ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)",
          backgroundSize: "65px 65px",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 25%, black 50%, transparent), linear-gradient(to bottom, transparent, black 20%, black 50%, transparent)",
          WebkitMaskComposite: "destination-in" as React.CSSProperties["WebkitMaskComposite"],
          maskImage:
            "linear-gradient(to right, transparent, black 25%, black 50%, transparent), linear-gradient(to bottom, transparent, black 20%, black 50%, transparent)",
          maskComposite: "intersect",
        }}
      />

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 xl:px-20 py-6 md:py-10 lg:py-16 flex flex-col gap-14 md:gap-20">
        {/* ── Section Header ── */}
        <div ref={headingRef} style={{ opacity: 0 }}>
          <p className="text-black/40 text-[10px] md:text-[11px] tracking-[0.25em] uppercase mb-4 font-medium">
            How We Work
          </p>
          <h2 className="text-black text-3xl md:text-4xl lg:text-5xl xl:text-[3.5rem] font-bold uppercase leading-[1.05] tracking-[-0.02em]">
            Our Process
          </h2>

        </div>

        {/* ── Carousel ── */}
        <div
          ref={carouselRef}
          className="process-carousel-container"
          style={{ opacity: 0 }}
        >
          <div className="process-carousel-list">
            {processData.map((card, index) => (
              <div
                key={card.id}
                className={`process-card ${cards[index]}`}
                onClick={() => handleCardClick(index)}
              >
                {/* Card Top: Number + Progress */}
                <div className="process-card-top">
                  <span className="process-card-number">{card.number}</span>
                  <div className="process-progress-bar">
                    <div
                      className="process-progress-fill"
                      ref={(el) => {
                        progressRefs.current[index] = el;
                      }}
                    />
                  </div>
                </div>

                {/* Card Content */}
                <div className="process-card-content">
                  <h3 className="process-card-title">{card.title}</h3>
                  <p className="process-card-desc">{card.description}</p>
                </div>

                {/* Decorative corner accent */}
                <div className="process-card-corner" />
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer CTA ── */}
        <div
          ref={footerRef}
          className="process-footer"
          style={{ opacity: 0 }}
        >
          <p className="process-footer-text">
            From first consultation to final handover — we take care of
            everything so you can focus on what matters.
          </p>
          <a href="#contact-section" className="process-cta-btn group">
            <span>Start Your Project</span>
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
    </section>
  );
}
