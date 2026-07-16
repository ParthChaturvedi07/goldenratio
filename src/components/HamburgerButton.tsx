"use client";

import React from "react";

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
  dark?: boolean;
}

export default function HamburgerButton({
  isOpen,
  onClick,
  dark = false,
}: HamburgerButtonProps) {
  return (
    <button
      id="hamburger-menu-button"
      onClick={onClick}
      className={`relative z-50 flex flex-col items-center justify-center gap-[6px] w-10 h-10 cursor-pointer transition-colors duration-500 ${
        isOpen ? "hamburger-open" : ""
      } ${dark ? "text-black" : "text-white"}`}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
    >
      <span className="hamburger-line" />
      <span className="hamburger-line" />
      <span className="hamburger-line" />
    </button>
  );
}
