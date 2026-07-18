"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSmoothScroll } from "./SmoothScrollProvider";

gsap.registerPlugin(ScrollTrigger);

interface ServiceCard {
  number: string;
  title: string;
  description: string;
  image: string;
}

const SERVICES: ServiceCard[] = [
  {
    number: "/01",
    title: "Architecture",
    description: "Designing functional & aesthetic structures that stand the test of time",
    image: "/images/service-architecture.png",
  },
  {
    number: "/02",
    title: "Interior Design",
    description: "Crafting immersive interior experiences that reflect identity & purpose",
    image: "/images/service-interior.png",
  },
  {
    number: "/03",
    title: "Construction",
    description: "Precision-built environments from concept to completion",
    image: "/images/service-construction.png",
  },
];

function ServiceCardItem({ service }: { service: ServiceCard }) {
  return (
    <div
      className="service-card group relative flex flex-col justify-between overflow-hidden rounded-2xl cursor-pointer"
      style={{
        minHeight: "420px",
        height: "70vh",
        maxHeight: "580px",
      }}
    >
      {/* ── Layer 1: Glass background (default — fades out on hover) ── */}
      <div className="service-card-glass absolute inset-0 z-[1] rounded-2xl" />

      {/* ── Layer 2: Hover image (hidden by default — revealed on hover) ── */}
      <div className="service-card-image absolute inset-0 z-[2] rounded-2xl overflow-hidden">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
          quality={85}
        />
        {/* Gradient for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.05) 70%, transparent 100%)",
          }}
        />
      </div>

      {/* ── Glass shimmer (default only) ── */}
      <div className="service-card-shimmer absolute inset-0 z-[3] pointer-events-none rounded-2xl" />

      {/* ── Card number ── */}
      <div className="relative z-10 p-6 md:p-8">
        <span className="service-card-number text-xs md:text-sm font-light tracking-[0.1em]">
          {service.number}
        </span>
      </div>

      {/* ── Card content ── */}
      <div className="relative z-10 p-6 md:p-8 flex flex-col gap-3">
        <h3 className="service-card-title text-white font-light tracking-[-0.01em] leading-tight">
          {service.title}
        </h3>
        <p className="service-card-desc text-xs md:text-sm leading-relaxed tracking-[0.02em] max-w-[280px]">
          {service.description}
        </p>
      </div>

      {/* ── Bottom accent line (hover only) ── */}
      <div className="service-card-accent absolute bottom-0 left-[10%] right-[10%] h-[1px] z-10" />
    </div>
  );
}

export default function OurServices() {
  const { isReady } = useSmoothScroll();
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isReady) return;

    const scrollContainer = document.querySelector(
      "#smooth-scroll-container"
    ) as HTMLElement;

    const ctx = gsap.context(() => {
      // ── Heading entrance ──
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

      // ── Staggered card entrance ──
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".service-card");
        gsap.fromTo(
          cards,
          { opacity: 0, y: 80, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            stagger: 0.15,
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
    }, sectionRef);

    return () => ctx.revert();
  }, [isReady]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      id="services-section"
      style={{ minHeight: "100vh" }}
    >
      {/* ── Video Background ── */}
      <div className="absolute inset-0 z-0">
        <video
          src="/video/hero-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.55) 100%)",
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 xl:px-20 py-20 md:py-28 lg:py-36 flex flex-col gap-14 md:gap-20">
        {/* ── Section Header ── */}
        <div ref={headingRef} style={{ opacity: 0 }}>
          <p className="text-white/40 text-[10px] md:text-[11px] tracking-[0.25em] uppercase mb-4 font-medium">
            What We Do
          </p>
          <h2 className="text-white text-3xl md:text-4xl lg:text-5xl xl:text-[3.5rem] font-bold uppercase leading-[1.05] tracking-[-0.02em]">
            Our Services
          </h2>
        </div>

        {/* ── Cards Grid ── */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 lg:gap-6"
        >
          {SERVICES.map((service) => (
            <ServiceCardItem key={service.number} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}