
import type { Metadata } from "next";
import "./globals.css";
import "./background.css";
import "./cursor.css";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/context/language-context";
import { PT_Sans } from 'next/font/google'
import CustomCursor from "@/components/custom-cursor";

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
})


export const metadata: Metadata = {
  title: "Manvaasam",
  description: "Empowering Farmers, Delivering Freshness.",
  icons: {
    icon: "/bg-agri.png",
    shortcut: "/bg-agri.png",
    apple: "/bg-agri.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${ptSans.variable} font-sans antialiased custom-cursor-container`}>
        <CustomCursor />
        <LanguageProvider>
          <AuthProvider>{children}</AuthProvider>
        </LanguageProvider>
        <Toaster />
      </body>
    </html>
  );
}
