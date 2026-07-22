"use client";

import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSmoothScroll } from "./SmoothScrollProvider";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  Building2,
  Ruler,
  Compass,
  Zap,
  Hammer,
  MessageSquare,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const servicesList = [
  { id: "architecture", label: "Architecture", icon: Building2 },
  { id: "interior", label: "Interior Design", icon: Compass },
  { id: "models", label: "Scale Model Making", icon: Ruler },
  { id: "mep", label: "MEP Engineering", icon: Zap },
  { id: "construction", label: "Construction", icon: Hammer },
  { id: "tech", label: "Smart Integration", icon: Sparkles },
];

const budgetRanges = [
  "₹15L – ₹35L",
  "₹35L – ₹75L",
  "₹75L – ₹1.5Cr",
  "₹1.5Cr+",
];

export default function ContactSection() {
  const { isReady } = useSmoothScroll();
  const sectionRef = useRef<HTMLElement | null>(null);
  const heroTextRef = useRef<HTMLDivElement | null>(null);
  const formCardRef = useRef<HTMLDivElement | null>(null);
  const infoCardRef = useRef<HTMLDivElement | null>(null);
  const nextStepsRef = useRef<HTMLDivElement | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [selectedServices, setSelectedServices] = useState<string[]>([
    "Architecture",
  ]);
  const [selectedBudget, setSelectedBudget] = useState<string>("₹35L – ₹75L");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleService = (serviceLabel: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceLabel)
        ? prev.filter((s) => s !== serviceLabel)
        : [...prev, serviceLabel]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate luxury submission experience
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  useEffect(() => {
    if (!isReady) return;

    const scrollContainer = document.querySelector(
      "#smooth-scroll-container"
    ) as HTMLElement;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          scroller: scrollContainer,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      if (heroTextRef.current) {
        tl.fromTo(
          heroTextRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
          0
        );
      }

      if (formCardRef.current) {
        tl.fromTo(
          formCardRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
          0.2
        );
      }

      if (infoCardRef.current) {
        tl.fromTo(
          infoCardRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
          0.35
        );
      }

      if (nextStepsRef.current) {
        tl.fromTo(
          nextStepsRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
          0.5
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isReady]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 bg-[#f5f2ec] text-black min-h-screen pt-10 pb-8 md:pt-16 md:pb-10 px-6 md:px-10 lg:px-16 xl:px-20"
      id="contact-section"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* ── HERO HEADER ── */}
        <div ref={heroTextRef} className="mb-16 md:mb-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-[#2a7a6e]" />
            <p className="text-[11px] md:text-[12px] tracking-[0.2em] uppercase text-[#2a7a6e] font-semibold">
              BHOPAL STUDIO & GLOBAL INQUIRIES
            </p>
          </div>
          <h1 className="text-black text-[2.4rem] sm:text-[3.2rem] md:text-[4rem] lg:text-[4.6rem] font-bold uppercase leading-[1.02] tracking-[-0.02em] max-w-[1000px] mb-6">
            Let's Build Something <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a1a1a] via-[#2a7a6e] to-[#1a1a1a]">
              Extraordinary Together
            </span>
          </h1>
          <p className="text-black/70 text-xs md:text-sm lg:text-base tracking-[0.04em] uppercase leading-relaxed max-w-[720px] font-light">
            Whether you are conceptualizing a commercial landmark, luxury residence,
            or miniature scale model — our team of architects, designers, and engineers is ready to turn vision into reality.
          </p>
        </div>

        {/* ── TWO-COLUMN SECTION: FORM + STUDIO DETAILS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start mb-24 md:mb-32">
          {/* LEFT COLUMN: INTERACTIVE FORM (7 COLS) */}
          <div
            ref={formCardRef}
            className="lg:col-span-7 bg-[#ede9e1] rounded-3xl p-8 sm:p-10 md:p-12 border border-black/10 shadow-[6px_6px_20px_rgba(0,0,0,0.05),-6px_-6px_20px_rgba(255,255,255,0.8)]"
          >
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-black/10">
              <div>
                <h2 className="text-lg md:text-xl font-bold uppercase tracking-wider text-black">
                  Project Inquiry Form
                </h2>
                <p className="text-xs text-black/50 tracking-wider uppercase mt-1">
                  Tell us about your space and requirements
                </p>
              </div>
              <MessageSquare className="w-6 h-6 text-[#2a7a6e] opacity-80" />
            </div>

            {isSubmitted ? (
              <div className="py-16 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#2a7a6e]/10 text-[#2a7a6e] flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold uppercase tracking-tight mb-3">
                  Inquiry Received
                </h3>
                <p className="text-sm text-black/70 max-w-md leading-relaxed uppercase tracking-wider mb-8">
                  Thank you for reaching out to Golden Ratio. Our principal studio team will review your inquiry and connect with you within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ fullName: "", email: "", phone: "", message: "" });
                  }}
                  className="px-6 py-3 rounded-full border border-black/20 text-xs font-semibold uppercase tracking-[0.15em] hover:bg-black hover:text-white transition-all duration-300 cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                {/* Personal Information Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.15em] text-black/70">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikramaditya Sharma"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full bg-[#f5f2ec] border border-black/15 rounded-xl px-4 py-3.5 text-sm text-black placeholder:text-black/30 focus:outline-none focus:border-[#2a7a6e] transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.15em] text-black/70">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. vikram@domain.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-[#f5f2ec] border border-black/15 rounded-xl px-4 py-3.5 text-sm text-black placeholder:text-black/30 focus:outline-none focus:border-[#2a7a6e] transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.15em] text-black/70">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full bg-[#f5f2ec] border border-black/15 rounded-xl px-4 py-3.5 text-sm text-black placeholder:text-black/30 focus:outline-none focus:border-[#2a7a6e] transition-colors"
                  />
                </div>

                {/* Service Selection Pills */}
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.15em] text-black/70">
                    Required Services (Select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {servicesList.map((service) => {
                      const Icon = service.icon;
                      const isSelected = selectedServices.includes(
                        service.label
                      );
                      return (
                        <button
                          type="button"
                          key={service.id}
                          onClick={() => toggleService(service.label)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                            isSelected
                              ? "bg-[#1a1a1a] text-white shadow-md"
                              : "bg-[#f5f2ec] text-black/80 hover:bg-black/10 border border-black/10"
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-[#2a7a6e]" : "text-black/50"}`} />
                          {service.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Budget Selection Pills */}
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.15em] text-black/70">
                    Estimated Budget Range
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {budgetRanges.map((budget) => {
                      const isSelected = selectedBudget === budget;
                      return (
                        <button
                          type="button"
                          key={budget}
                          onClick={() => setSelectedBudget(budget)}
                          className={`py-3 px-3 text-center rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                            isSelected
                              ? "bg-[#2a7a6e] text-white shadow-md"
                              : "bg-[#f5f2ec] text-black/70 border border-black/10 hover:bg-black/10"
                          }`}
                        >
                          {budget}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Message Input */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.15em] text-black/70">
                    Project Brief & Location Details
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your site area, vision, architectural goals, or timeline..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full bg-[#f5f2ec] border border-black/15 rounded-xl p-4 text-sm text-black placeholder:text-black/30 focus:outline-none focus:border-[#2a7a6e] transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 w-full py-4 px-8 rounded-full bg-[#1a1a1a] text-white text-xs font-semibold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#2a7a6e] transition-all duration-500 shadow-lg cursor-pointer group disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting Inquiry...</span>
                  ) : (
                    <>
                      <span>Submit Inquiry</span>
                      <Send className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* RIGHT COLUMN: STUDIO INFO & MAP CARD (5 COLS) */}
          <div ref={infoCardRef} className="lg:col-span-5 flex flex-col gap-8">
            {/* Studio Headquarters Card */}
            <div className="bg-[#0a0a0a] text-white rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#2a7a6e]/20 blur-3xl rounded-full pointer-events-none" />

              <span className="text-[10px] tracking-[0.2em] uppercase text-[#2a7a6e] font-semibold mb-2 block">
                HEADQUARTERS
              </span>
              <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-8">
                Bhopal Studio
              </h2>

              <div className="flex flex-col gap-6 text-xs md:text-sm tracking-wider uppercase">
                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-[#2a7a6e]" />
                  </div>
                  <div>
                    <p className="text-white/50 text-[10px] font-semibold mb-1">
                      STUDIO ADDRESS
                    </p>
                    <p className="text-white/90 leading-relaxed">
                      Golden Ratio Design & Build Studio,
                      <br />
                      E-8 Arera Colony, Near Service Road,
                      <br />
                      Bhopal, Madhya Pradesh 462039, India
                    </p>
                  </div>
                </div>

                {/* Direct Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-[#2a7a6e]" />
                  </div>
                  <div>
                    <p className="text-white/50 text-[10px] font-semibold mb-1">
                      DIRECT LINE
                    </p>
                    <a
                      href="tel:+917554908822"
                      className="text-white/90 hover:text-[#2a7a6e] transition-colors block"
                    >
                      +91 755 490 8822
                    </a>
                    <a
                      href="tel:+919826000000"
                      className="text-white/70 hover:text-[#2a7a6e] transition-colors block mt-0.5"
                    >
                      +91 98260 00000
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-[#2a7a6e]" />
                  </div>
                  <div>
                    <p className="text-white/50 text-[10px] font-semibold mb-1">
                      EMAIL INQUIRIES
                    </p>
                    <a
                      href="mailto:contact@goldenratio.build"
                      className="text-white/90 hover:text-[#2a7a6e] transition-colors block lowercase tracking-normal text-sm"
                    >
                      contact@goldenratio.build
                    </a>
                    <a
                      href="mailto:inquiry@goldenratio.build"
                      className="text-white/70 hover:text-[#2a7a6e] transition-colors block lowercase tracking-normal text-sm mt-0.5"
                    >
                      inquiry@goldenratio.build
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-[#2a7a6e]" />
                  </div>
                  <div>
                    <p className="text-white/50 text-[10px] font-semibold mb-1">
                      STUDIO HOURS
                    </p>
                    <p className="text-white/90">
                      Mon – Sat: 9:30 AM – 7:30 PM IST
                    </p>
                    <p className="text-white/40 text-[10px] mt-0.5">
                      Sunday: By Prior Appointment
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Link */}
              <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between">
                <a
                  href="https://maps.google.com/?q=Arera+Colony+Bhopal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#2a7a6e] hover:text-white transition-colors group"
                >
                  <span>Open in Google Maps</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>

            {/* Direct Connect / Quick Communication Card */}
            <div className="bg-[#ede9e1] rounded-3xl p-8 border border-black/10 flex flex-col justify-between gap-6 shadow-[6px_6px_16px_rgba(0,0,0,0.04)]">
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-black/50 font-semibold mb-2">
                  INSTANT CONNECT
                </p>
                <h3 className="text-xl font-bold uppercase tracking-tight text-black mb-2">
                  Prefer WhatsApp Consultation?
                </h3>
                <p className="text-xs text-black/70 leading-relaxed uppercase tracking-wider">
                  Connect directly with our senior design leads on WhatsApp for immediate architectural & pricing consultations.
                </p>
              </div>

              <a
                href="https://wa.me/919826000000?text=Hi%20Golden%20Ratio%20Team%2C%20I%20would%20like%20to%20discuss%20a%20new%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-full bg-[#2a7a6e] text-white text-xs font-semibold uppercase tracking-[0.15em] flex items-center justify-center gap-2 hover:bg-[#1a1a1a] transition-all duration-300 shadow-md cursor-pointer"
              >
                <span>Chat on WhatsApp</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* ── BOTTOM SECTION: CONSULTATION PROCESS BREAKDOWN ── */}
        <div ref={nextStepsRef} className="pt-16 border-t border-black/10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-[#2a7a6e] font-semibold mb-3">
                OUR CONSULTATION WORKFLOW
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-black">
                What Happens Next?
              </h2>
            </div>
            <p className="text-xs md:text-sm text-black/60 uppercase tracking-wider max-w-[420px]">
              Our streamlined 3-step consultation ensures complete clarity on proportions, scale, budget, and timelines before building starts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-[#ede9e1] rounded-2xl p-8 border border-black/10 flex flex-col justify-between gap-6">
              <div>
                <span className="text-2xl font-bold text-[#2a7a6e] tracking-tight block mb-4">
                  01
                </span>
                <h3 className="text-base font-bold uppercase tracking-wider text-black mb-3">
                  Initial Discovery Call
                </h3>
                <p className="text-xs text-black/70 leading-relaxed uppercase tracking-wider font-light">
                  Within 24 hours of receiving your inquiry, our principal architect schedules a detailed call to review site specs, design goals, and budget framing.
                </p>
              </div>
              <div className="w-full h-1 bg-black/10 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-[#2a7a6e]" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#ede9e1] rounded-2xl p-8 border border-black/10 flex flex-col justify-between gap-6">
              <div>
                <span className="text-2xl font-bold text-[#2a7a6e] tracking-tight block mb-4">
                  02
                </span>
                <h3 className="text-base font-bold uppercase tracking-wider text-black mb-3">
                  Proportion & Scale Analysis
                </h3>
                <p className="text-xs text-black/70 leading-relaxed uppercase tracking-wider font-light">
                  We present miniature 3D scale models, spatial layouts, and material palettes to visualize every millimeter of your dream space before execution.
                </p>
              </div>
              <div className="w-full h-1 bg-black/10 rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-[#2a7a6e]" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#ede9e1] rounded-2xl p-8 border border-black/10 flex flex-col justify-between gap-6">
              <div>
                <span className="text-2xl font-bold text-[#2a7a6e] tracking-tight block mb-4">
                  03
                </span>
                <h3 className="text-base font-bold uppercase tracking-wider text-black mb-3">
                  Turnkey Execution Proposal
                </h3>
                <p className="text-xs text-black/70 leading-relaxed uppercase tracking-wider font-light">
                  Complete transparent breakdown covering procurement, MEP engineering, construction schedules, and project milestone handovers.
                </p>
              </div>
              <div className="w-full h-1 bg-black/10 rounded-full overflow-hidden">
                <div className="w-full h-full bg-[#2a7a6e]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
