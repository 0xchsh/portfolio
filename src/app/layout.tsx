import type { Metadata } from "next";
import { Agentation } from "agentation";
import { SquircleNoScript } from "@squircle-js/react";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AgentModeProvider } from "@/components/providers/AgentModeProvider";
import { GlobalHaptics } from "@/components/shared/GlobalHaptics";
import { ClickSpark } from "@/components/shared/ClickSpark";
import { PlayerProvider } from "@/components/shared/MiniPlayer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { V2TopFade } from "@/components/home/V2TopFade";
import { V2BottomFade } from "@/components/home/V2BottomFade";
import { PageHeader } from "@/components/home/PageHeader";
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
      <head>
        <script src="https://cdn.visitors.now/v.js" data-token="e209edb5-006f-43c7-b9e2-907ff33b3b31"></script>
      </head>
      <body
        className="font-sans antialiased max-w-[100vw]"
        suppressHydrationWarning
      >
        <SquircleNoScript />
        <GlobalHaptics />
        <ClickSpark />
        <ThemeProvider>
          <AgentModeProvider>
            <TooltipProvider>
              <PlayerProvider>
                <div className="min-h-screen bg-background text-foreground">
                  <V2TopFade />
                  <V2BottomFade />

                  <div className="group/page">
                    {/* Persistent header (pathname-aware wrapper) */}
                    <PageHeader />

                    {/* Page content */}
                    <div className="max-w-[900px] mx-auto px-5 sm:px-8 pb-16">
                      {children}
                    </div>
                  </div>
                </div>
              </PlayerProvider>
            </TooltipProvider>
          </AgentModeProvider>
        </ThemeProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: 'var(--toast-success-bg)',
              border: 'none',
              color: 'var(--toast-success-fg)',
              padding: '8px 16px',
              boxShadow: '0 1px 3px rgb(0 0 0 / 0.06)',
            },
          }}
        />
        {process.env.NODE_ENV === "development" && <Agentation />}

      </body>
    </html>
  );
}
