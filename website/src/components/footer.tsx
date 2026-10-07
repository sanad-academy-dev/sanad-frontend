import { Mail, MapPin } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import Image from "next/image";
import Container from "./container";

// الفوتر — Frame 1984079022 من التصميم

const EXPLORE_LINKS = [
  "الدورات",
  "المعسكرات",
  "الأسعار",
  "عن الأكاديمية",
  "احجز حصة مجانية",
];

const CONTACTS = [
  { icon: FaWhatsapp, text: "+201022805731", dir: "ltr" as const, href: "https://wa.me/+201022805731" },
  { icon: Mail, text: "info@sanad.academy", dir: "ltr" as const, href: "mailto:info@sanad.academy" },
  { icon: MapPin, text: "بجوار فون الشرطة - أرض النني - سيدي سالم - كفرالشيخ", dir: "rtl" as const },
];

// أيقونات التواصل الاجتماعي (SVG مدمجة — lucide بلا أيقونات ماركات)
const SOCIALS: { name: string; path: string }[] = [
  {
    name: "X",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    name: "Instagram",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  },
  {
    name: "YouTube",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
  {
    name: "LinkedIn",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z",
  },
  {
    name: "Snapchat",
    path: "M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.061.12 1.526 2.97 4.298 3.43.224.038.389.234.374.464 0 .06-.015.12-.03.18-.21.689-1.439 1.213-3.81 1.594-.075.12-.149.464-.224.793-.06.269-.119.554-.225.839-.075.18-.225.404-.654.404-.075 0-.165-.015-.273-.044-.404-.105-.804-.21-1.273-.21-.279 0-.557.024-.835.075-.527.094-.954.354-1.401.629-.643.395-1.301.799-2.32.799-.069 0-.135-.005-.205-.012-.06.005-.114.012-.18.012-1.02 0-1.677-.404-2.32-.799-.448-.275-.875-.535-1.401-.629-.279-.051-.557-.075-.835-.075-.469 0-.869.105-1.273.21-.105.03-.195.045-.27.045-.43 0-.58-.225-.654-.404-.105-.285-.165-.57-.225-.839-.075-.329-.149-.673-.224-.793-2.371-.381-3.6-.905-3.81-1.594-.015-.06-.03-.12-.03-.18-.015-.23.149-.426.374-.464 2.771-.46 4.236-3.31 4.297-3.43l.016-.03c.18-.345.21-.645.119-.869-.194-.45-.883-.674-1.333-.809-.135-.044-.255-.075-.344-.119-.674-.27-1.094-.6-1.183-.96-.075-.345.149-.69.704-.9.135-.045.314-.075.494-.075.135 0 .329.024.494.104.374.18.733.285 1.033.301h.045c.165 0 .284-.045.359-.09-.008-.165-.018-.33-.03-.51l-.003-.06c-.104-1.628-.23-3.654.299-4.847C7.844 1.069 11.201.793 12.191.793h.015z",
  },
  {
    name: "Facebook",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
];

export default function Footer() {
  return (
    <footer dir="rtl" className="w-full bg-background">
      <Container className="py-16">
        <div className="w-full border-t border-border pt-16 flex flex-col gap-6">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-12">
          {/* العلامة + الوصف + السوشال */}
          <div className="flex flex-col items-start gap-6 text-start lg:max-w-[576px]">
            {/* <h2 className="text-[32px] font-bold text-primary"> */}
              <Image src="/logos/Logo White.png" alt="Logo" width={100} height={100} />
            {/* </h2> */}
            <p className="text-lg leading-relaxed text-muted-foreground">
              نعلّم الأطفال البرمجة والتقنية بأسلوب عملي وممتع حضورياً في فروعنا من
              خلال أنشطة تفاعلية ومشاريع تطبيقية ونُبسّط المفاهيم باستخدام أمثلة
              عملية وتجارب حقيقية.
            </p>
            <div className="flex items-center gap-6">
              {SOCIALS.map((social) => (
                <a
                  key={social.name}
                  href="#"
                  aria-label={social.name}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  <svg viewBox="0 0 24 24" className="size-6" fill="currentColor">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* استكشف */}
          <nav className="flex flex-col items-start gap-4 text-start">
            <h3 className="text-base font-semibold text-foreground">استكشف</h3>
            {EXPLORE_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className="text-base text-muted-foreground transition-colors hover:text-primary"
              >
                {link}
              </a>
            ))}
          </nav>

          {/* تواصل معنا */}
          <div className="flex flex-col items-start gap-4 text-start">
            <h3 className="text-base font-semibold text-foreground">تواصل معنا</h3>
            {CONTACTS.map(({ icon: Icon, text, dir, href }) => {
              const content = (
                <div className="flex items-center gap-2">
                  <Icon className="size-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span dir={dir} className="text-base text-muted-foreground group-hover:text-primary transition-colors">
                    {text}
                  </span>
                </div>
              );

              return href ? (
                <a
                  key={text}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group"
                >
                  {content}
                </a>
              ) : (
                <div key={text} className="group">
                  {content}
                </div>
              );
            })}
          </div>
        </div>

        {/* الفاصل + حقوق النشر */}
        <div className="mt-6 pt-6 text-center">
          <p className="text-base text-muted-foreground">
            © 2026 أكاديمية سند. جميع الحقوق محفوظة.
          </p>
        </div>
        </div>
      </Container>
    </footer>
  );
}
