import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ncmt.com.au"),
  title: {
    default: "NCMT Transport — Freight that never stops moving",
    template: "%s | NCMT Transport",
  },
  description:
    "Family-owned transport and freight company. General freight, regional distribution and dedicated fleet services across Australia.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "NCMT Transport",
    description:
      "Family-owned transport and freight company. Freight that never stops moving.",
    type: "website",
    locale: "en_AU",
    url: "/",
    siteName: "NCMT Transport",
    images: [
      {
        url: "/videos/hero-still.jpg",
        width: 1920,
        height: 1080,
        alt: "NCMT road train on the highway at sunrise",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NCMT Transport",
    description:
      "Family-owned transport and freight company. Freight that never stops moving.",
    images: ["/videos/hero-still.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-AU"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
