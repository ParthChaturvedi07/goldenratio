"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "@/components/Footer";
import { fetchProjects, fetchCategories, type Project, getMediaUrl } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsPageClient() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const heroRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  /* ── Fetch categories on mount ──────────────────────────── */
  useEffect(() => {
    fetchCategories()
      .then((cats) => setCategories(cats))
      .catch((err) => console.error("Failed to load categories:", err));
  }, []);

  /* ── Fetch projects whenever category changes ───────────── */
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetchProjects(activeCategory)
      .then((data) => {
        if (!cancelled) setProjects(data);
      })
      .catch((err) => {
        console.error("Failed to load projects:", err);
        if (!cancelled) setProjects([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeCategory]);

  /* ── Entrance animation ──────────────────────────────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power4.out", delay: 0.1 }
      );
    });
    return () => ctx.revert();
  }, []);

  /* ── Cards stagger animation when projects load/change ──── */
  useEffect(() => {
    if (loading) return;
    const validCards = cardsRef.current.filter(Boolean);
    if (validCards.length === 0) return;

    gsap.fromTo(
      validCards,
      { opacity: 0, y: 80, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
        },
      }
    );
  }, [loading, projects]);

  return (
    <main className="min-h-screen bg-[#f5f2ec] text-black">
      {/* ── Top Bar ─────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 lg:px-16 py-6 bg-[#f5f2ec]/90 backdrop-blur-md border-b border-black/5">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] hover:text-[#2a7a6e] transition-colors duration-300 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          Back to Home
        </Link>
        <Image
          src="/images/GoldenRatio_Creation.png"
          alt="Golden Ratio Creation"
          width={120}
          height={40}
          className="h-8 w-auto object-contain"
        />
      </div>

      {/* ── Hero Section ───────────────────────────────────── */}
      <div ref={heroRef} className="pt-32 pb-16 px-6 md:px-10 lg:px-16 xl:px-20">
        <div className="max-w-[1600px] mx-auto pt-10">
          <div className="flex items-center gap-4 mb-6 md:mb-8">
            <div className="w-10 md:w-12 h-[1px] bg-[#2a7a6e]"></div>
            <p className="text-[#2a7a6e] text-[10px] md:text-[11px] tracking-[0.25em] uppercase font-semibold">
              Our Portfolio
            </p>
          </div>
          <h1 className="text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem] font-black uppercase tracking-tighter leading-[0.85] text-black break-words mb-8">
            All{" "}
            <span className="text-black/40">
              Projects
            </span>
          </h1>
          <p className="text-black/60 text-lg md:text-2xl font-light leading-relaxed max-w-3xl">
            Explore the full breadth of our work — from miniature scale models to expansive architectural masterplans, each project tells a story of precision, innovation, and design excellence.
          </p>
        </div>
      </div>

      {/* ── Filter Bar ─────────────────────────────────────── */}
      <div className="sticky top-[80px] z-40 bg-[#f5f2ec]/90 backdrop-blur-lg border-y border-black/5">
        <div className="max-w-[1600px] mx-auto py-4 md:py-5">
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide px-6 md:px-10 lg:px-16 xl:px-20 snap-x snap-mandatory">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 snap-start px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-500 cursor-pointer border ${activeCategory === cat
                  ? "bg-black text-white border-black shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
                  : "bg-transparent text-black/60 border-black/10 hover:bg-black/5 hover:text-black hover:border-black/30"
                  }`}
              >
                {cat}
              </button>
            ))}
            {/* Spacer for right edge padding on mobile */}
            <div className="shrink-0 w-3 md:w-0" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* ── Project Grid ───────────────────────────────────── */}
      <div
        ref={gridRef}
        className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16 xl:px-20 py-20 md:py-28"
      >
        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-6 animate-pulse">
                <div className="w-full aspect-[4/3] lg:aspect-[16/10] rounded-[30px] bg-black/10" />
                <div className="flex flex-col gap-2 px-1">
                  <div className="h-3 w-32 rounded bg-black/10" />
                  <div className="h-7 w-64 rounded bg-black/10" />
                  <div className="h-4 w-full rounded bg-black/10" />
                  <div className="h-4 w-3/4 rounded bg-black/10" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Project Cards */}
        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            {projects.map((project, index) => (
              <Link
                href={`/projects/${project.slug}`}
                key={project._id}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className="group flex flex-col gap-6 md:gap-8"
              >
                {/* Image Card */}
                <div className="relative w-full aspect-[4/3] lg:aspect-[16/10] rounded-[30px] overflow-hidden bg-black/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getMediaUrl(project.image)}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                  />

                  {/* Hover Overlay with Button */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="bg-white text-black px-8 py-4 flex items-center gap-3 rounded-full font-bold text-xs uppercase tracking-widest translate-y-8 group-hover:translate-y-0 transition-all duration-700 hover:scale-105 shadow-2xl">
                      <span>Explore</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-3 px-2">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-[1px] bg-black/20" />
                    <p className="text-black/50 text-[10px] md:text-[11px] font-semibold tracking-[0.2em] uppercase">
                      {project.category}
                    </p>
                  </div>
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black uppercase tracking-tight line-clamp-2 leading-none">
                    {project.title}
                  </h3>
                  <p className="text-black/60 text-sm md:text-base font-light line-clamp-2 leading-relaxed mt-2 max-w-[90%]">
                    {project.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="text-black/40 text-lg uppercase tracking-widest">
              No projects in this category yet
            </p>
          </div>
        )}
      </div>

      {/* ── Footer credit ──────────────────────────────────── */}
      <Footer />
    </main>
  );
}
