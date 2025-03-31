import { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QRHistoryProvider } from "./contexts/QRHistoryContext";
import { Toaster } from "./components/ui/toaster";
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EaseQR - 편리한 QR 코드 생성기",
  description: "URL, 연락처, WiFi 등 다양한 정보를 담은 QR 코드를 쉽게 생성하고 공유하세요.",
  manifest: "/manifest.json",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: "#0284c7",
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EaseQR"
  },
  formatDetection: {
    telephone: false
  },
  openGraph: {
    type: "website",
    siteName: "EaseQR",
    title: "EaseQR - 편리한 QR 코드 생성기",
    description: "URL, 연락처, WiFi 등 다양한 정보를 담은 QR 코드를 쉽게 생성하고 공유하세요.",
    images: [{ url: "/og-image.png" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "EaseQR - 편리한 QR 코드 생성기",
    description: "URL, 연락처, WiFi 등 다양한 정보를 담은 QR 코드를 쉽게 생성하고 공유하세요.",
    images: [{ url: "/og-image.png" }]
  },
  verification: {
    google: "google5e54b9135fd78760",
    other: {
      "naver": "naverb0082d0a40b6d4e5c10c12874b1ffbbc",
      "verification": "320fb29340e4a11c"
    }
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="application-name" content="EaseQR" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="EaseQR" />
        <meta name="google-site-verification" content="google5e54b9135fd78760" />
        <meta name="naver-site-verification" content="naverb0082d0a40b6d4e5c10c12874b1ffbbc" />
        <meta name="verification" content="320fb29340e4a11c" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <QRHistoryProvider>
          {children}
          <Toaster />
          <Analytics />
        </QRHistoryProvider>
      </body>
    </html>
  );
}
