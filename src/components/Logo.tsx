"use client";

import React from "react";

export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <a
      href="/"
      className={`relative z-50 text-[26px] md:text-[30px] font-bold tracking-tight leading-none transition-colors duration-500 ${dark ? "text-black" : "text-white"
        }`}
      aria-label="AbvTek Home"
    >
      <img src="/images/GoldenRatio_Creation.png" alt="Logo" className="w-24" />
    </a>
  );
}
