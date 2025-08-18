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
});

export const metadata: Metadata = {
  title: "Manvaasam",
  description: "Empowering Farmers, Delivering Freshness.",
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
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
      <body className={`${ptSans.variable} font-sans antialiased`}>
        <LanguageProvider>
          <AuthProvider>{children}</AuthProvider>
        </LanguageProvider>
        <Toaster />
      </body>
    </html>
  );
}
