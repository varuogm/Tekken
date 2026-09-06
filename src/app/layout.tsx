import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Barlow_Condensed } from "next/font/google";
import { BottomNav } from "@/components/BottomNav";
import { Providers } from "@/components/Providers";
import "./globals.css";

const display = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Barlow_Condensed({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
});

const PREVIEW_IMAGE =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfoAufKLxR0qUEHbAVkhpyg6PnGtl6eFv6ii_TwKWcYaCS1J6LPSUpQ5KY&s=10";

export const metadata: Metadata = {
  title: "Tekken Leaderboard",
  description: "Private Tekken league leaderboard and match tracker",
  openGraph: {
    title: "Tekken Leaderboard",
    description: "Private Tekken league leaderboard and match tracker",
    type: "website",
    images: [
      {
        url: PREVIEW_IMAGE,
        alt: "Tekken League",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tekken League",
    description: "Private Tekken league leaderboard and match tracker",
    images: [PREVIEW_IMAGE],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Tekken League",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#07070d",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} antialiased`}>
        <Providers>
          {children}
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
