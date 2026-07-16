"use client";

import React, { useState, useCallback } from "react";
import Logo from "./Logo";
import HamburgerButton from "./HamburgerButton";
import MenuDrawer from "./MenuDrawer";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <nav className="flex items-center justify-between px-6 md:px-10 lg:px-12 py-2 md:py-3">
          {/* Logo — always black */}
          <Logo dark />

          {/* Right side */}
          <div className="flex items-center gap-6 md:gap-8">
            {/* CONTACT US — hidden on mobile/tablet, always black */}
            <a
              href="/contact"
              className="hidden lg:inline-block nav-link-underline text-xs font-semibold uppercase tracking-[0.15em] text-black transition-colors duration-500"
              id="contact-us-link"
            >
              CONTACT US
            </a>

            {/* Hamburger — always black */}
            <HamburgerButton
              isOpen={isMenuOpen}
              onClick={toggleMenu}
              dark
            />
          </div>
        </nav>
      </header>

      {/* Menu Drawer */}
      <MenuDrawer isOpen={isMenuOpen} />
    </>
  );
}

