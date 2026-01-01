import type { Metadata, Viewport } from "next";

import "../styles/hide-scrollbar.css";
import "./globals.css";
import "./background.css";
import "../styles/auth-animations.css";
import "../styles/scroll-fix.css";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "@/components/ui/toaster";
import { FirebaseErrorBoundary } from "@/components/firebase-error-boundary";
// Using system fonts for better compatibility with Next.js 16.0.0 + Turbopack
const fontFamily =
  "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

export const metadata: Metadata = {
  title: {
    default: "Manvaasam - Empowering Farmers, Delivering Freshness",
    template: "%s | Manvaasam",
  },
  description:
    "Empowering Farmers, Delivering Freshness. Connect farmers, hubs, customers, and restaurants in a seamless agricultural marketplace.",
  keywords: [
    "agriculture",
    "farmers",
    "fresh produce",
    "marketplace",
    "farm to table",
  ],
  authors: [{ name: "Manvaasam Team" }],
  creator: "Manvaasam",
  publisher: "Manvaasam",

  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://manvaasam.com",
    title: "Manvaasam - Empowering Farmers, Delivering Freshness",
    description:
      "Connect farmers, hubs, customers, and restaurants in a seamless agricultural marketplace.",
    siteName: "Manvaasam",
  },
  twitter: {
    card: "summary_large_image",
    title: "Manvaasam - Empowering Farmers, Delivering Freshness",
    description:
      "Connect farmers, hubs, customers, and restaurants in a seamless agricultural marketplace.",
  },
  icons: {
    icon: [
      { url: "/bg-agri.png", sizes: "32x32", type: "image/png" },
      { url: "/bg-agri.png", sizes: "16x16", type: "image/png" },
      { url: "/bg-agri.png", sizes: "48x48", type: "image/png" },
    ],
    shortcut: "/bg-agri.png",
    apple: [
      { url: "/bg-agri.png", sizes: "180x180", type: "image/png" },
      { url: "/bg-agri.png", sizes: "152x152", type: "image/png" },
      { url: "/bg-agri.png", sizes: "144x144", type: "image/png" },
      { url: "/bg-agri.png", sizes: "120x120", type: "image/png" },
      { url: "/bg-agri.png", sizes: "114x114", type: "image/png" },
      { url: "/bg-agri.png", sizes: "76x76", type: "image/png" },
      { url: "/bg-agri.png", sizes: "72x72", type: "image/png" },
      { url: "/bg-agri.png", sizes: "60x60", type: "image/png" },
      { url: "/bg-agri.png", sizes: "57x57", type: "image/png" },
    ],
    other: [
      {
        rel: "icon",
        url: "/bg-agri.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/bg-agri.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#22c55e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload critical resources */}
        <link rel="preload" href="/bg-agri.png" as="image" />

        {/* Performance hints */}
        <meta name="theme-color" content="#22c55e" />
        <meta name="color-scheme" content="light" />

        {/* Critical CSS inlined for faster rendering */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            * {
              box-sizing: border-box;
              -webkit-tap-highlight-color: transparent;
            }
            html {
              font-size: 16px;
              -webkit-text-size-adjust: 100%;
              text-size-adjust: 100%;
              scroll-behavior: smooth;
              overflow-x: hidden;
              overflow-y: auto;
              height: 100%;
              scrollbar-width: none !important;
              -ms-overflow-style: none !important;
            }
            html::-webkit-scrollbar {
              display: none !important;
              width: 0px !important;
              height: 0px !important;
              opacity: 0 !important;
              visibility: hidden !important;
            }
            body { 
              font-family: ${fontFamily};
              margin: 0;
              padding: 0;
              overflow-x: hidden;
              overflow-y: auto;
              width: 100%;
              min-height: 100vh;
              position: relative;
              scrollbar-width: none !important;
              -ms-overflow-style: none !important;
            }
            body::-webkit-scrollbar {
              display: none !important;
              width: 0px !important;
              height: 0px !important;
              opacity: 0 !important;
              visibility: hidden !important;
            }
            .mobile-container { 
              width: 100%; 
              max-width: 100vw; 
              overflow-x: hidden; 
              scrollbar-width: none !important;
              -ms-overflow-style: none !important;
            }
            .mobile-container::-webkit-scrollbar {
              display: none !important;
              width: 0px !important;
              height: 0px !important;
              opacity: 0 !important;
              visibility: hidden !important;
            }
            /* Universal scrollbar hiding */
            *::-webkit-scrollbar {
              display: none !important;
              width: 0px !important;
              height: 0px !important;
              opacity: 0 !important;
              visibility: hidden !important;
            }
            * {
              scrollbar-width: none !important;
              -ms-overflow-style: none !important;
            }
            /* Fast navigation optimizations */
            .page-transitioning {
              cursor: wait;
            }
            .page-transitioning * {
              pointer-events: none;
              user-select: none;
            }
            /* Responsive utilities */
            @media (max-width: 768px) {
              .space-y-6 > * + * { margin-top: 1rem !important; }
              .gap-6 { gap: 1rem !important; }
              .p-8 { padding: 1rem !important; }
              .px-8 { padding-left: 1rem !important; padding-right: 1rem !important; }
              .py-8 { padding-top: 1rem !important; padding-bottom: 1rem !important; }
            }
          `,
          }}
        />
      </head>
      <body
        className="font-sans antialiased scroll-enabled hide-scrollbar no-scrollbar"
        suppressHydrationWarning
      >
        <FirebaseErrorBoundary>
          <AuthProvider>{children}</AuthProvider>
        </FirebaseErrorBoundary>
        <Toaster />
      </body>
    </html>
  );
}
