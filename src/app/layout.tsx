import type { Metadata } from "next";
import { Instrument_Serif, Outfit, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/layout/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { BannerDisplay } from "@/components/layout/BannerDisplay";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Carter Grove — Software Engineer",
    template: "%s | Carter Grove",
  },
  description:
    "Software engineer specializing in full-stack development with TypeScript, React, and Spring Boot.",
  metadataBase: new URL("https://cartergrove.me"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cartergrove.me",
    siteName: "Carter Grove",
    title: "Carter Grove — Software Engineer",
    description:
      "Software engineer specializing in full-stack development with TypeScript, React, and Spring Boot.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Carter Grove — Software Engineer",
    description:
      "Software engineer specializing in full-stack development with TypeScript, React, and Spring Boot.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${instrumentSerif.variable} ${outfit.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <Providers>
          <div className="flex min-h-svh flex-col">
            <Navbar />
            <BannerDisplay />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
