import type { Metadata } from "next";
import { Agentation } from "agentation";
import { SquircleNoScript } from "@squircle-js/react";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AgentModeProvider } from "@/components/providers/AgentModeProvider";
import { GlobalHaptics } from "@/components/shared/GlobalHaptics";
import { ClickSpark } from "@/components/shared/ClickSpark";
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
            {children}
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
