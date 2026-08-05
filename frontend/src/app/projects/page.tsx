"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import gsap from "gsap";
import Footer from "@/components/Footer";
import { fetchProjects, fetchCategories, type Project, getMediaUrl } from "@/lib/api";

export default function ProjectsPage() {
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
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.2 }
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
      { opacity: 0, y: 50, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
      }
    );
  }, [loading, projects]);

  return (
    <main className="min-h-screen bg-[#f5f2ec] text-black">
      {/* ── Top Bar ─────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 lg:px-12 py-4 bg-[#f5f2ec]/80 backdrop-blur-xl border-b border-black/5">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-black hover:text-[#2a7a6e] transition-colors duration-300 group"
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
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 md:w-12 h-[1px] bg-[#2a7a6e]"></div>
            <p className="text-[#2a7a6e] text-[10px] md:text-[11px] tracking-[0.25em] uppercase font-semibold">
              Our Portfolio
            </p>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold uppercase tracking-tight leading-[1.02] mb-6">
            All{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2a7a6e] to-[#1a5a50]">
              Projects
            </span>
          </h1>
          <p className="text-black/60 text-lg md:text-xl font-light leading-relaxed max-w-2xl">
            Explore the full breadth of our work — from miniature scale models to expansive architectural masterplans, each project tells a story of precision, innovation, and design excellence.
          </p>
        </div>
      </div>

      {/* ── Filter Bar ─────────────────────────────────────── */}
      <div className="sticky top-[64px] z-40 bg-[#f5f2ec]/90 backdrop-blur-lg border-y border-black/5">
        <div className="max-w-[1440px] mx-auto py-4">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide px-6 md:px-10 lg:px-16 xl:px-20 snap-x snap-mandatory">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 snap-start px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-400 cursor-pointer border ${activeCategory === cat
                    ? "bg-black text-white border-black shadow-lg shadow-black/10"
                    : "bg-transparent text-black/60 border-black/10 hover:bg-black/5 hover:text-black hover:border-black/20"
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
        className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 xl:px-20 py-16"
      >
        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
            {projects.map((project, index) => (
              <Link
                href={`/projects/${project.slug}`}
                key={project._id}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className="group flex flex-col gap-6"
              >
                {/* Image Card */}
                <div className="relative w-full aspect-[4/3] lg:aspect-[16/10] rounded-[30px] overflow-hidden shadow-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getMediaUrl(project.image)}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Hover Overlay with Button */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <div className="bg-white text-black px-8 py-3 flex items-center gap-2 rounded-full font-medium tracking-wide translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:scale-105">
                      <span>VIEW PROJECT</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2 px-1">
                  <p className="text-black/50 text-xs md:text-sm font-mono tracking-wider uppercase">
                    /{project.category}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-medium text-black">
                    {project.title}
                  </h3>
                  <p className="text-black/70 text-sm md:text-base line-clamp-3">
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
