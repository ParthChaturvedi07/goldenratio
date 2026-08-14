"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

interface MenuLink {
  label: string;
  sectionId?: string; // scroll to section on same page
  href?: string;      // navigate to a separate page
  subLinks?: { label: string; sectionId?: string; href?: string }[];
}

const menuLinks: MenuLink[] = [
  { label: "ABOUT US", sectionId: "about-section" },
  {
    label: "SERVICES",
    sectionId: "services-section",
    subLinks: [
      { label: "MINIATURE MODEL MAKING", sectionId: "services-section" },
      { label: "ALLIED SERVICES", sectionId: "services-section" },
    ],
  },
  { label: "WHY US", sectionId: "why-us-section" },
  { label: "OUR PROCESS", sectionId: "process-section" },
  { label: "PROJECTS", href: "/projects" },
  { label: "PRODUCTS", href: "/products" },
  { label: "TESTIMONIALS", sectionId: "clients-testimonials-section" },
  { label: "CONTACT US", sectionId: "contact-section" },
];

interface MenuDrawerProps {
  isOpen: boolean;
  onClose?: () => void;
}

export default function MenuDrawer({ isOpen, onClose }: MenuDrawerProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const navPanelRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const hasInitialised = useRef(false);

  const toggleExpand = (label: string) => {
    setExpandedItem(expandedItem === label ? null : label);
  };

  const handleNavClick = useCallback(
    (link: { sectionId?: string; href?: string }) => {
      if (link.href) {
        // Navigate to a separate page
        onClose?.();
        router.push(link.href);
      } else if (link.sectionId) {
        // Scroll to section
        onClose?.();
        // Small delay to allow menu close animation to start
        setTimeout(() => {
          const target = document.querySelector(`#${link.sectionId}`);
          if (!target) return;
          target.scrollIntoView({ behavior: "smooth" });
        }, 400);
      }
    },
    [onClose, router]
  );

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
        className="fixed inset-0 z-40 flex lg:hidden"
        style={{ visibility: "hidden", pointerEvents: "none" }}
      >
        {/* Backdrop */}
        <div
          ref={backdropRef}
          className="absolute inset-0 bg-black/10"
          style={{ opacity: 0 }}
        />

        {/* Navigation panel (slides from bottom) — full width */}
        <div
          ref={navPanelRef}
          className="w-full bg-[#f0ece4] flex flex-col justify-end px-8 md:px-12 pb-16 pt-28 overflow-y-auto"
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
                  <button
                    onClick={() => handleNavClick(link)}
                    className="menu-link text-black text-sm md:text-base font-semibold uppercase tracking-[0.12em] py-4 block bg-transparent border-none cursor-pointer text-left"
                  >
                    {link.label}
                  </button>
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
                        <button
                          key={subLink.label}
                          onClick={() => handleNavClick(subLink)}
                          className="menu-link text-black/70 text-xs md:text-sm uppercase tracking-[0.1em] py-2 block bg-transparent border-none cursor-pointer text-left"
                        >
                          {subLink.label}
                        </button>
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

