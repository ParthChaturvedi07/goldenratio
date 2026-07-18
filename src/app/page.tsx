"use client";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ClientLogoTicker from "@/components/ClientLogoTicker";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import OurServices from "@/components/OurServices";
import WhyUsSection from "@/components/WhyUsSection";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <Navbar />

      <div data-scroll-section className="sticky top-0 z-0">
        <HeroSection />
      </div>

      <div data-scroll-section>
        <AboutSection />
        <ClientLogoTicker />
      </div>

      <div data-scroll-section>
        <OurServices />
      </div>

      <div data-scroll-section>
        <WhyUsSection />
      </div>
    </SmoothScrollProvider>
  );
}
