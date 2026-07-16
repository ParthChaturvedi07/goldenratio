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
  title: "AbvTek | Design & Build Company in Dubai | Architecture, Interior & Technology",
  description:
    "At AbvTek, we blend innovation and intelligence to design the spaces of tomorrow. Where design meets data, where ideas become built realities.",
  keywords: ["design", "build", "architecture", "interior", "technology", "Dubai", "innovation"],
  openGraph: {
    title: "AbvTek | Design & Build Company in Dubai",
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
