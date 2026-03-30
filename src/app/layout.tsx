/**
 * [INPUT]:  @/styles/globals.css (theme system), Geist font family (next/font/local)
 * [OUTPUT]: Root <html> + <body> shell with global styles and font preload
 * [POS]:    App shell — wraps every page, loads global CSS + fonts. No viewport lock here.
 * [PROTOCOL]: Update this header on any layout change, then check CLAUDE.md
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "FRI Interface v3.28",
  description: "Intelligent Assistant — Portfolio Shell for Friday",
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="font-suse">{children}</body>
    </html>
  );
}
