"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import Logo from "./Logo";
import HamburgerButton from "./HamburgerButton";
import MenuDrawer from "./MenuDrawer";
import { useSmoothScroll } from "./SmoothScrollProvider";

// Threshold in px — after this distance from top, the navbar gets a solid bg
const SCROLL_BG_THRESHOLD = 100;

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hasBg, setHasBg] = useState(false);
  const { scroll } = useSmoothScroll();

  const lastScrollY = useRef(0);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  /* ── Listen to Locomotive Scroll events ────────────────── */
  useEffect(() => {
    if (!scroll) return;

    const onScroll = (args: { scroll: { y: number } }) => {
      const currentY = args.scroll.y;
      const delta = currentY - lastScrollY.current;

      if (delta > 5) {
        setHidden(true);
      } else if (delta < -5) {
        setHidden(false);
      }

      setHasBg(currentY > SCROLL_BG_THRESHOLD);
      lastScrollY.current = currentY;
    };

    scroll.on("scroll", onScroll);
    return () => scroll.off("scroll", onScroll);
  }, [scroll]);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          transform: hidden ? "translateY(-110%)" : "translateY(0)",
          backgroundColor: hasBg ? "rgba(245, 242, 236, 0.95)" : "transparent",
          backdropFilter: hasBg ? "blur(12px)" : "none",
          WebkitBackdropFilter: hasBg ? "blur(12px)" : "none",
          boxShadow: hasBg ? "0 1px 8px rgba(0,0,0,0.06)" : "none",
        }}
      >
        <nav className="flex items-center justify-between px-6 md:px-10 lg:px-12 py-2 md:py-3">
          <Logo dark />
          <HamburgerButton
            isOpen={isMenuOpen}
            onClick={toggleMenu}
            dark
          />
        </nav>
      </header>

      <MenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
