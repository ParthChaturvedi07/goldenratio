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
import Preloader from "@/components/Preloader";

export default function Home() {
  const [preloaderDone, setPreloaderDone] =
    useState(false);

  useEffect(() => {
    const alreadySeen =
      sessionStorage.getItem("preloaderDone");

    if (alreadySeen === "true") {
      setPreloaderDone(true);
    }
  }, []);

  useEffect(() => {
    if (!preloaderDone) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [preloaderDone]);

  return (
    <>
      {!preloaderDone && (
        <Preloader
          onComplete={() => setPreloaderDone(true)}
        />
      )}

      <Navbar />

      <div className="relative z-0">
        <HeroSection isPreloaderDone={preloaderDone} />
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
