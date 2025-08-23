import type { Metadata } from "next";
import "./globals.css";
import "./background.css";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/context/language-context";
import { PT_Sans } from "next/font/google";

const ptSans = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pt-sans",
  display: "swap", // Optimize font loading
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Manvaasam - Empowering Farmers, Delivering Freshness",
    template: "%s | Manvaasam"
  },
  description: "Empowering Farmers, Delivering Freshness. Connect farmers, hubs, customers, and restaurants in a seamless agricultural marketplace.",
  keywords: ["agriculture", "farmers", "fresh produce", "marketplace", "farm to table"],
  authors: [{ name: "Manvaasam Team" }],
  creator: "Manvaasam",
  publisher: "Manvaasam",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
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
    description: "Connect farmers, hubs, customers, and restaurants in a seamless agricultural marketplace.",
    siteName: "Manvaasam",
  },
  twitter: {
    card: "summary_large_image",
    title: "Manvaasam - Empowering Farmers, Delivering Freshness",
    description: "Connect farmers, hubs, customers, and restaurants in a seamless agricultural marketplace.",
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
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="//fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Performance hints */}
        <meta name="theme-color" content="#22c55e" />
        <meta name="color-scheme" content="light" />
        
        {/* Critical CSS inlined for faster rendering */}
        <style dangerouslySetInnerHTML={{
          __html: `
            body { 
              font-family: ${ptSans.style.fontFamily}, system-ui, -apple-system, sans-serif;
              margin: 0;
              padding: 0;
              overflow-x: hidden;
            }
            .mobile-container { 
              width: 100%; 
              max-width: 100vw; 
              overflow-x: hidden; 
            }
          `
        }} />
      </head>
      <body className={`${ptSans.variable} font-sans antialiased`}>
        <LanguageProvider>
          <AuthProvider>{children}</AuthProvider>
        </LanguageProvider>
        <Toaster />
      </body>
    </html>
  );
}
