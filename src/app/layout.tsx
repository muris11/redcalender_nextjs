import AuthInit from "@/components/AuthInit";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Red Calendar - Pantau Siklus Menstruasi & Kesehatan",
  description:
    "Aplikasi pemantau siklus menstruasi, prediksi masa subur, dan edukasi kesehatan reproduksi.",
  keywords: [
    "Red Calendar",
    "Menstruasi",
    "Kesehatan Reproduksi",
    "Kalender Haid",
    "Next.js",
    "React",
  ],
  authors: [{ name: "Red Calendar Team" }],
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "Red Calendar",
    description: "Pantau siklus menstruasi dan kesehatan reproduksi Anda.",
    url: "https://redcalendar.com",
    siteName: "Red Calendar",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Red Calendar",
    description: "Pantau siklus menstruasi dan kesehatan reproduksi Anda.",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthInit />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
