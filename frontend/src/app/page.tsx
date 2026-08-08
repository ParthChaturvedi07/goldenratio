"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ClientLogoTicker from "@/components/ClientLogoTicker";
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

      <Navbar />

      <div className="relative z-0">
        <HeroSection />
      </div>

      <div>
        <AboutSection />
        <ClientLogoTicker />
      </div>

      <div>
        <WhyUsSection />
      </div>

      <div>
        <ProcessSection />
      </div>

      <div>
        <ServicesSection />
      </div>

      <div>
        <ProjectsSection />
      </div>

      <div>
        <ClouCloneSection />
      </div>

      <div>
        <Testimonials />
      </div>

      <div>
        <ContactSection />
      </div>

      <div>
        <Footer />
      </div>
    </>
  );
}
