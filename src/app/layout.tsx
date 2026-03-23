import type { Metadata } from "next";
import { Agentation } from "agentation";
import { SquircleNoScript } from "@squircle-js/react";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AgentModeProvider } from "@/components/providers/AgentModeProvider";
import { GlobalHaptics } from "@/components/shared/GlobalHaptics";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Charles Shin – Portfolio",
  description: "Hello! I'm Charles, a software designer building ai + onchain experiences based in Chicago.",
  icons: {
    icon: "/images/favicon.png",
  },
  openGraph: {
    title: "Charles Shin – Portfolio",
    description: "Hello! I'm Charles, a software designer building ai + onchain experiences based in Chicago.",
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
        className="font-sans antialiased max-w-[100vw]"
        suppressHydrationWarning
      >
        <SquircleNoScript />
        <GlobalHaptics />
        <ThemeProvider>
          <AgentModeProvider>
            {children}
          </AgentModeProvider>
        </ThemeProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#f0fdf4',
              border: 'none',
              color: '#15803d',
              padding: '8px 16px',
            },
          }}
        />
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
