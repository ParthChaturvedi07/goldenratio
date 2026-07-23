"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { useSmoothScroll } from "./SmoothScrollProvider";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    title: "Urban Architecture Model",
    category: "Industrial Models",
    description: "A comprehensive industrial layout with complex machinery flows, meticulously crafted for precise detailing and functional planning. Highlights spatial efficiency and structural integrity.",
    image: "/images/IMG20250529191734.jpg",
  },
  {
    id: 2,
    title: "Eco Township Layout",
    category: "Architectural Models",
    description: "Expansive residential township miniature focusing on green spaces, sustainable design, and modern living. Features intricate terrain mapping and lifestyle amenities.",
    image: "/images/IMG20250608163444.jpg",
  },
  {
    id: 3,
    title: "Corporate Headquarters",
    category: "Commercial Models",
    description: "High-rise commercial complex highlighting glass facades, modern structural design, and an integrated transport hub for large-scale enterprise environments.",
    image: "/images/IMG20250830225703.jpg",
  },
  {
    id: 4,
    title: "Luxury Interior Concept",
    category: "Interior Models",
    description: "Detailed interior layout for a premium showroom, showcasing tailored material finishes, modular furniture, and specialized lighting setups for a realistic feel.",
    image: "/images/IMG_0615.jpg",
  },
  {
    id: 5,
    title: "Smart City Development",
    category: "Architectural Models",
    description: "Master plan model incorporating IT parks, institutional buildings, and smart infrastructure. Displays zoning, road networks, and energy-efficient building placements.",
    image: "/images/IMG_20240313_115136.jpg",
  },
  {
    id: 6,
    title: "Industrial Plant Layout",
    category: "Industrial Models",
    description: "Detailed manufacturing plant setup showing production line sequences, loading bays, and safety zones. A vital tool for logistical planning and investor presentations.",
    image: "/images/IMG_20221110_172236.jpg",
  }
];

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const { isReady } = useSmoothScroll();

  useEffect(() => {
    if (!isReady || !sectionRef.current) return;

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
  }, [isReady]);

  return (
    <section ref={sectionRef} className="py-12 bg-[#f5f2ec] relative text-black rounded-xl">
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
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-medium tracking-tight text-black leading-[1.05] mb-6">
              FEATURED PROJECTS
            </h2>
            <p className="text-black/70 text-lg md:text-xl font-light leading-relaxed max-w-2xl">
              From highly detailed miniature scale models to expansive smart city master plans, we transform bold ideas into tangible realities. Explore some of our finest executions below.
            </p>
          </div>
        </div>

        {/* 2x3 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
          {projects.map((project, index) => (
            <div
              key={project.id}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="flex flex-col gap-6"
            >
              {/* Image Card */}
              <div className="group relative w-full aspect-[4/3] lg:aspect-[16/10] rounded-xl overflow-hidden shadow-lg cursor-pointer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image}
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
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="mt-20 flex justify-center">
            <button className="flex items-center gap-2 group border border-black/20 rounded-full px-10 py-5 hover:bg-black hover:text-white transition-colors duration-300 cursor-pointer shadow-sm hover:shadow-xl">
                <span className="font-medium tracking-wide text-sm md:text-base">VIEW ALL PROJECTS</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
      </div>
    </section>
  );
}
