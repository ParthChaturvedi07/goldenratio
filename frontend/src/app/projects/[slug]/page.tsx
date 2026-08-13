"use client";

import React, { useEffect, useRef, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "@/components/Footer";
import ProjectInquirySection from "@/components/ui/ProjectInquirySection";
import { fetchProject, fetchProjects, type Project, getMediaUrl } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = React.use(params);

  const [project, setProject] = useState<Project | null>(null);
  const [nextProjects, setNextProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  /* ── Fetch project data ──────────────────────────────────── */
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const [proj, allProjects] = await Promise.all([
          fetchProject(resolvedParams.slug),
          fetchProjects(),
        ]);

        if (cancelled) return;

        setProject(proj);
        // Get 2 random "more projects" excluding the current one
        const others = allProjects.filter((p) => p.slug !== proj.slug);
        setNextProjects(others.slice(0, 2));
      } catch (err) {
        console.error("Failed to load project:", err);
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [resolvedParams.slug]);

  /* ── GSAP entrance animations ────────────────────────────── */
  useEffect(() => {
    if (loading || !project) return;

    // Title animation
    gsap.fromTo(
      heroTitleRef.current,
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power4.out", delay: 0.1 }
    );

    // Stagger gallery images
    if (galleryRef.current) {
      const items = galleryRef.current.querySelectorAll(".gallery-item");
      gsap.fromTo(
        items,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: galleryRef.current,
            start: "top 80%",
          },
        }
      );
    }
  }, [loading, project]);

  /* ── Error state → 404 ───────────────────────────────────── */
  if (error) {
    notFound();
  }

  /* ── Loading skeleton ────────────────────────────────────── */
  if (loading || !project) {
    return (
      <main className="min-h-screen bg-[#f5f2ec] text-black pt-24">
        {/* Top Bar */}
        <div className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 lg:px-16 py-6 bg-[#f5f2ec]/90 backdrop-blur-md border-b border-black/5">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] hover:text-[#2a7a6e] transition-colors duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
            All Projects
          </Link>
        </div>

        <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16 xl:px-20 pb-20 animate-pulse">
          {/* Title skeleton */}
          <div className="py-20 md:py-32">
            <div className="h-24 md:h-40 lg:h-56 w-3/4 bg-black/10 rounded-lg" />
          </div>
          {/* Content skeleton */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            <div className="lg:w-1/3 flex flex-col gap-6">
              <div className="h-6 w-48 bg-black/10 rounded" />
              <div className="h-4 w-full bg-black/10 rounded" />
              <div className="h-4 w-full bg-black/10 rounded" />
              <div className="h-4 w-2/3 bg-black/10 rounded" />
            </div>
            <div className="lg:w-2/3 flex flex-col gap-12">
              <div className="w-full aspect-[16/10] bg-black/10 rounded-xl" />
              <div className="w-full aspect-[16/10] bg-black/10 rounded-xl" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f2ec] text-black pt-24">
      {/* ── Top Bar (Back link) ────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 lg:px-16 py-6 bg-[#f5f2ec]/90 backdrop-blur-md border-b border-black/5">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] hover:text-[#2a7a6e] transition-colors duration-300 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          All Projects
        </Link>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16 xl:px-20 pb-20">
        {/* ── Giant Hero Title ─────────────────────────────────── */}
        <div className="py-20 md:py-32">
          <h1
            ref={heroTitleRef}
            className="text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem] font-black uppercase tracking-tighter leading-[0.85] text-black break-words"
          >
            {project.title}
          </h1>
        </div>

        {/* ── Split Layout: Left Content & Right Gallery ────────── */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left Column (Sticky Details) */}
          <div className="lg:w-1/3">
            <div className="sticky top-32 flex flex-col gap-12">
              
              {/* Concept & Objectives */}
              {project.concept && (
                <div>
                  <h3 className="text-xl md:text-2xl font-bold mb-4">
                    Concept & Objectives
                  </h3>
                  <p className="text-black/70 text-base md:text-lg leading-relaxed">
                    {project.concept}
                  </p>
                </div>
              )}

              {/* My Role */}
              {project.role && (
                <div>
                  <h3 className="text-xl md:text-2xl font-bold mb-4">My Role</h3>
                  <p className="text-black/70 text-base md:text-lg leading-relaxed">
                    {project.role}
                  </p>
                </div>
              )}

              {/* Industry */}
              {project.industry && (
                <div className="pt-4 border-t border-black/10">
                  <p className="text-black/80 font-medium">
                    <span className="font-bold">Industry:</span> {project.industry}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (Gallery & Videos) */}
          <div className="lg:w-2/3" ref={galleryRef}>
            <div className="flex flex-col gap-12 md:gap-20">
              {/* Gallery Images */}
              {project.gallery && project.gallery.length > 0 ? (
                project.gallery.map((img, idx) => (
                  <div key={idx} className="gallery-item flex flex-col gap-4">
                    <div className="w-full relative overflow-hidden rounded-xl bg-black/5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getMediaUrl(img.src)}
                        alt={`${project.title} - ${idx}`}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                    {img.caption && (
                      <p className="text-black/60 text-sm md:text-base font-light italic">
                        {img.caption}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="gallery-item flex flex-col gap-4">
                  <div className="w-full relative overflow-hidden rounded-xl bg-black/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getMediaUrl(project.image)}
                      alt={project.title}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Videos */}
              {project.videos && project.videos.length > 0 && (
                project.videos.map((video, idx) => (
                  <div key={`video-${idx}`} className="gallery-item flex flex-col gap-4">
                    <div className="w-full relative overflow-hidden rounded-xl bg-black/5">
                      <video
                        src={getMediaUrl(video.src)}
                        controls
                        className="w-full h-auto rounded-xl"
                        preload="metadata"
                      />
                    </div>
                    {video.caption && (
                      <p className="text-black/60 text-sm md:text-base font-light italic">
                        {video.caption}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Project Inquiry / Contact Section ─────────────────── */}
      <ProjectInquirySection />

      {/* ── Next Cases (More Projects) ────────────────────────── */}
      {nextProjects.length > 0 && (
        <div className="bg-[#0a0a0a] py-24 border-t border-black/5">
          <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16 xl:px-20">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-[1px] bg-[#2a7a6e]"></div>
              <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-[#2a7a6e]">
                More Projects
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
              {nextProjects.map((nextProj) => (
                <Link
                  key={nextProj._id}
                  href={`/projects/${nextProj.slug}`}
                  className="group flex flex-col gap-6"
                >
                  {/* Image Card */}
                  <div className="relative w-full aspect-[4/3] lg:aspect-[16/10] rounded-[30px] overflow-hidden shadow-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getMediaUrl(nextProj.image)}
                      alt={nextProj.title}
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
                    <p className="text-[#f5f2ec]/50 text-xs md:text-sm font-mono tracking-wider uppercase">
                      /{nextProj.category}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-medium text-[#f5f2ec]">
                      {nextProj.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}