"use client";

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
        <WhyUsSection />
      </div>

      <div data-scroll-section>
        <ProcessSection />
      </div>

      <div data-scroll-section>
        <ServicesSection />
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
  );
}
