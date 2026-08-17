"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Logo from "./Logo";
import HamburgerButton from "./HamburgerButton";
import MenuDrawer from "./MenuDrawer";

// Threshold in px — after this distance from top, the navbar gets a solid bg
const SCROLL_BG_THRESHOLD = 100;

interface NavLinkItem {
  label: string;
  sectionId?: string;
  href?: string;
  isNew?: boolean;
  subLinks?: { label: string; sectionId?: string; href?: string }[];
}

const navLinks: NavLinkItem[] = [
  { label: "About Us", sectionId: "about-section" },
  {
    label: "Services",
    sectionId: "services-section",
    subLinks: [
      { label: "Miniature Model Making", sectionId: "services-section" },
      { label: "Momento Making", sectionId: "services-section" },
      { label: "Allied Services", sectionId: "services-section" },
    ],
  },
  { label: "Why Us", sectionId: "why-us-section" },
  { label: "Our Process", sectionId: "process-section" },
  { label: "Projects", href: "/projects" },
  { label: "STORE", href: "/products", isNew: true },
  { label: "Testimonials", sectionId: "clients-testimonials-section" },
  { label: "Contact Us", sectionId: "contact-section" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null);

  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleNavClick = useCallback(
    (link: { sectionId?: string; href?: string }) => {
      if (link.href) {
        router.push(link.href);
      } else if (link.sectionId) {
        if (pathname === "/") {
          const target = document.querySelector(`#${link.sectionId}`);
          if (target) target.scrollIntoView({ behavior: "smooth" });
        } else {
          sessionStorage.setItem("scrollToSection", link.sectionId);
          router.push("/"); 
        }
      }
      setHoveredDropdown(null);
    },
    [router, pathname]
  );

  const handleDropdownEnter = useCallback((label: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setHoveredDropdown(label);
  }, []);

  const handleDropdownLeave = useCallback(() => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setHoveredDropdown(null);
    }, 150);
  }, []);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          transform: "translateY(0)",
          backgroundColor: "rgba(245, 242, 236, 0.95)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
        }}
      >
        <nav className="flex items-center justify-between px-6 md:px-10 lg:px-12 py-2 md:py-3">
          <Logo dark />

          {/* ── Desktop nav links (hidden below lg) ── */}
          <ul className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <li
                key={link.label}
                className="relative"
                onMouseEnter={
                  link.subLinks ? () => handleDropdownEnter(link.label) : undefined
                }
                onMouseLeave={link.subLinks ? handleDropdownLeave : undefined}
              >
                <button
                  onClick={() => handleNavClick(link)}
                  className="desktop-nav-link text-black/80 hover:text-black text-[13px] xl:text-sm font-medium uppercase tracking-[0.08em] px-3 xl:px-4 py-2 bg-transparent border-none cursor-pointer transition-colors duration-300 relative flex items-center"
                >
                  {link.label}
                  {link.isNew && (
                    <span className="absolute -top-1 -right-2 bg-black text-white text-[6px] leading-none font-bold px-1.5 py-1 rounded-sm">
                      NEW
                    </span>
                  )}
                  {link.subLinks && (
                    <svg
                      className="inline-block ml-1 w-3 h-3 transition-transform duration-300"
                      style={{
                        transform:
                          hoveredDropdown === link.label
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                      }}
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 4.5L6 7.5L9 4.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>

                {/* Dropdown */}
                {link.subLinks && (
                  <div
                    className="absolute top-full left-0 pt-2"
                    style={{
                      opacity: hoveredDropdown === link.label ? 1 : 0,
                      visibility:
                        hoveredDropdown === link.label ? "visible" : "hidden",
                      transform:
                        hoveredDropdown === link.label
                          ? "translateY(0)"
                          : "translateY(-8px)",
                      transition:
                        "opacity 0.25s ease, transform 0.25s ease, visibility 0.25s ease",
                    }}
                  >
                    <div className="bg-white/95 backdrop-blur-md rounded-lg shadow-lg border border-black/5 py-2 min-w-[220px]">
                      {link.subLinks.map((sub) => (
                        <button
                          key={sub.label}
                          onClick={() => handleNavClick(sub)}
                          className="block w-full text-left px-5 py-2.5 text-xs xl:text-[13px] uppercase tracking-[0.06em] text-black/70 hover:text-black hover:bg-black/[0.03] transition-colors duration-200 bg-transparent border-none cursor-pointer"
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* ── Hamburger (visible only below lg) ── */}
          <div className="lg:hidden">
            <HamburgerButton
              isOpen={isMenuOpen}
              onClick={toggleMenu}
              dark
            />
          </div>
        </nav>
      </header>

      {/* MenuDrawer — mobile/tablet only */}
      <MenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
