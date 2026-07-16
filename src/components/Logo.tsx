"use client";

import React from "react";

export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <a
      href="/"
      className={`relative z-50 text-[26px] md:text-[30px] font-bold tracking-tight leading-none transition-colors duration-500 ${
        dark ? "text-black" : "text-white"
      }`}
      aria-label="AbvTek Home"
    >
      abv<span className="font-light">//</span>tek
    </a>
  );
}
