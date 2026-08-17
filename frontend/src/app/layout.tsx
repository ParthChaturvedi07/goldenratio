import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import JsonLd from "../components/JsonLd";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://grcreation.in"),
  title: {
    default:
      "Golden Ratio Creation | Design & Build Company in Bhopal | Architecture, Interior & Miniature Models",
    template: "%s | Golden Ratio Creation",
  },
  description:
    "Golden Ratio Creation is a Bhopal-based design studio specializing in miniature model making, interior design, architecture, and turnkey construction. We blend creativity, engineering, and detailing to design the spaces of tomorrow.",
  keywords: [
    "Golden Ratio Creation",
    "miniature model making Bhopal",
    "scale model makers India",
    "interior design Bhopal",
    "architectural model Bhopal",
    "momento making",
    "turnkey construction Bhopal",
    "design and build studio Bhopal",
    "luxury interior design",
    "MEP engineering",
    "3D scale models",
    "architecture firm Bhopal",
    "miniature scale model",
    "design studio Madhya Pradesh",
    "construction company Bhopal",
  ],
  authors: [{ name: "Golden Ratio Creation", url: "https://grcreation.in" }],
  creator: "Golden Ratio Creation",
  publisher: "Golden Ratio Creation",
  category: "Architecture & Design",
  alternates: {
    canonical: "https://grcreation.in",
  },
  openGraph: {
    title: "Golden Ratio Creation | Design & Build Company in Bhopal",
    description:
      "Bhopal-based design studio specializing in miniature model making, interior design, architecture, and turnkey construction. Where design meets data, where ideas become built realities.",
    url: "https://grcreation.in",
    siteName: "Golden Ratio Creation",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/images/GoldenRatio_Creation.png",
        width: 800,
        height: 600,
        alt: "Golden Ratio Creation — Design & Build Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Golden Ratio Creation | Design & Build Company in Bhopal",
    description:
      "Miniature model making, interior design, architecture & turnkey construction. Bhopal-based studio delivering world-class designs.",
    images: ["/images/GoldenRatio_Creation.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Uncomment and add verification codes when available:
  // verification: {
  //   google: "YOUR_GOOGLE_VERIFICATION_CODE",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-outfit)]">
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
