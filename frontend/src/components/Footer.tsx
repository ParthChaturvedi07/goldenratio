"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
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

export default function Footer() {
  const [isStaffMenuOpen, setIsStaffMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScroll = (id: string) => {
    if (pathname === "/") {
      const target = document.querySelector(id);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      sessionStorage.setItem("scrollToSection", id.replace("#", ""));
      router.push("/");
    }
  };

  return (
    <footer className="relative bg-[#0a0a0a] text-white pt-20 pb-10 px-6 md:px-10 lg:px-16 xl:px-20 overflow-hidden border-t border-white/10">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1440px] mx-auto">
        {/* ── TOP SECTION: CALL TO ACTION BANNER ── */}
        <div className="pb-16 mb-16 border-b border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-4 mb-6 md:mb-8">
              <span className="w-10 md:w-12 h-[1px] bg-white/30" />
              <p className="text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-white/50 font-bold">
                INITIATE A PROJECT
              </p>
            </div>
            <h2 className="text-[3rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[7.5rem] font-black uppercase tracking-[-0.02em] text-white leading-[0.85] max-w-[1000px] mb-8">
              Have a Vision? <br />
              <span className="text-white/30">
                Let&apos;s Build It.
              </span>
            </h2>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => handleScroll("#contact-section")}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black text-xs font-bold uppercase tracking-[0.18em] hover:bg-white/80 transition-all duration-500 shadow-xl group cursor-pointer"
            >
              <span>Start Conversation</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
            </button>
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
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>Studio HQ — Bhopal, MP, India</span>
            </div>
          </div>

          {/* Col 2: Navigation Links (2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 mb-6">
              Navigation
            </h3>
            <ul className="flex flex-col gap-3 text-xs md:text-sm uppercase tracking-wider font-light text-white/70">
              <li>
                <button
                  onClick={() => {
                    if (pathname === "/") {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    } else {
                      router.push("/");
                    }
                  }}
                  className="hover:text-white transition-colors duration-300 bg-transparent border-none cursor-pointer text-white/70 text-xs md:text-sm uppercase tracking-wider font-light"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScroll("#about-section")}
                  className="hover:text-white transition-colors duration-300 bg-transparent border-none cursor-pointer text-white/70 text-xs md:text-sm uppercase tracking-wider font-light"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScroll("#services-section")}
                  className="hover:text-white transition-colors duration-300 bg-transparent border-none cursor-pointer text-white/70 text-xs md:text-sm uppercase tracking-wider font-light"
                >
                  Services
                </button>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="hover:text-white transition-colors duration-300"
                >
                  Projects
                </Link>
              </li>
              <li>
                <button
                  onClick={() => handleScroll("#contact-section")}
                  className="hover:text-white transition-colors duration-300 bg-transparent border-none cursor-pointer text-white/70 text-xs md:text-sm uppercase tracking-wider font-light text-white font-medium"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Expertise & Services (3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 mb-6">
              Design & Build
            </h3>
            <ul className="flex flex-col gap-3 text-xs md:text-sm uppercase tracking-wider font-light text-white/70">
               <li>
                <Link
                  href="#"
                  className="hover:text-white cursor-default transition-colors duration-300"
                >
                  Scale Model Making
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-white cursor-default transition-colors duration-300"
                >
                  Momento Making
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-white cursor-default transition-colors duration-300"
                >
                  Allied Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Socials (3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 mb-6">
              Studio Direct
            </h3>
            <div className="flex flex-col gap-4 text-xs md:text-sm text-white/70 uppercase tracking-wider font-light">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-white/50 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  26 Ambedkar Nagar Suraj Nagar Bhopal 462044
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-white/50 shrink-0" />
                <a
                  href="tel:+917554908822"
                  className="hover:text-white transition-colors"
                >
                  +91 966-954-7084, +91 798-707-8460
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-white/50 shrink-0" />
                <a
                  href="mailto:goldenratio554@gmail.com"
                  className="hover:text-white transition-colors lowercase tracking-normal"
                >
                  goldenratio554@gmail.com
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
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-white hover:text-black transition-all duration-300"
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
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-white hover:text-black transition-all duration-300"
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
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-white hover:text-black transition-all duration-300"
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
            {/* <div className="shrink-0 hidden sm:block">
              <Image
                src="/images/GoldenRatio_Creation.png"
                alt="Golden Ratio Emblem"
                width={120}
                height={120}
                className="w-16 sm:w-24 md:w-32 lg:w-40 h-auto object-contain brightness-0 invert opacity-40"
              />
            </div> */}

            {/* Giant Architectural Typographic Watermark */}
            <h1 className="text-[clamp(2.8rem,11vw,11rem)] font-black uppercase text-white/15 leading-[0.85] text-center whitespace-nowrap w-full">
              GOLDENRATIO
            </h1>
          </div>
        </div>

        {/* ── COPYRIGHT & SUB-FOOTER BAR ── */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] md:text-xs text-white/40 uppercase tracking-[0.15em]">
          <p>© {new Date().getFullYear()} Golden Ratio Creation. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <span>Bhopal, MP, India</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── STAFF BUTTON & POPUP ── */}
        <div className="opacity-40 hover:opacity-60 transition-all duration-300 absolute bottom-28 md:bottom-28 right-6 md:right-10 lg:right-16 xl:right-20 z-50 flex flex-col items-end gap-3">
          {isStaffMenuOpen && (
            <div className="flex flex-col gap-2 p-3 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300 min-w-[140px]">
              <a
                href="https://goldenratio-8hnm.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-[10px] md:text-xs text-white/60 hover:text-white border border-white/10 hover:border-white/30 rounded transition-all text-center uppercase tracking-[0.15em]"
              >
                Admin
              </a>
              <a
                href="https://mail.hostinger.com/auth/login"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-[10px] md:text-xs text-white/60 hover:text-white border border-white/10 hover:border-white/30 rounded transition-all text-center uppercase tracking-[0.15em]"
              >
                Mailboxes
              </a>
            </div>
          )}
          <button
            onClick={() => setIsStaffMenuOpen(!isStaffMenuOpen)}
            className="px-3 py-1.5 text-[10px] md:text-xs text-white/40 hover:text-white/90 border border-white/20 hover:border-white/40 rounded-full transition-all uppercase tracking-[0.15em] bg-black/50 backdrop-blur-sm"
          >
            Staff
          </button>
        </div>
      </div>
    </footer>
  );
}
