"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";

interface MenuLink {
  label: string;
  href: string;
  subLinks?: { label: string; href: string }[];
}

const menuLinks: MenuLink[] = [
  { label: "OUR JOURNEY", href: "/about-us" },
  { label: "TECHNOLOGY & INNOVATION", href: "/technology-and-innovation" },
  {
    label: "DESIGN & BUILD",
    href: "/design-and-build",
    subLinks: [
      { label: "ARCHITECTURE", href: "/design-and-build/architecture" },
      { label: "INTERIOR DESIGN", href: "/design-and-build/interior-design" },
      { label: "MEP ENGINEERING", href: "/design-and-build/mep-engineering" },
      { label: "PROJECT MANAGEMENT", href: "/design-and-build/project-management" },
      { label: "CONSTRUCTION", href: "/design-and-build/construction" },
    ],
  },
  { label: "PROJECTS", href: "/our-projects" },
  { label: "CONTACT US", href: "/contact" },
];

interface MenuDrawerProps {
  isOpen: boolean;
}

export default function MenuDrawer({ isOpen }: MenuDrawerProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const imagePanelRef = useRef<HTMLDivElement | null>(null);
  const navPanelRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const hasInitialised = useRef(false);

  const toggleExpand = (label: string) => {
    setExpandedItem(expandedItem === label ? null : label);
  };

  // Build the GSAP timeline once, then play / reverse based on isOpen
  const buildTimeline = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: "power3.inOut" },
      onStart: () => {
        // Make the container visible when the animation starts playing forward
        if (containerRef.current) {
          containerRef.current.style.visibility = "visible";
          containerRef.current.style.pointerEvents = "auto";
        }
      },
      onReverseComplete: () => {
        // Hide when fully closed
        if (containerRef.current) {
          containerRef.current.style.visibility = "hidden";
          containerRef.current.style.pointerEvents = "none";
        }
      },
    });

    // ── Backdrop fade ──
    if (backdropRef.current) {
      tl.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        0
      );
    }

    // ── Image panel: slides DOWN from above + fades in ──
    if (imagePanelRef.current) {
      tl.fromTo(
        imagePanelRef.current,
        { yPercent: -100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.9 },
        0.05
      );
    }

    // ── Nav panel: slides UP from below + fades in ──
    if (navPanelRef.current) {
      tl.fromTo(
        navPanelRef.current,
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.9 },
        0.05
      );
    }

    timelineRef.current = tl;
  }, []);

  // Initialise timeline on mount
  useEffect(() => {
    buildTimeline();

    // Set initial hidden state
    if (containerRef.current) {
      containerRef.current.style.visibility = "hidden";
      containerRef.current.style.pointerEvents = "none";
    }

    return () => {
      timelineRef.current?.kill();
    };
  }, [buildTimeline]);

  // Play / reverse when isOpen changes
  useEffect(() => {
    if (!timelineRef.current) return;

    // Skip the very first render (closed state) so we don't animate on mount
    if (!hasInitialised.current) {
      hasInitialised.current = true;
      return;
    }

    if (isOpen) {
      timelineRef.current.play();
    } else {
      timelineRef.current.reverse();
    }
  }, [isOpen]);

  return (
    <>
      {/* Full-screen container (visibility managed by GSAP) */}
      <div
        ref={containerRef}
        id="menu-drawer"
        className="fixed inset-0 z-40 flex"
        style={{ visibility: "hidden", pointerEvents: "none" }}
      >
        {/* Backdrop */}
        <div
          ref={backdropRef}
          className="absolute inset-0 bg-black/10"
          style={{ opacity: 0 }}
        />

        {/* Left side — Background image (slides from top) */}
        <div
          ref={imagePanelRef}
          className="hidden lg:block relative w-[60%] xl:w-[65%] overflow-hidden"
          style={{ opacity: 0 }}
        >
          <Image
            src="/images/menu-bg.png"
            alt="Architectural background"
            fill
            className="object-cover"
            sizes="65vw"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Right side — Navigation panel (slides from bottom) */}
        <div
          ref={navPanelRef}
          className="w-full lg:w-[40%] xl:w-[35%] bg-[#f0ece4] flex flex-col justify-end px-8 md:px-12 lg:px-16 pb-16 pt-28 overflow-y-auto"
          style={{ opacity: 0 }}
        >
          {/* Navigation label */}
          <p className="text-[#2a7a6e] text-xs tracking-[0.15em] uppercase mb-8 font-medium">
            Navigation
          </p>

          {/* Menu links */}
          <nav className="flex flex-col gap-1">
            {menuLinks.map((link) => (
              <div key={link.label}>
                <div className="flex items-center justify-between">
                  <a
                    href={link.href}
                    className="menu-link text-black text-sm md:text-base font-semibold uppercase tracking-[0.12em] py-4 block"
                  >
                    {link.label}
                  </a>
                  {link.subLinks && (
                    <button
                      onClick={() => toggleExpand(link.label)}
                      className="text-black text-2xl font-light w-10 h-10 flex items-center justify-center transition-transform duration-300 cursor-pointer"
                      style={{
                        transform:
                          expandedItem === link.label
                            ? "rotate(45deg)"
                            : "rotate(0deg)",
                      }}
                      aria-label={`Expand ${link.label}`}
                    >
                      +
                    </button>
                  )}
                </div>

                {/* Sub-links */}
                {link.subLinks && (
                  <div
                    className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{
                      maxHeight:
                        expandedItem === link.label
                          ? `${link.subLinks.length * 48}px`
                          : "0px",
                      opacity: expandedItem === link.label ? 1 : 0,
                    }}
                  >
                    <div className="pl-4 pb-4 flex flex-col gap-1">
                      {link.subLinks.map((subLink) => (
                        <a
                          key={subLink.label}
                          href={subLink.href}
                          className="menu-link text-black/70 text-xs md:text-sm uppercase tracking-[0.1em] py-2 block"
                        >
                          {subLink.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
