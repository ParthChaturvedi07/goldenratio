"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { useSmoothScroll } from "./SmoothScrollProvider";
import { fetchProjects, type Project, getMediaUrl } from "@/lib/api";
import AnimatedLink from "./ui/AnimatedLink";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const { isReady } = useSmoothScroll();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  /* ── Fetch projects from server ────────────────────────── */
  useEffect(() => {
    let cancelled = false;
    fetchProjects()
      .then((data) => {
        if (!cancelled) {
          // Show only the first 6 for the landing page grid
          setProjects(data.slice(0, 6));
        }
      })
      .catch((err) => {
        console.error("Failed to load projects:", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /* ── GSAP scroll animations ────────────────────────────── */
  useEffect(() => {
    if (!isReady || !sectionRef.current || loading) return;

    const scrollContainer = document.querySelector("#smooth-scroll-container") as HTMLElement;

    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;

        const isLeft = i % 2 === 0;

        gsap.fromTo(
          card,
          {
            opacity: 0,
            x: isLeft ? -100 : 100,
            y: 100
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              scroller: scrollContainer,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    }, sectionRef);

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => ctx.revert();
  }, [isReady, loading, projects]);

  return (
    <section ref={sectionRef} id="projects-section" className="py-12 bg-[#f5f2ec] relative text-black rounded-xl">
      <div className="w-full px-4 md:px-8 lg:px-12 xl:px-20 2xl:px-32">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 md:w-12 h-[1px] bg-black/20"></div>
              <p className="text-black/50 text-[10px] md:text-[11px] tracking-[0.25em] uppercase font-medium">
                Our Works
              </p>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-black leading-[1.05] mb-6">
              FEATURED PROJECTS
            </h2>
            <p className="text-black/70 text-lg md:text-xl font-light leading-relaxed max-w-2xl">
              From highly detailed miniature scale models to expansive smart city master plans, we transform bold ideas into tangible realities. Explore some of our finest executions below.
            </p>
          </div>
        </div>

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

        {/* 2x3 Grid */}
        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
            {projects.map((project, index) => (
              <Link
                href={`/projects/${project.slug}`}
                key={project._id}
                ref={(el) => { cardsRef.current[index] = el; }}
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

                {/* Project Content */}
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
              No projects available yet
            </p>
          </div>
        )}

        {/* View More Button */}
        <div className="mt-20 flex justify-center">
          <AnimatedLink
            href="/projects"
            className="
                  group
                  flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-black/20
                  px-10
                  py-5
                  shadow-sm
                  transition-all
                  duration-300
                  hover:shadow-xl
                  text-black
                  hover:text-white">
            <span className="font-medium tracking-wide text-sm md:text-base">
              VIEW ALL PROJECTS
            </span>

            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </AnimatedLink>
        </div>
      </div>
    </section>
  );
}
