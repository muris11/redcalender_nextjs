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
  metadataBase: new URL("https://redcalender.my.id"),
  title: {
    default: "Red Calender - Pantau Siklus Menstruasi & Kesehatan Reproduksi",
    template: "%s | Red Calender",
  },
  description:
    "Red Calender adalah aplikasi pemantau siklus menstruasi, prediksi masa subur, analisis kesehatan reproduksi, dan edukasi lengkap untuk wanita Indonesia. Gratis dan mudah digunakan.",
  keywords: [
    "Red Calender",
    "red calender",
    "kalender menstruasi",
    "aplikasi haid",
    "pemantau menstruasi",
    "siklus menstruasi",
    "prediksi masa subur",
    "kesehatan reproduksi",
    "kalender haid",
    "periode tracker",
    "menstrual calendar",
    "ovulasi",
    "kesuburan wanita",
    "kesehatan wanita Indonesia",
    "aplikasi kesehatan wanita",
  ],
  authors: [{ name: "Red Calender Team", url: "https://redcalender.my.id" }],
  creator: "Red Calender",
  publisher: "Red Calender",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "android-chrome",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
      },
      {
        rel: "android-chrome",
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
      },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://redcalender.my.id",
    siteName: "Red Calender",
    title: "Red Calender - Pantau Siklus Menstruasi & Kesehatan Reproduksi",
    description:
      "Aplikasi pemantau siklus menstruasi, prediksi masa subur, analisis kesehatan reproduksi, dan edukasi lengkap untuk wanita Indonesia.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Red Calender Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@redcalender",
    creator: "@redcalender",
    title: "Red Calender - Pantau Siklus Menstruasi & Kesehatan Reproduksi",
    description:
      "Aplikasi pemantau siklus menstruasi, prediksi masa subur, dan edukasi kesehatan reproduksi untuk wanita Indonesia.",
    images: ["/logo.png"],
  },
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
  alternates: {
    canonical: "https://redcalender.my.id",
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Red Calender",
              alternateName: "Red Calender",
              url: "https://redcalender.my.id",
              description:
                "Aplikasi pemantau siklus menstruasi, prediksi masa subur, dan edukasi kesehatan reproduksi untuk wanita Indonesia.",
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://redcalender.my.id/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Red Calender",
              alternateName: "Red Calender",
              url: "https://redcalender.my.id",
              logo: "https://redcalender.my.id/logo.png",
              description:
                "Aplikasi kesehatan reproduksi wanita Indonesia untuk memantau siklus menstruasi dan prediksi masa subur.",
              sameAs: [
                "https://www.facebook.com/redcalender",
                "https://www.instagram.com/redcalender",
                "https://twitter.com/redcalender",
              ],
            }),
          }}
        />
      </head>
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
