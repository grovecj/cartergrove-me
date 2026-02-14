import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/layout/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { BannerDisplay } from "@/components/layout/BannerDisplay";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
        className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}
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
