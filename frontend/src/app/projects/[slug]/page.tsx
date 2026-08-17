import type { Metadata } from "next";
import { fetchProject, getMediaUrl } from "@/lib/api";
import ProjectDetailClient from "./ProjectDetailClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const project = await fetchProject(slug);
    const imageUrl = project.image
      ? getMediaUrl(project.image).startsWith("http")
        ? getMediaUrl(project.image)
        : `https://grcreation.in${getMediaUrl(project.image)}`
      : "/images/GoldenRatio_Creation.png";

    return {
      title: `${project.title} — ${project.category}`,
      description:
        project.description ||
        `${project.title} — a ${project.category} project by Golden Ratio Creation, Bhopal. Explore design details, gallery, and concept.`,
      alternates: {
        canonical: `/projects/${slug}`,
      },
      openGraph: {
        title: `${project.title} — Golden Ratio Creation`,
        description:
          project.description ||
          `Explore ${project.title}, a ${project.category} project by Golden Ratio Creation.`,
        url: `/projects/${slug}`,
        type: "article",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: project.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${project.title} — Golden Ratio Creation`,
        description:
          project.description ||
          `Explore ${project.title} by Golden Ratio Creation.`,
        images: [imageUrl],
      },
    };
  } catch {
    return {
      title: "Project",
      description: "View project details at Golden Ratio Creation.",
    };
  }
}

export default async function ProjectDetailsPage({ params }: Props) {
  const { slug } = await params;
  return <ProjectDetailClient slug={slug} />;
}