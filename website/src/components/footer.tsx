"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, ArrowUpLeft } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa6";
import Container from "./container";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const EXPLORE_ITEMS = [
  { label: "المسارات التعليمية", href: "/tracks" },
  { label: "الكورسات والبرامج", href: "/courses" },
  { label: "باقات الاشتراكات", href: "/pricing" },
  { label: "معسكرات سَنَد", href: "/#bootcamps" },
  { label: "فريق العمل", href: "/team" },
];

const CONTACT_ITEMS = [
  { 
    label: "+201022805731", 
    href: "https://wa.me/+201022805731", 
    icon: FaWhatsapp,
    isExternal: true,
    dir: "ltr" as const,
    hoverColor: "group-hover:text-[#25D366] group-hover:border-[#25D366] group-hover:bg-[#25D366]/10",
  },
  { 
    label: "gamal.htg@gmail.com", 
    href: "mailto:gamal.htg@gmail.com", 
    icon: Mail,
    isExternal: true,
    dir: "ltr" as const,
    hoverColor: "group-hover:text-[#EA4335] group-hover:border-[#EA4335] group-hover:bg-[#EA4335]/10",
  },
  { 
    label: "سيدي سالم - كفر الشيخ", 
    href: undefined, 
    icon: MapPin,
    isExternal: false,
    dir: "rtl" as const,
    hoverColor: "group-hover:text-primary group-hover:border-primary group-hover:bg-primary/10",
  },
];

const SOCIAL_LINKS = [
  {
    name: "Facebook",
    handle: "sanad",
    icon: FaFacebookF,
    href: "https://facebook.com",
    hoverColor: "hover:text-[#1877F2]",
  },
  {
    name: "Instagram",
    handle: "sanad",
    icon: FaInstagram,
    href: "https://instagram.com",
    hoverColor: "hover:text-[#E4405F]",
  },
  {
    name: "LinkedIn",
    handle: "sanad",
    icon: FaLinkedinIn,
    href: "https://linkedin.com",
    hoverColor: "hover:text-[#0A66C2]",
  },
  {
    name: "YouTube",
    handle: "sanad",
    icon: FaYoutube,
    href: "https://youtube.com",
    hoverColor: "hover:text-[#FF0000]",
  },
];

export default function Footer() {
  return (
    <footer dir="rtl" className="relative w-full bg-background overflow-x-clip border-t border-line">
      <Container className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col justify-between md:border-b-0 md:border-e border-line">
            <div className="h-11 sm:h-12 px-5 sm:px-6 flex items-center border-b border-line">
              <Link href="/" className="inline-flex items-center transition-opacity hover:opacity-80">
                <Image
                  src="/logos/Logo White.png"
                  alt="Sanad Academy Logo"
                  width={75}
                  height={26}
                  unoptimized
                  className="hidden dark:block h-6 sm:h-6.5 w-auto object-contain"
                />
                <Image
                  src="/logos/Logo Black.png"
                  alt="Sanad Academy Logo"
                  width={75}
                  height={26}
                  unoptimized
                  className="block dark:hidden h-6 sm:h-6.5 w-auto object-contain"
                />
              </Link>
            </div>

            <div className="flex-1 p-5 sm:p-6 flex flex-col justify-center">
              <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed max-w-md">
                نعلّم الأطفال البرمجة والتقنية بأسلوب عملي وممتع حضورياً في فروعنا من خلال أنشطة تفاعلية ومشاريع تطبيقية ونُبسّط المفاهيم باستخدام أمثلة عملية وتجارب حقيقية.
              </p>
            </div>

            <div className="h-11 sm:h-12 w-full border-t border-line grid grid-cols-4">
              <TooltipProvider delayDuration={150}>
                {SOCIAL_LINKS.map((link, idx) => {
                  const Icon = link.icon;
                  return (
                    <Tooltip key={link.name}>
                      <TooltipTrigger asChild>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${link.name} (${link.handle})`}
                          className={`flex h-full w-full items-center justify-center text-muted-foreground transition-all duration-200 hover:bg-secondary/40 hover:text-foreground ${
                            idx !== SOCIAL_LINKS.length - 1 ? "border-l border-line" : ""
                          } ${link.hoverColor}`}
                        >
                          <Icon className="size-3.5 sm:size-4 transition-transform duration-200 hover:scale-110 active:scale-95" />
                        </a>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        sideOffset={6}
                        className="font-heading text-xs font-semibold py-1 px-2.5 bg-popover text-foreground border border-line backdrop-blur-md rounded-md shadow-none"
                      >
                        <p>{link.name} ({link.handle})</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </TooltipProvider>
            </div>
          </div>

          <div className="flex flex-col h-full">
            <div className="grid grid-cols-2 h-full">
              <div className="flex flex-col border-e border-line">
                <div className="h-11 sm:h-12 px-3 sm:px-3.5 lg:px-6 flex items-center border-b border-line text-xs sm:text-sm font-bold text-foreground select-none">
                  استكشف
                </div>

                <div className="flex flex-col divide-y divide-line">
                  {EXPLORE_ITEMS.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="h-11 sm:h-12 px-3 sm:px-3.5 lg:px-6 flex items-center justify-between text-xs sm:text-[13px] text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary/35 group"
                    >
                      <span className="transition-transform duration-200 group-hover:-translate-x-1 truncate">
                        {item.label}
                      </span>
                      <ArrowUpLeft className="size-3.5 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 text-primary shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex flex-col">
                <div className="h-11 sm:h-12 px-3 sm:px-3.5 lg:px-6 flex items-center border-b border-line text-xs sm:text-sm font-bold text-foreground select-none">
                  تواصل معنا
                </div>

                <div className="flex flex-col divide-y divide-line">
                  {CONTACT_ITEMS.map((item, idx) => {
                    const Icon = item.icon;
                    const content = (
                      <div className="flex items-center gap-2 lg:gap-3 text-[11px] sm:text-xs lg:text-[13px] text-muted-foreground group-hover:text-foreground transition-colors min-w-0">
                        <div
                          className={`size-6 sm:size-6.5 lg:size-7.5 rounded-lg border border-line bg-card/60 flex items-center justify-center shrink-0 text-foreground/80 transition-all duration-200 group-hover:scale-105 ${item.hoverColor}`}
                        >
                          <Icon className="size-3 sm:size-3.5 lg:size-4 transition-colors" />
                        </div>
                        <span dir={item.dir} className="truncate">
                          {item.label}
                        </span>
                      </div>
                    );

                    return item.href ? (
                      <a
                        key={idx}
                        href={item.href}
                        target={item.isExternal ? "_blank" : undefined}
                        rel={item.isExternal ? "noopener noreferrer" : undefined}
                        className="h-11 sm:h-12 px-3 sm:px-3.5 lg:px-6 flex items-center transition-colors hover:bg-secondary/35 group"
                      >
                        {content}
                      </a>
                    ) : (
                      <div
                        key={idx}
                        className="h-11 sm:h-12 px-3 sm:px-3.5 lg:px-6 flex items-center select-none"
                      >
                        {content}
                      </div>
                    );
                  })}

                  <div className="h-11 sm:h-12 px-3 sm:px-3.5 lg:px-6 flex items-center" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full screen-line-top screen-line-bottom px-4 sm:px-6 py-3 bg-card/25 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 text-xs text-muted-foreground text-center sm:text-right">
          <p className="text-xs text-muted-foreground">
            أكاديمية سَنَد. جميع الحقوق محفوظة{""}
            <span dir="ltr" className="inline-block font-mono">
              © {new Date().getFullYear()}
            </span>
          </p>

          <div className="flex items-center gap-3 sm:gap-4 text-xs">
            <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
              سياسة الخصوصية
            </Link>
            <span className="text-line select-none">•</span>
            <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
              شروط الاستخدام
            </Link>
          </div>
        </div>

        <div className="h-2.5 sm:h-3 w-full" />
      </Container>
    </footer>
  );
}
