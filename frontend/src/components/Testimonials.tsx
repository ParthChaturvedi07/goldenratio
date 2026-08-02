"use client";

import { ClientsSection } from "@/components/testimonial-card";
import type { Stat, Testimonial } from "@/components/testimonial-card";

/* ── Section Data ────────────────────────────────────────── */
const statsData: Stat[] = [
  { value: "50+", label: "Projects Delivered" },
  { value: "100%", label: "Client Satisfaction" },
  { value: "4.9", label: "Average Rating" },
];

const testimonialsData: Testimonial[] = [
  {
    name: "Will Smith",
    title: "Harper Education",
    quote:
      "Collaborating on this project was seamless. The vision was clearly understood, and the designs genuinely reflect my brand identity.",
    avatarSrc:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    rating: 5.0,
  },
  {
    name: "Ikta Sollork",
    title: "PARAL CEO",
    quote:
      "Working with this process was effortless. The vision was understood perfectly, and the scale model truly represented our architectural vision.",
    avatarSrc:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80",
    rating: 4.7,
  },
  {
    name: "Alex Johnson",
    title: "Innovate Tech",
    quote:
      "A truly transformative partnership. The end result exceeded all of our expectations and set a new benchmark for physical space presentation.",
    avatarSrc:
      "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=400&auto=format&fit=crop&q=80",
    rating: 4.9,
  },
  {
    name: "Briana Patton",
    title: "Apex Developers",
    quote:
      "The miniature scale model provided crucial clarity for our investors. Exceptional precision, lighting, and detail throughout.",
    avatarSrc:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
    rating: 5.0,
  },
];

/* ── Wrapper Component ───────────────────────────────────── */
export default function Testimonials() {
  return (
    <ClientsSection
      tagLabel="Happy Clients"
      title="Clients Love Us"
      description="Trusted by 50+ clients delivering world-class interior design and scale models."
      stats={statsData}
      testimonials={testimonialsData}
      primaryActionLabel="Contact Now"
      secondaryActionLabel="See All Projects"
    />
  );
}
