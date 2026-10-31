import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AiAgent from "@/components/ai-againt";
import { TrialModal } from "@/components/trial-modal";
import { ThemeProvider } from "@/components/theme-provider";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const thmanyahSans = localFont({
  src: [
    { path: "../../public/fonts/thmanyahsans-Light.woff2", weight: "300", style: "normal" },
    { path: "../../public/fonts/thmanyahsans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/thmanyahsans-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/thmanyahsans-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/thmanyahsans-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-thmanyah",
  display: "swap",
});

const thmanyahDisplay = localFont({
  src: [
    { path: "../../public/fonts/thmanyahserifdisplay-Light.woff2", weight: "300", style: "normal" },
    { path: "../../public/fonts/thmanyahserifdisplay-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/thmanyahserifdisplay-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/thmanyahserifdisplay-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/thmanyahserifdisplay-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-thmanyah-display",
  display: "swap",
});

const thmanyahText = localFont({
  src: [
    { path: "../../public/fonts/thmanyahseriftext-Light.woff2", weight: "300", style: "normal" },
    { path: "../../public/fonts/thmanyahseriftext-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/thmanyahseriftext-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/thmanyahseriftext-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/thmanyahseriftext-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-thmanyah-text",
  display: "swap",
});

export const metadata: Metadata = {
  title: "سند | علّم ابنك تقنيات المستقبل",
  description: "نحوّل شغف ابنك بالأجهزة إلى مهارات حقيقية بطريقة ممتعة وسهلة",
  icons: {
    icon: [{ url: "/logos/favicon.svg", type: "image/svg+xml" }, { url: "/favicon.ico" }],
    shortcut: "/logos/favicon.svg",
    apple: "/logos/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={cn(
        "scroll-smooth",
        thmanyahSans.variable,
        thmanyahDisplay.variable,
        thmanyahText.variable,
        geist.variable
      )}
      suppressHydrationWarning
    >
      <body
        className={cn(
          thmanyahDisplay.variable,
          thmanyahSans.variable,
          thmanyahText.variable,
          "bg-background text-foreground antialiased min-h-screen flex flex-col overflow-x-clip font-heading"
        )}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="sanad-theme-v2"
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1 flex flex-col max-w-screen overflow-x-clip">
            {children}
          </main>
          <Footer />
          <AiAgent />
          <TrialModal />
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
