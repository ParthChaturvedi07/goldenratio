"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowUp,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";
import { useSmoothScroll } from "./SmoothScrollProvider";

export default function Footer() {
  const { scroll } = useSmoothScroll();

  const scrollToTop = () => {
    if (scroll) {
      scroll.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative bg-[#0a0a0a] text-white pt-20 pb-10 px-6 md:px-10 lg:px-16 xl:px-20 overflow-hidden border-t border-white/10">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2a7a6e]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1440px] mx-auto">
        {/* ── TOP SECTION: CALL TO ACTION BANNER ── */}
        <div className="pb-16 mb-16 border-b border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[1px] bg-[#2a7a6e]" />
              <p className="text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-[#2a7a6e] font-semibold">
                INITIATE A PROJECT
              </p>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-white max-w-[700px] leading-[1.08]">
              Have a Vision in Mind? <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-[#2a7a6e]">
                Let&apos;s Build It Together.
              </span>
            </h2>
          </div>

          <div className="shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black text-xs font-bold uppercase tracking-[0.18em] hover:bg-[#2a7a6e] hover:text-white transition-all duration-500 shadow-xl group"
            >
              <span>Start Conversation</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        {/* ── MIDDLE SECTION: MULTI-COLUMN NAVIGATION ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-20 border-b border-white/10">
          {/* Col 1: Studio Brand Summary (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Image
                  src="/images/GoldenRatio_Creation.png"
                  alt="Golden Ratio Creation Logo"
                  width={140}
                  height={50}
                  className="h-10 w-auto object-contain brightness-0 invert"
                />
              </div>
              <p className="text-xs md:text-sm text-white/60 uppercase tracking-wider leading-relaxed max-w-[360px] font-light mb-6">
                Golden Ratio Creation is a Bhopal-based design and build studio specializing in Architecture, Luxury Interior Design, Miniature Scale Model Making, and Turnkey Construction.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs tracking-widest text-white/40 uppercase">
              <span className="w-2 h-2 rounded-full bg-[#2a7a6e] animate-pulse" />
              <span>Studio HQ — Bhopal, MP, India</span>
            </div>
          </div>

          {/* Col 2: Navigation Links (2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2a7a6e] mb-6">
              Navigation
            </h3>
            <ul className="flex flex-col gap-3 text-xs md:text-sm uppercase tracking-wider font-light text-white/70">
              <li>
                <Link
                  href="/"
                  className="hover:text-white transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  className="hover:text-white transition-colors duration-300"
                >
                  Our Journey
                </Link>
              </li>
              <li>
                <Link
                  href="/technology-and-innovation"
                  className="hover:text-white transition-colors duration-300"
                >
                  Tech & Innovation
                </Link>
              </li>
              <li>
                <Link
                  href="/our-projects"
                  className="hover:text-white transition-colors duration-300"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors duration-300 text-white font-medium"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Expertise & Services (3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2a7a6e] mb-6">
              Design & Build
            </h3>
            <ul className="flex flex-col gap-3 text-xs md:text-sm uppercase tracking-wider font-light text-white/70">
              <li>
                <Link
                  href="/design-and-build/architecture"
                  className="hover:text-white transition-colors duration-300"
                >
                  Architecture
                </Link>
              </li>
              <li>
                <Link
                  href="/design-and-build/interior-design"
                  className="hover:text-white transition-colors duration-300"
                >
                  Interior Design
                </Link>
              </li>
              <li>
                <Link
                  href="/design-and-build"
                  className="hover:text-white transition-colors duration-300"
                >
                  Scale Model Making
                </Link>
              </li>
              <li>
                <Link
                  href="/design-and-build/mep-engineering"
                  className="hover:text-white transition-colors duration-300"
                >
                  MEP Engineering
                </Link>
              </li>
              <li>
                <Link
                  href="/design-and-build/construction"
                  className="hover:text-white transition-colors duration-300"
                >
                  Turnkey Construction
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Socials (3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2a7a6e] mb-6">
              Studio Direct
            </h3>
            <div className="flex flex-col gap-4 text-xs md:text-sm text-white/70 uppercase tracking-wider font-light">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#2a7a6e] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  E-8 Arera Colony, Bhopal, MP 462039
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#2a7a6e] shrink-0" />
                <a
                  href="tel:+917554908822"
                  className="hover:text-white transition-colors"
                >
                  +91 755 490 8822
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#2a7a6e] shrink-0" />
                <a
                  href="mailto:contact@goldenratio.build"
                  className="hover:text-white transition-colors lowercase tracking-normal"
                >
                  contact@goldenratio.build
                </a>
              </div>

              {/* Social Pills */}
              <div className="flex items-center gap-3 pt-4">
                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-[#2a7a6e] hover:text-white transition-all duration-300"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-[#2a7a6e] hover:text-white transition-all duration-300"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/919826000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-[#2a7a6e] hover:text-white transition-all duration-300"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── VERY BOTTOM SECTION: GIANT LOGO WATERMARK ── */}
        <div className="py-12 md:py-16 overflow-hidden flex flex-col items-center justify-center relative select-none">
          <div className="w-full flex items-center justify-between gap-4 md:gap-8 opacity-90 transition-opacity duration-700 hover:opacity-100">
            {/* Left Logo Icon */}
            <div className="shrink-0 hidden sm:block">
              <Image
                src="/images/GoldenRatio_Creation.png"
                alt="Golden Ratio Emblem"
                width={120}
                height={120}
                className="w-16 sm:w-24 md:w-32 lg:w-40 h-auto object-contain brightness-0 invert opacity-40"
              />
            </div>

            {/* Giant Architectural Typographic Watermark */}
            <h1 className="text-[12vw] sm:text-[13vw] md:text-[13.5vw] font-black uppercase tracking-tighter text-white/15 leading-none text-center whitespace-nowrap w-full">
              GOLDENRATIO
            </h1>

            {/* Right Logo Icon */}
            <div className="shrink-0 hidden sm:block">
              <Image
                src="/images/GoldenRatio_Creation.png"
                alt="Golden Ratio Emblem"
                width={120}
                height={120}
                className="w-16 sm:w-24 md:w-32 lg:w-40 h-auto object-contain brightness-0 invert opacity-40"
              />
            </div>
          </div>
        </div>

        {/* ── COPYRIGHT & SUB-FOOTER BAR ── */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] md:text-xs text-white/40 uppercase tracking-[0.15em]">
          <p>© {new Date().getFullYear()} Golden Ratio Creation. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <span>Bhopal, MP, India</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-white/70 hover:text-[#2a7a6e] transition-colors cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
