import type { Metadata } from "next";
import ProductsPageClient from "./ProductsPageClient";

export const metadata: Metadata = {
  title: "Products — Architectural Models & Miniatures Store",
  description:
    "Discover our curated collection of architectural scale models, miniature creations, and bespoke momentos. Each product is crafted with meticulous detail and precision engineering by Golden Ratio Creation, Bhopal.",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Products — Golden Ratio Creation Store",
    description:
      "Architectural scale models, miniatures, and bespoke creations. Crafted with precision by Golden Ratio Creation.",
    url: "/products",
    type: "website",
    images: [
      {
        url: "/images/GoldenRatio_Creation.png",
        width: 800,
        height: 600,
        alt: "Golden Ratio Creation Products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Products — Golden Ratio Creation Store",
    description:
      "Architectural scale models, miniatures, and bespoke creations. Crafted with precision.",
    images: ["/images/GoldenRatio_Creation.png"],
  },
};

export default function ProductsPage() {
  return <ProductsPageClient />;
}
