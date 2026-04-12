import type { Metadata } from "next";
import Link from "next/link";
import { Agentation } from "agentation";
import { SquircleNoScript } from "@squircle-js/react";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AgentModeProvider } from "@/components/providers/AgentModeProvider";
import { GlobalHaptics } from "@/components/shared/GlobalHaptics";
import { ClickSpark } from "@/components/shared/ClickSpark";
import { FadeIn } from "@/components/shared/FadeIn";
import { Subtitle } from "@/components/shared/Subtitle";
import { PlayerProvider } from "@/components/shared/MiniPlayer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { V2TopFade } from "@/components/home/V2TopFade";
import { V2BottomFade } from "@/components/home/V2BottomFade";
import { V2Controls, DesktopControlsRow } from "@/components/home/V2Controls";
import { LiveClock } from "@/components/home/LiveClock";
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

                  <div className="group/page max-w-[900px] mx-auto px-5 sm:px-8 pt-12 pb-16">
                    {/* Persistent header */}
                    <div className="flex flex-col desktop:grid desktop:grid-cols-[320px_320px] desktop:gap-x-16 desktop:w-fit desktop:mx-auto">
                      <div>
                        <FadeIn>
                          <div className="mb-6 desktop:mb-8">
                            <Link href="/" className="block w-fit">
                              <h1 className="text-sm font-semibold text-foreground leading-snug group/name select-none w-fit">
                                <span>Ch</span>
                                <span className="transition-colors duration-150 group-hover/name:text-neutral-300 dark:group-hover/name:text-neutral-600">arles</span>{' '}
                                <span>Sh</span>
                                <span className="transition-colors duration-150 group-hover/name:text-neutral-300 dark:group-hover/name:text-neutral-600">in</span>
                              </h1>
                            </Link>
                            <Subtitle />
                          </div>
                        </FadeIn>
                      </div>

                      <FadeIn delay={50}>
                        <div className="desktop:pt-5">
                          {/* Controls + Time — desktop */}
                          <div className="hidden desktop:flex mb-8 items-center justify-between">
                            <DesktopControlsRow />
                            <span className="text-sm text-neutral-400 dark:text-neutral-600">
                              <LiveClock />
                            </span>
                          </div>

                          {/* Controls + Time — mobile */}
                          <div className="flex desktop:hidden mb-4 items-center justify-between">
                            <V2Controls />
                            <span className="text-sm text-neutral-400 dark:text-neutral-600">
                              <LiveClock />
                            </span>
                          </div>
                        </div>
                      </FadeIn>
                    </div>

                    {/* Page content */}
                    {children}
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
              background: '#dcfce7',
              border: 'none',
              color: '#15803d',
              padding: '8px 16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            },
          }}
        />
        {process.env.NODE_ENV === "development" && <Agentation />}

      </body>
    </html>
  );
}
