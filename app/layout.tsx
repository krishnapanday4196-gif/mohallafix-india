import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { InstallAppPrompt } from "@/components/ui/InstallAppPrompt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "MohallaFix India | Report. Track. Resolve.",
  description:
    "National civic defect reporting and grievance management platform enabling Indian citizens to file geotagged complaints, track SLA progress, and connect with municipal officers.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MohallaFix",
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col pb-20 md:pb-0 font-sans bg-[#f8fafc] text-slate-900 selection:bg-emerald-500/20">
        <InstallAppPrompt />
        {children}
        <MobileBottomNav />
      </body>
    </html>
  );
}
