import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const thmanyah = localFont({
  src: [
    { path: "../../public/fonts/thmanyahsans-Light.otf", weight: "300" },
    { path: "../../public/fonts/thmanyahsans-Regular.otf", weight: "400" },
    { path: "../../public/fonts/thmanyahsans-Medium.otf", weight: "500" },
    { path: "../../public/fonts/thmanyahsans-Bold.otf", weight: "700" },
    { path: "../../public/fonts/thmanyahsans-Black.otf", weight: "900" },
  ],
  variable: "--font-thmanyah",
});

export const metadata: Metadata = {
  title: "سند | علّم ابنك تقنيات المستقبل",
  description: "نحوّل شغف ابنك بالأجهزة إلى مهارات حقيقية بطريقة ممتعة وسهلة",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={cn("dark scroll-smooth", thmanyah.variable)}>
      <body className={cn(thmanyah.variable, "bg-background text-foreground antialiased")}>
        {children}
      </body>
    </html>
  );
}
