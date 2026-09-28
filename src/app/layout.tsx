import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: { default: "Aster | Zihan's Instinct", template: "%s | Aster" },
  description: "Aster is Zihan's Instinct. A personal place for notes, observations, and the work in between.",
  icons: { icon: "/aster-mark.svg" },
  openGraph: { title: "Aster | Zihan's Instinct", description: "Present for the work. Attentive to the rest.", type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}><body>{children}</body></html>;
}
