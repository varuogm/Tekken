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

export const metadata: Metadata = {
  title: "Tekken Battle League",
  description: "Private Tekken league leaderboard and match tracker",
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
