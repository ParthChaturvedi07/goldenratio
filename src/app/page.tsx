"use client";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <Navbar />

      {/* Hero Section — Sticky so next section scrolls over it */}
      <div data-scroll-section className="sticky top-0 z-0">
        <HeroSection />
      </div>

      {/* About Section — scrolls over hero with parallax image */}
      <div data-scroll-section>
        <AboutSection />
      </div>
    </SmoothScrollProvider>
  );
}
