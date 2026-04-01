/**
 * [INPUT]:  @/styles/globals.css (theme system), Geist font family (next/font/local)
 * [OUTPUT]: Root <html> + <body> shell with global styles and font preload
 * [POS]:    App shell — wraps every page, loads global CSS + fonts. No viewport lock here.
 * [PROTOCOL]: Update this header on any layout change, then check CLAUDE.md
 */

import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { GeistPixelSquare } from "geist/font/pixel";
import { SkinProvider } from "@/lib/skin";
import "@/styles/globals.css";

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
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${GeistPixelSquare.variable}`} suppressHydrationWarning>
      <head>
        {/* Restore both skin and theme before first paint to avoid flash */}
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('fri-theme');if(t)document.documentElement.setAttribute('data-theme',t);var s=localStorage.getItem('fri-skin');document.documentElement.setAttribute('data-skin',s==='scifi'?'scifi':'xp')}catch(e){}` }} />
      </head>
      <body>
        <SkinProvider>{children}</SkinProvider>
      </body>
    </html>
  );
}
