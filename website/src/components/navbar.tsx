"use client";



import { useState, useRef, useEffect, useId } from "react";

import { createPortal } from "react-dom";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { AnimatePresence, motion } from "framer-motion";

import { ChevronDown, X, Sparkles, Search, Globe } from "lucide-react";


import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import Image from "next/image";

import { JoinButton } from "@/components/join-button";

import { ThemeToggle } from "@/components/theme-toggle";

import { SearchDialog } from "@/components/search-dialog";

import {

  Tooltip,

  TooltipContent,

  TooltipProvider,

  TooltipTrigger,

} from "@/components/ui/tooltip";



type NavLink = {

  label: string;

  href: string;

  badge?: string;

  children?: { label: string; href: string; badge?: string }[];

};



const NAV_LINKS: NavLink[] = [

  { label: "المسارات", href: "/tracks" },

  {

    label: "حول الأكاديمية",

    href: "#",

    children: [

      { label: "تواصل معنا", href: "/contact" },

      { label: "قصتنا", href: "/#about", badge: "قريباً" },

      { label: "رؤيتنا ورسالتنا", href: "/#about", badge: "قريباً" },

      { label: "فريق العمل", href: "/team" },

      { label: "الشركاء", href: "/#partners", badge: "قريباً" },

    ],

  },

  {

    label: "الحلول",

    href: "#",

    children: [

      { label: "التوثيق", href: "/verify" },

      { label: "المستويات", href: "/#levels" },

      { label: "المعسكرات", href: "/#bootcamps", badge: "قريباً" },

      { label: "اللاب", href: "/lab", badge: "قريباً" },

      { label: "الشركات", href: "#", badge: "قريباً" },

      { label: "مدارس", href: "#", badge: "قريباً" },

    ],

  },

  { label: "الأسعار", href: "/pricing" },

  { label: "مدونة", href: "/blog" },

  { label: "المتجر", href: "#", badge: "قريباً" },

];



type Variant = "overlay" | "solid";



const THEME: Record<

  Variant,

  {

    header: string;

    nav: string;

    text: string;

    hover: string;

    triggerOpen: string;

    divider: string;

    activeText: string;

    icon: string;

  }

> = {

  overlay: {

    header: "fixed inset-x-0 top-0 z-50 w-full border-b border-line bg-background/80 backdrop-blur-md transition-all mb-0",

    nav: "mx-auto flex h-14 w-full max-w-5xl items-center justify-between border-x border-line px-3 sm:px-4",

    text: "text-muted-foreground",

    hover: "hover:text-foreground",

    triggerOpen: "text-foreground",

    divider: "bg-line",

    activeText: "text-foreground font-semibold",

    icon: "text-foreground",

  },

  solid: {

    header: "fixed inset-x-0 top-0 z-50 w-full border-b border-line bg-background/95 backdrop-blur-md transition-all mb-0",

    nav: "mx-auto flex h-14 w-full max-w-5xl items-center justify-between border-x border-line px-3 sm:px-4",

    text: "text-muted-foreground",

    hover: "hover:text-foreground",

    triggerOpen: "text-foreground",

    divider: "bg-line",

    activeText: "text-foreground font-semibold",

    icon: "text-foreground",

  },

};



const OPEN_INTENT = 80;

const CLOSE_GRACE = 180;

const SLIDE = 48;

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const MORPH = { type: "spring", duration: 0.3, bounce: 0 } as const;

const CARET = 16;



const SLIDES = {

  enter: (dir: number) => ({ x: dir * SLIDE, opacity: 0, filter: "blur(4px)" }),

  center: {

    x: 0,

    opacity: 1,

    filter: "blur(0px)",

    transition: { duration: 0.25, ease: EASE_OUT },

  },

  exit: (dir: number) => ({

    x: -dir * SLIDE,

    opacity: 0,

    filter: "blur(4px)",

    transition: { duration: 0.18, ease: EASE_OUT },

  }),

};



type Size = { w: number; h: number };

type Active = { index: number; center: number };



function SectionLinks({

  items,

  onNavigate,

}: {

  items: { label: string; href: string; badge?: string }[];

  onNavigate?: () => void;

}) {

  return (

    <ul className="grid gap-1 p-2 min-w-44">

      {items.map((child) => (

        <li key={child.label}>

          <Link

            href={child.href}

            onClick={(e) => {

              if (child.href === "#") {

                e.preventDefault();

              }

              onNavigate?.();

            }}

            className="flex items-center justify-between cursor-pointer rounded-md px-2 py-2 text-sm text-muted-foreground outline-none transition-colors hover:text-foreground"

          >

            <span>{child.label}</span>

            {child.badge && (

              <span className="inline-flex shrink-0 items-center rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary ms-2">

                {child.badge}

              </span>

            )}

          </Link>

        </li>

      ))}

    </ul>

  );

}



function DesktopNav({

  links,

  isLinkActive,

}: {

  links: NavLink[];

  isLinkActive: (link: NavLink) => boolean;

}) {

  const navRef = useRef<HTMLDivElement>(null);

  const triggers = useRef<(HTMLElement | null)[]>([]);

  const measures = useRef<(HTMLDivElement | null)[]>([]);

  const panelRef = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState<Active | null>(null);

  const [direction, setDirection] = useState(1);

  const [sizes, setSizes] = useState<Size[]>([]);

  const [navWidth, setNavWidth] = useState(0);

  const [session, setSession] = useState(0);

  const openTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const latest = useRef(active);

  const panelId = useId();



  useEffect(() => {

    latest.current = active;

  });



  const centerOf = (index: number) => {

    const nav = navRef.current?.getBoundingClientRect();

    const box = triggers.current[index]?.getBoundingClientRect();

    return nav && box ? box.left - nav.left + box.width / 2 : 0;

  };



  useEffect(() => {

    const nav = navRef.current;

    if (!nav) return;



    const measureAll = () => {

      setNavWidth(nav.offsetWidth);

      setSizes(

        measures.current.map((el) =>

          el ? { w: el.offsetWidth, h: el.offsetHeight } : { w: 0, h: 0 }

        )

      );

    };



    measureAll();



    const observer = new ResizeObserver(() => {

      measureAll();

      setActive((a) => a && { ...a, center: centerOf(a.index) });

    });

    observer.observe(nav);

    measures.current.forEach((m) => m && observer.observe(m));

    return () => observer.disconnect();

  }, [links]);



  useEffect(

    () => () => {

      clearTimeout(openTimer.current);

      clearTimeout(closeTimer.current);

    },

    []

  );



  const open = (index: number) => {

    clearTimeout(openTimer.current);

    clearTimeout(closeTimer.current);

    const current = latest.current;

    if (current?.index === index) return;

    if (current) setDirection(index > current.index ? 1 : -1);

    else setSession((s) => s + 1);

    const next = { index, center: centerOf(index) };

    latest.current = next;

    setActive(next);

  };



  const close = () => {

    clearTimeout(openTimer.current);

    clearTimeout(closeTimer.current);

    latest.current = null;

    setActive(null);

  };



  const size = active ? sizes[active.index] : undefined;

  const width = size ? Math.min(size.w, navWidth) : 0;

  const x = active ? Math.max(0, Math.min(active.center - width / 2, navWidth - width)) : 0;

  const caretX = active

    ? Math.max(12, Math.min(active.center - x - CARET / 2, width - CARET - 12))

    : 0;



  return (

    <div

      ref={navRef}

      className="relative hidden lg:flex items-center justify-center shrink-0 mx-1"

      onPointerLeave={(e) => {

        if (e.pointerType === "touch") return;

        clearTimeout(openTimer.current);

        if (latest.current) {

          clearTimeout(closeTimer.current);

          closeTimer.current = setTimeout(() => close(), CLOSE_GRACE);

        }

      }}

    >

      <ul className="flex items-center gap-0.5 xl:gap-1.5">
        {links.map((link, index) => {
          const hasChildren = link.children && link.children.length > 0;
          const on = active?.index === index;
          const activeState = isLinkActive(link);

          if (!hasChildren) {
            return (
              <li key={link.label}>
                <Link
                  ref={(el) => {
                    triggers.current[index] = el;
                  }}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1 whitespace-nowrap px-2 py-1 xl:px-2.5 xl:py-1.5 text-xs xl:text-[13px] font-medium tracking-normal transition-colors outline-none",
                    activeState
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground focus-visible:text-foreground"
                  )}
                  onPointerEnter={(e) => {
                    if (e.pointerType === "touch") return;
                    clearTimeout(openTimer.current);
                    if (latest.current) {
                      clearTimeout(closeTimer.current);
                      closeTimer.current = setTimeout(() => close(), CLOSE_GRACE);
                    }
                  }}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="inline-flex shrink-0 items-center rounded-full border border-primary/30 bg-primary/10 px-1.5 py-0.2 text-[9px] font-semibold text-primary">
                      {link.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          }

          return (
            <li key={link.label}>
              <button
                ref={(el) => {
                  triggers.current[index] = el;
                }}
                type="button"
                aria-expanded={on}
                aria-controls={on ? panelId : undefined}
                onPointerEnter={(e) => {
                  if (e.pointerType === "touch") return;
                  clearTimeout(openTimer.current);
                  if (latest.current) open(index);
                  else openTimer.current = setTimeout(() => open(index), OPEN_INTENT);
                }}
                onPointerLeave={() => {
                  if (!latest.current) clearTimeout(openTimer.current);
                }}
                onClick={() => {
                  if (on) close();
                  else open(index);
                }}
                className={cn(
                  "flex items-center gap-0.5 xl:gap-1 px-2 py-1 xl:px-2.5 xl:py-1.5 text-xs xl:text-[13px] font-medium tracking-normal transition-colors cursor-pointer outline-none",
                  on || activeState
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground focus-visible:text-foreground"
                )}
              >
                <span className="whitespace-nowrap">{link.label}</span>
                <ChevronDown className={cn("size-3 transition-transform duration-200", on && "rotate-180")} />
              </button>
            </li>
          );
        })}
      </ul>



      <AnimatePresence>

        {active && size && size.w > 0 && size.h > 0 && (

          <motion.div

            key={session}

            className="absolute top-full left-0 mt-3 z-50"

            initial={{ opacity: 0, scale: 0.97, x, width, height: size.h }}

            animate={{ opacity: 1, scale: 1, x, width, height: size.h }}

            exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15, ease: EASE_OUT } }}

            transition={{

              default: MORPH,

              opacity: { duration: 0.2, ease: EASE_OUT },

              scale: { duration: 0.2, ease: EASE_OUT },

            }}

            style={{ transformOrigin: `${caretX + CARET / 2}px 0px` }}

          >

            <div aria-hidden className="absolute inset-x-0 -top-3 h-3" />

            <motion.svg

              aria-hidden

              viewBox="0 0 16 9"

              width={CARET}

              height={9}

              className="absolute -top-2 left-0 z-10 fill-card stroke-line"

              initial={{ x: caretX }}

              animate={{ x: caretX }}

              transition={MORPH}

            >

              <path d="M0 9 8 1l8 8" strokeWidth={1} />

            </motion.svg>

            <div

              ref={panelRef}

              id={panelId}

              className="relative size-full overflow-hidden rounded-xl bg-card border border-line"

            >

              <AnimatePresence initial={false} custom={direction}>

                <motion.div

                  key={active.index}

                  custom={direction}

                  variants={SLIDES}

                  initial="enter"

                  animate="center"

                  exit="exit"

                  className="absolute top-0 left-0"

                  style={{ width }}

                >

                  <SectionLinks 

                    items={links[active.index]?.children || []} 

                    onNavigate={() => close()} 

                  />

                </motion.div>

              </AnimatePresence>

            </div>

          </motion.div>

        )}

      </AnimatePresence>



      <div aria-hidden inert className="pointer-events-none invisible absolute top-0 left-0 w-full">

        {links.map((link, index) => {

          if (!link.children || link.children.length === 0) return null;

          return (

            <div

              key={link.label}

              ref={(el) => {

                measures.current[index] = el;

              }}

              className="absolute top-0 left-0 w-max max-w-full"

            >

              <SectionLinks items={link.children} />

            </div>

          );

        })}

      </div>

    </div>

  );

}



function LoginPopup({ onClose }: { onClose: () => void }) {

  const [mounted, setMounted] = useState(false);



  useEffect(() => {

    setMounted(true);

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();

    document.addEventListener("keydown", onKey);

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {

      document.removeEventListener("keydown", onKey);

      document.body.style.overflow = originalOverflow;

    };

  }, [onClose]);



  if (!mounted || typeof document === "undefined") return null;



  return createPortal(

    <motion.div

      initial={{ opacity: 0 }}

      animate={{ opacity: 1 }}

      exit={{ opacity: 0 }}

      onClick={onClose}

      className="fixed inset-0 z-[9999] flex min-h-screen w-screen items-center justify-center bg-black/60 backdrop-blur-xs p-4"

      dir="rtl"

    >

      <motion.div

        initial={{ opacity: 0, scale: 0.95, y: 16 }}

        animate={{ opacity: 1, scale: 1, y: 0 }}

        exit={{ opacity: 0, scale: 0.95, y: 16 }}

        transition={{ duration: 0.2, ease: "easeOut" }}

        onClick={(e) => e.stopPropagation()}

        className="relative flex w-full max-w-md flex-col gap-6 overflow-hidden rounded-2xl bg-card p-6 sm:p-8 text-center border border-line"

      >

        <button

          type="button"

          onClick={onClose}

          className="absolute top-4 left-4 flex size-8 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"

          aria-label="إغلاق"

        >

          <X className="size-5" />

        </button>

        <div className="flex flex-col items-center gap-4">

          <div className="flex size-14 items-center justify-center rounded-2xl border border-line bg-primary/10 text-primary">

            <Sparkles className="size-7" />

          </div>

          <h2 className="text-xl font-heading font-bold text-foreground">قريباً!</h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">

            لوحة التحكم الخاصة بالطفل ومتابعة الأداء ستكون متاحة قريباً.

          </p>

        </div>

        <Button onClick={onClose} className="w-full py-5 text-base font-semibold cursor-pointer">

          حسناً، فهمت

        </Button>

      </motion.div>

    </motion.div>,

    document.body

  );

}



export default function Navbar({ variant = "overlay" }: { variant?: Variant }) {

  const [mobileOpen, setMobileOpen] = useState(false);

  const [loginPopupOpen, setLoginPopupOpen] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);

  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);

  const pathname = usePathname();

  const t = THEME[variant];



  // Close mobile drawer on route change

  useEffect(() => {

    setMobileOpen(false);

    setOpenMobileDropdown(null);

  }, [pathname]);



  // Global Ctrl+K / Cmd+K listener for Search Palette


  useEffect(() => {

    const onKey = (e: KeyboardEvent) => {

      const isCtrl = e.metaKey || e.ctrlKey;

      if (!isCtrl) return;



      const isK =

        e.code === "KeyK" ||

        e.key === "k" ||

        e.key === "K" ||

        e.key === "ن";



      if (isK) {

        e.preventDefault();

        e.stopPropagation();

        setSearchOpen((prev) => !prev);

      }

    };

    window.addEventListener("keydown", onKey, { capture: true });

    return () => window.removeEventListener("keydown", onKey, { capture: true });

  }, []);



  // Lock scroll and handle Escape key when mobile menu is open

  useEffect(() => {

    if (!mobileOpen) return;

    const onKey = (e: KeyboardEvent) => {

      if (e.key === "Escape") setMobileOpen(false);

    };

    document.addEventListener("keydown", onKey);

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {

      document.removeEventListener("keydown", onKey);

      document.body.style.overflow = originalOverflow;

    };

  }, [mobileOpen]);



  const isLinkActive = (link: NavLink) => {

    if (link.href !== "#") {

      if (link.href === "/") {

        return pathname === "/";

      }

      return pathname.startsWith(link.href);

    }

    if (link.children) {

      return link.children.some(

        (child) =>

          child.href !== "#" && (child.href === "/" ? pathname === "/" : pathname.startsWith(child.href))

      );

    }

    return false;

  };



  return (

    <>

      <header className={t.header}>

        <nav className={t.nav} dir="rtl">


          <Link
            href="/"
            className="shrink-0 flex items-center pl-1 sm:pl-2.5 transition-opacity hover:opacity-80"
            aria-label="الصفحة الرئيسية لأكاديمية سند"
          >
            <Image
              src="/logos/Logo White.png"
              alt="سند"
              width={60}
              height={20}
              unoptimized
              className="hidden dark:block h-4.5 sm:h-5 w-auto object-contain"
              priority
            />
            <Image
              src="/logos/Logo Black.png"
              alt="سند"
              width={60}
              height={20}
              unoptimized
              className="block dark:hidden h-4.5 sm:h-5 w-auto object-contain"
              priority
            />
          </Link>

          <DesktopNav links={NAV_LINKS} isLinkActive={isLinkActive} />

          <div className="hidden items-center gap-0.5 xl:gap-1 lg:flex shrink-0">
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => setSearchOpen(true)}
                    className="inline-flex items-center gap-1.5 h-8 px-2 rounded-md text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground cursor-pointer outline-none select-none bg-transparent hover:bg-transparent"
                    aria-label="بحث في الأكاديمية"
                  >
                    <Search className="size-3.5" />
                    <span className="hidden xl:inline">بحث…</span>
                    <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-line bg-secondary/80 px-1 py-0.5 text-[9px] font-mono text-muted-foreground">
                      Ctrl K
                    </kbd>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={6} className="font-heading text-xs font-semibold py-1 px-2.5 bg-popover text-foreground border border-line backdrop-blur-md rounded-md shadow-none">
                  <p>بحث في الأكاديمية (Ctrl+K)</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent("open-ai-agent"))}
                    className="inline-flex items-center gap-1 h-8 px-2 rounded-md text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground cursor-pointer outline-none select-none shrink-0 bg-transparent hover:bg-transparent"
                    aria-label="إسأل سند الذكي"
                  >
                    <Sparkles className="size-3 text-primary" />
                    <span>إسأل سند</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={6} className="font-heading text-xs font-semibold py-1 px-2.5 bg-popover text-foreground border border-line backdrop-blur-md rounded-md shadow-none">
                  <p>إسأل سند الذكي</p>
                </TooltipContent>
              </Tooltip>

              <span className={cn("h-3.5 w-[1.5px] mx-0.5", t.divider)} aria-hidden />

              <div className="relative">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 h-8 px-1.5 xl:px-2 rounded-md text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground cursor-pointer outline-none select-none bg-transparent hover:bg-transparent"
                      aria-label="اختيار اللغة"
                    >
                      <Globe className="size-3.5" />
                      <span className="hidden xl:inline text-xs">العربية</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={6} className="font-heading text-xs font-semibold py-1 px-2.5 bg-popover text-foreground border border-line backdrop-blur-md rounded-md shadow-none">
                    <p>اللغة / Language</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <span className={cn("h-3.5 w-[1.5px] mx-0.5", t.divider)} aria-hidden />

              <button
                type="button"
                onClick={() => setLoginPopupOpen(true)}
                className="inline-flex items-center h-8 px-2 xl:px-2.5 rounded-md text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground cursor-pointer outline-none select-none shrink-0 whitespace-nowrap bg-transparent hover:bg-transparent"
              >
                تسجيل الدخول
              </button>

              <span className={cn("h-3.5 w-[1.5px] mx-0.5", t.divider)} aria-hidden />

              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center justify-center">
                    <ThemeToggle className="size-7.5 hover:bg-transparent text-muted-foreground hover:text-foreground" />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={6} className="font-heading text-xs font-semibold py-1 px-2.5 bg-popover text-foreground border border-line backdrop-blur-md rounded-md shadow-none">
                  <p>تبديل المظهر (فاتح / داكن)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>




          <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">

            <button

              type="button"

              onClick={() => setLoginPopupOpen(true)}

              className="inline-flex items-center h-8 px-2.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors cursor-pointer select-none border border-line"

            >

              تسجيل الدخول

            </button>

            <ThemeToggle className="size-8" />

          </div>

        </nav>

      </header>




      <AnimatePresence>

        {mobileOpen && (

          <motion.div

            initial={{ opacity: 0 }}

            animate={{ opacity: 1 }}

            exit={{ opacity: 0 }}

            transition={{ duration: 0.15 }}

            onClick={() => setMobileOpen(false)}

            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"

            aria-hidden="true"

          />

        )}

      </AnimatePresence>




      <AnimatePresence>

        {mobileOpen && (

          <motion.div

            initial={{ opacity: 0, y: 12, scale: 0.95 }}

            animate={{ opacity: 1, y: 0, scale: 1 }}

            exit={{ opacity: 0, y: 12, scale: 0.95 }}

            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}

            data-slot="mobile-popover"

            role="dialog"

            aria-modal="true"

            aria-label="قائمة التنقل للهواتف"

            className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom,0))] left-1/2 -translate-x-1/2 z-50 w-[310px] max-w-[calc(100vw-2rem)] max-h-[72vh] overflow-y-auto overscroll-contain rounded-2xl border border-line bg-card/95 dark:bg-popover/95 backdrop-blur-xl p-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden"

            dir="rtl"

          >


            <div className="flex items-center justify-between px-2 pb-2.5 mb-2 border-b border-line">

              <div className="flex items-center gap-2">

                <Image
                  src="/logos/Logo Black.png"
                  alt="سند"
                  width={75}
                  height={26}
                  unoptimized
                  className="block dark:hidden h-6 w-auto"
                />
                <Image
                  src="/logos/Logo White.png"
                  alt="سند"
                  width={75}
                  height={26}
                  unoptimized
                  className="hidden dark:block h-6 w-auto"
                />

                <span className="text-sm font-bold text-foreground font-heading">أكاديمية سَنَد</span>

              </div>

              <span className="inline-flex items-center gap-1.5 text-[10.5px] font-medium text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full select-none">

                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />

                متاحون أونلاين

              </span>

            </div>




            <ul className="flex flex-col gap-1 py-0.5">

              {NAV_LINKS.map((link) =>

                link.children ? (

                  <li key={link.label}>

                    <button

                      type="button"

                      onClick={() =>

                        setOpenMobileDropdown(

                          openMobileDropdown === link.label ? null : link.label

                        )

                      }

                      aria-expanded={openMobileDropdown === link.label}

                      className={cn( "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm font-medium transition-colors hover:bg-secondary/60 cursor-pointer", isLinkActive(link)

                          ? "bg-accent/70 font-semibold text-foreground"

                          : "text-muted-foreground hover:text-foreground"

                      )}

                    >

                      <span>{link.label}</span>

                      <ChevronDown

                        className={cn( "size-3.5 transition-transform duration-200", openMobileDropdown === link.label && "rotate-180" )}

                      />

                    </button>

                    <AnimatePresence>

                      {openMobileDropdown === link.label && (

                        <motion.ul

                          initial={{ height: 0, opacity: 0 }}

                          animate={{ height: "auto", opacity: 1 }}

                          exit={{ height: 0, opacity: 0 }}

                          transition={{ duration: 0.18, ease: "easeOut" }}

                          className="overflow-hidden ps-3 pe-1 pt-1 space-y-0.5"

                        >

                          {link.children.map((child) => (

                            <li key={child.label}>

                              <Link

                                href={child.href}

                                onClick={(e) => {

                                  if (child.href === "#") e.preventDefault();

                                  setMobileOpen(false);

                                }}

                                className={cn( "flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs transition-colors hover:bg-secondary/60", child.href !== "#" && pathname.startsWith(child.href)

                                    ? "font-semibold text-foreground bg-accent/50"

                                    : "text-muted-foreground hover:text-foreground"

                                )}

                              >

                                <span>{child.label}</span>

                                {child.badge && (

                                  <span className="inline-flex shrink-0 items-center rounded-full border border-primary/30 bg-primary/10 px-1.5 py-0.2 text-[9px] font-semibold text-primary ms-1.5">

                                    {child.badge}

                                  </span>

                                )}

                              </Link>

                            </li>

                          ))}

                        </motion.ul>

                      )}

                    </AnimatePresence>

                  </li>

                ) : (

                  <li key={link.label}>

                    <Link

                      href={link.href}

                      onClick={() => setMobileOpen(false)}

                      className={cn( "flex items-center justify-between rounded-lg px-2.5 py-2 text-sm font-medium transition-colors hover:bg-secondary/60", isLinkActive(link)

                          ? "bg-accent/70 font-semibold text-foreground"

                          : "text-muted-foreground hover:text-foreground"

                      )}

                    >

                      <span>{link.label}</span>

                      {link.badge && (

                        <span className="inline-flex shrink-0 items-center rounded-full border border-primary/30 bg-primary/10 px-1.5 py-0.2 text-[9px] font-semibold text-primary">

                          {link.badge}

                        </span>

                      )}

                    </Link>

                  </li>

                )

              )}

            </ul>




            <div className="pt-2 mt-2 border-t border-line flex flex-col gap-1.5">

              <button

                type="button"

                className="flex items-center justify-between w-full h-8 px-2.5 rounded-lg border border-line bg-secondary/50 hover:bg-secondary text-xs font-medium text-foreground transition-colors cursor-pointer"

                onClick={() => {

                  window.dispatchEvent(new CustomEvent("open-ai-agent"));

                  setMobileOpen(false);

                }}

              >

                <span className="flex items-center gap-1.5">

                  <Sparkles className="size-3.5 text-primary" />

                  <span>إسأل سند الذكي</span>

                </span>

                <span className="text-[10px] text-muted-foreground font-mono">AI</span>

              </button>



              <JoinButton

                className="w-full h-8 text-xs font-semibold cursor-pointer"

                size="sm"

                onClick={() => setMobileOpen(false)}

              />

            </div>

          </motion.div>

        )}

      </AnimatePresence>




      <aside

        aria-label="شريط التنقل السريع"

        className={cn( "fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom,0))] left-1/2 z-50 flex w-fit -translate-x-1/2 items-center rounded-xl bg-card/90 dark:bg-popover/90 backdrop-blur-md py-1 pr-1.5 pl-2 border border-line ring-1 ring-border/50 lg:hidden",

          "select-none transition-all duration-200"

        )}

        dir="rtl"

      >


        <button

          type="button"

          onClick={() => {

            setMobileOpen(false);

            setSearchOpen(true);

          }}

          className="group inline-flex shrink-0 items-center justify-center gap-1.5 border-none px-2.5 py-1 text-muted-foreground hover:text-foreground text-xs font-medium transition-colors cursor-pointer outline-none select-none"

          aria-label="ابحث في الأكاديمية"

        >

          <Search className="size-3.5" />

          <span className="font-sans text-xs font-medium">بحث…</span>

          <kbd className="hidden xs:inline-flex items-center rounded border border-line bg-secondary/80 px-1 py-0.5 text-[9px] font-mono text-muted-foreground">

            Ctrl K

          </kbd>

        </button>




        <div className="shrink-0 bg-line mx-1.5 h-4 w-0.5 self-center" aria-hidden="true" />




        <button

          type="button"

          onClick={() => setMobileOpen((v) => !v)}

          className={cn( "group relative flex size-8 items-center justify-center text-foreground transition-all cursor-pointer outline-none select-none", mobileOpen && "bg-secondary text-foreground" )}

          aria-label={mobileOpen ? "إغلاق القائمة" : "فتح القائمة"}

          aria-expanded={mobileOpen}

        >

          <div className="flex flex-col items-center justify-center gap-1.5 pointer-events-none">

            <span

              className={cn( "h-0.5 w-4 rounded-full bg-foreground transition-all duration-200 origin-center", mobileOpen && "translate-y-1 rotate-45" )}

            />

            <span

              className={cn( "h-0.5 w-4 rounded-full bg-foreground transition-all duration-200 origin-center", mobileOpen && "-translate-y-1 -rotate-45" )}

            />

          </div>

        </button>

      </aside>




      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />




      <AnimatePresence>

        {loginPopupOpen && <LoginPopup onClose={() => setLoginPopupOpen(false)} />}

      </AnimatePresence>

    </>

  );

}
