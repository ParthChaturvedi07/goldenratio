"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ClientLogoTicker from "@/components/ClientLogoTicker";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import WhyUsSection from "@/components/WhyUsSection";
import ProcessSection from "@/components/ProcessSection";
import Testimonials from "@/components/Testimonials";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ClouCloneSection from "@/components/ClouCloneSection";
import ServicesSection from "@/components/ServicesSection";
import ProjectsSection from "@/components/ProjectsSection";
// import Preloader from "@/components/Preloader";

export default function Home() {
  // const [preloaderDone, setPreloaderDone] = useState(false);

  // // Check sessionStorage on mount — skip preloader if already seen
  // useEffect(() => {
  //   if (typeof window !== "undefined" && sessionStorage.getItem("preloaderDone")) {
  //     setPreloaderDone(true);
  //   }
  // }, []);

  // // Lock scroll during preloader
  // useEffect(() => {
  //   if (!preloaderDone) {
  //     document.body.style.overflow = "hidden";
  //   } else {
  //     document.body.style.overflow = "";
  //   }
  //   return () => {
  //     document.body.style.overflow = "";
  //   };
  // }, [preloaderDone]);

  return (
    <>
      {/* ── Preloader Overlay ─────────────────────────────── */}
      {/* {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />} */}

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
          <WhyUsSection />
        </div>

        <div data-scroll-section>
          <ProcessSection />
        </div>

        <div data-scroll-section>
          <ServicesSection />
        </div>

        <div data-scroll-section>
          <ProjectsSection />
        </div>

        <div data-scroll-section>
          <ClouCloneSection />
        </div>

        <div data-scroll-section>
          <Testimonials />
        </div>

        <div data-scroll-section>
          <ContactSection />
        </div>

        <div data-scroll-section>
          <Footer />
        </div>
      </SmoothScrollProvider>
    </>
  );
}
