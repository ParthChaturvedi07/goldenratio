"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { useSmoothScroll } from "./SmoothScrollProvider";

gsap.registerPlugin(ScrollTrigger);

// --- Type Definitions ---
export interface Stat {
  value: string;
  label: string;
}

export interface Testimonial {
  name: string;
  title: string;
  quote?: string;
  avatarSrc: string;
  rating: number;
}

export interface ClientsSectionProps {
  tagLabel: string;
  title: string;
  description: string;
  stats: Stat[];
  testimonials: Testimonial[];
  primaryActionLabel: string;
  secondaryActionLabel: string;
  className?: string;
}

export const ClientsSection = ({
  tagLabel,
  title,
  description,
  stats,
  testimonials,
  primaryActionLabel,
  secondaryActionLabel,
  className,
}: ClientsSectionProps) => {
  const { isReady } = useSmoothScroll();
  const sectionRef = useRef<HTMLElement | null>(null);
  const leftColRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!isReady || !sectionRef.current) return;

    const scrollContainer = document.querySelector(
      "#smooth-scroll-container"
    ) as HTMLElement;

    const ctx = gsap.context(() => {
      // ── Main Pinned Scroll Timeline ──
      const totalCards = testimonials.length;
      const endScroll = `+=${Math.max(totalCards * 70, 180)}%`;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          scroller: scrollContainer,
          start: "top top",
          end: endScroll,
          pin: true,
          pinType: "transform",
          scrub: 0.8,
          anticipatePin: 1,
        },
      });

      // ── Stacking Animation for Cards ──
      // Card 0 starts visible. Each subsequent card (1, 2, 3...) slides UP
      // from offscreen and stacks on top of previous cards with a top offset.
      testimonials.forEach((_, i) => {
        if (i === 0) return;

        const currentCard = cardsRef.current[i];
        if (!currentCard) return;

        // Animate previous cards down/scaled slightly as new card arrives
        for (let prev = 0; prev < i; prev++) {
          const prevCard = cardsRef.current[prev];
          if (prevCard) {
            tl.to(
              prevCard,
              {
                scale: 1 - (i - prev) * 0.03,
                opacity: 0.85 + prev * 0.05,
                duration: 1,
                ease: "power2.out",
              },
              i - 1
            );
          }
        }

        // Animate the incoming card onto the stack
        tl.fromTo(
          currentCard,
          {
            y: 450,
            opacity: 0,
            scale: 0.92,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power2.out",
          },
          i - 1
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isReady, testimonials]);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative w-full overflow-hidden flex items-center justify-center",
        className
      )}
      id="clients-testimonials-section"
      style={{ minHeight: "100vh", backgroundColor: "#f5f2ec" }}
    >
      {/* ── Architectural Grid Background with Fading Edges ──
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)",
          backgroundSize: "65px 65px",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 25%, black 50%, transparent), linear-gradient(to bottom, transparent, black 20%, black 50%, transparent)",
          WebkitMaskComposite:
            "destination-in" as React.CSSProperties["WebkitMaskComposite"],
          maskImage:
            "linear-gradient(to right, transparent, black 25%, black 50%, transparent), linear-gradient(to bottom, transparent, black 20%, black 50%, transparent)",
          maskComposite: "intersect",
        }}
      /> */}

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 xl:px-20 py-4 md:py-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24 items-center">
        {/* ── Left Column: Fixed / Sticky Information ── */}
        <div ref={leftColRef} className="flex flex-col gap-6">
          {/* Section Tag Badge */}
          <div className="inline-flex items-center gap-2.5 self-start rounded-full border border-black/10 bg-[#ede9e1] px-3.5 py-1.5 shadow-sm">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-black/60 text-[10px] md:text-[11px] tracking-[0.2em] uppercase font-medium">
              {tagLabel}
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-black text-3xl md:text-4xl lg:text-5xl xl:text-[3.4rem] font-bold uppercase leading-[1.06] tracking-[-0.02em]">
            {title}
          </h2>

          {/* Description */}
          <p className="text-black/60 text-xs md:text-sm leading-relaxed tracking-[0.03em] uppercase font-light max-w-[480px]">
            {description}
          </p>

          {/* Stats Cards Grid (Neomorphic style) */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 mt-2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="p-4 md:p-5 rounded-2xl text-center transition-all duration-300"
                style={{
                  background: "#ede9e1",
                  boxShadow:
                    "5px 5px 12px rgba(0, 0, 0, 0.06), -5px -5px 12px rgba(255, 255, 255, 0.75)",
                }}
              >
                <p className="text-2xl md:text-3xl font-bold text-[#1a1a1a] tracking-tight">
                  {stat.value}
                </p>
                <p className="text-[10px] md:text-[11px] text-black/45 tracking-[0.08em] uppercase font-light mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <a
              href="#contact-section"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-[#1a1a1a] text-[#f5f2ec] text-xs tracking-[0.15em] uppercase font-medium transition-all duration-300 hover:bg-black hover:scale-[1.02] shadow-md"
            >
              {primaryActionLabel}
            </a>
            <a
              href="#portfolio-section"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-full border border-black/20 text-[#1a1a1a] text-xs tracking-[0.15em] uppercase font-medium transition-all duration-300 hover:bg-black/5 hover:border-black"
            >
              {secondaryActionLabel}
            </a>
          </div>
        </div>

        {/* ── Right Column: Stacked Testimonial Cards Deck ── */}
        <div className="relative w-full h-[460px] md:h-[500px] flex items-center justify-center">
          {testimonials.map((testimonial, index) => {
            const stackOffset = index * 24; // 24px vertical offset per card in the stack

            return (
              <div
                key={testimonial.name}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className="absolute left-0 right-0 w-full max-w-[540px] mx-auto rounded-3xl p-7 md:p-9 flex flex-col justify-between"
                style={{
                  top: `${stackOffset}px`,
                  zIndex: index + 1,
                  background: "#ede9e1",
                  boxShadow:
                    "10px 10px 24px rgba(0, 0, 0, 0.1), -10px -10px 24px rgba(255, 255, 255, 0.8), 0 8px 32px rgba(0, 0, 0, 0.06)",
                  transformOrigin: "top center",
                  willChange: "transform, opacity",
                }}
              >
                {/* Author Info + Avatar */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-black/10">
                      <Image
                        src={testimonial.avatarSrc}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                        quality={85}
                      />
                    </div>
                    <div className="flex flex-col">
                      <h4 className="font-bold text-lg md:text-xl text-[#1a1a1a] tracking-tight">
                        {testimonial.name}
                      </h4>
                      <p className="text-black/45 text-xs tracking-[0.06em] uppercase font-light mt-0.5">
                        {testimonial.title}
                      </p>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1.5 bg-black/5 px-3 py-1.5 rounded-full">
                    <span className="font-bold text-xs text-[#1a1a1a]">
                      {testimonial.rating.toFixed(1)}
                    </span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-3.5 w-3.5",
                            i < Math.floor(testimonial.rating)
                              ? "text-amber-500 fill-amber-500"
                              : "text-black/15"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quote */}
                {testimonial.quote && (
                  <p className="text-black/75 text-sm md:text-base leading-relaxed font-light tracking-[0.02em] my-6 italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                )}

                {/* Card Accent / Brand Mark */}
                <div className="flex items-center justify-between pt-4 border-t border-black/5">
                  <span className="text-[10px] tracking-[0.2em] text-black/30 uppercase font-medium">
                    Golden Ratio Client
                  </span>
                  <span className="text-[10px] tracking-[0.1em] text-black/30 uppercase font-mono">
                    0{index + 1} / 0{testimonials.length}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
