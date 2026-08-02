import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GoldenRatio | Design & Build Company in Bhopal | Architecture, Interior & Technology",
  description:
    "At GoldenRatio, we blend innovation and intelligence to design the spaces of tomorrow. Where design meets data, where ideas become built realities.",
  keywords: ["design", "build", "architecture", "interior", "technology", "Bhopal", "innovation"],
  openGraph: {
    title: "GoldenRatio | Design & Build Company in Bhopal",
    description: "Where design meets data. Where ideas become built realities.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-outfit)]">
        {children}
      </body>
    </html>
  );
}
