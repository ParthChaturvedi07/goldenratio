import type { Metadata } from "next";
import ProjectsPageClient from "./ProjectsPageClient";

export const metadata: Metadata = {
  title: "Projects — Our Portfolio",
  description:
    "Explore the full portfolio of Golden Ratio Creation — from highly detailed miniature scale models to expansive architectural masterplans and luxury interior designs in Bhopal.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects — Golden Ratio Creation Portfolio",
    description:
      "From miniature scale models to architectural masterplans. Explore our finest executions in design, model making, and interior architecture.",
    url: "/projects",
    type: "website",
    images: [
      {
        url: "/images/GoldenRatio_Creation.png",
        width: 800,
        height: 600,
        alt: "Golden Ratio Creation Projects",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects — Golden Ratio Creation",
    description:
      "From miniature scale models to architectural masterplans. Explore our finest executions.",
    images: ["/images/GoldenRatio_Creation.png"],
  },
};

export default function ProjectsPage() {
  return <ProjectsPageClient />;
}
