import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Agentation } from "agentation";
import { SquircleNoScript } from "@squircle-js/react";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hello Anthropic - Portfolio Review",
  description: "Interactive design portfolio presentation",
  icons: {
    icon: "/images/favicon.png",
  },
  openGraph: {
    title: "Hello Anthropic - Portfolio Review",
    description: "Interactive design portfolio presentation",
    images: ["/images/og-image.png"],
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
        className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <SquircleNoScript />
        <ThemeProvider>
          {children}
        </ThemeProvider>
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
