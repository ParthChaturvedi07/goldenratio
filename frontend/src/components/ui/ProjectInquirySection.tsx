"use client";

import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Send,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectInquirySection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const heroTextRef = useRef<HTMLDivElement | null>(null);
  const formCardRef = useRef<HTMLDivElement | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^[a-zA-Z\s]{2,50}$/.test(formData.fullName.trim())) {
      return alert("Please enter a valid name (letters and spaces only, 2-50 characters).");
    }
    if (!formData.email.toLowerCase().endsWith("@gmail.com")) {
      return alert("Please use a valid @gmail.com email address.");
    }
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      return alert("Please enter a valid 10-digit phone number.");
    }
    const wordCount = formData.message.trim() ? formData.message.trim().split(/\s+/).length : 0;
    if (wordCount > 300) {
      return alert("Message cannot exceed 300 words.");
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setIsSubmitted(true);
      } else {
        alert(data.errors?.join(', ') || data.message || 'Something went wrong.');
      }
    } catch (err) {
      console.error('Contact form error:', err);
      alert('Failed to submit. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 bg-[#f5f2ec] text-black pt-10 pb-20 md:pb-28 px-6 md:px-10 lg:px-16 xl:px-20"
    >
      {/* ── HERO HEADER ── */}
      <div ref={heroTextRef} className="mb-16 md:mb-20 text-left">
        <div className="flex items-center gap-4 mb-6 md:mb-8 justify-start">
          <span className="w-10 md:w-12 h-[1px] bg-black/40" />
          <p className="text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-black/60 font-bold">
            Enquire About This Product
          </p>
        </div>
        <h1 className="text-[3rem] sm:text-[4.5rem] md:text-[5.5rem] lg:text-[6.5rem] font-black uppercase tracking-tighter leading-[0.9] text-black break-words mb-8">
          Curious About <br />
          <span className="text-black/40">This One?</span>
        </h1>
        <p className="text-black/60 text-lg md:text-xl font-light leading-relaxed max-w-2xl md:mx-0 mx-auto">
          Have questions about how this project came together? Want a
          detailed walkthrough, a cost breakdown, or the design brief
          behind it? Or maybe you&apos;re imagining something similar for
          your own space — either way, drop us a note and our team will
          get back to you personally.
        </p>
      </div>

      <div className="max-w-[1000px] mx-auto">
        {/* ── INQUIRY FORM ── */}
        <div
          ref={formCardRef}
          className="bg-[#ede9e1] rounded-3xl p-8 sm:p-10 md:p-12 border border-black/10 shadow-[6px_6px_20px_rgba(0,0,0,0.05),-6px_-6px_20px_rgba(255,255,255,0.8)]"
          id="contact-section"
       >
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-black /10">
        <div>
          <h2 className="text-lg md:text-xl font-bold uppercase tracking-wider text-black">
            Project Inquiry Form
          </h2>
          <p className="text-xs text-black/50 tracking-wider uppercase mt-1">
            Ask about this project or request something similar
          </p>
        </div>
        <MessageSquare className="w-6 h-6 text-black/80 opacity-80" />
      </div>

      {isSubmitted ? (
        <div className="py-16 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-black/10 text-black flex items-center justify-center mb-6">
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
                placeholder="e.g. Rahul Singh"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full bg-[#f5f2ec] border border-black/15 rounded-xl px-4 py-3.5 text-sm text-black placeholder:text-black/30 focus:outline-none focus:border-black/50 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.15em] text-black/70">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="e.g. rahul@gmail.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full bg-[#f5f2ec] border border-black/15 rounded-xl px-4 py-3.5 text-sm text-black placeholder:text-black/30 focus:outline-none focus:border-black/50 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.15em] text-black/70">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full bg-[#f5f2ec] border border-black/15 rounded-xl px-4 py-3.5 text-sm text-black placeholder:text-black/30 focus:outline-none focus:border-black/50 transition-colors"
            />
          </div>

          {/* Message Input */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.15em] text-black/70">
              What Would You Like To Know?
            </label>
            <textarea
              rows={4}
              required
              placeholder="Ask about materials, timeline, cost, or tell us you'd like something similar for your own project..."
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full bg-[#f5f2ec] border border-black/15 rounded-xl p-4 text-sm text-black placeholder:text-black/30 focus:outline-none focus:border-black/50 transition-colors resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full py-4 px-8 rounded-full bg-black text-white text-xs font-semibold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-black/80 transition-all duration-500 shadow-lg cursor-pointer group disabled:opacity-50"
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
      </div >
    </section >
  );
}