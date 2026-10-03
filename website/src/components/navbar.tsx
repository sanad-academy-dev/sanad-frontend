"use client";

import { useState, useRef, useEffect, useId } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {  ChevronDown, Languages, Menu, X,  Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { JoinButton } from "@/components/join-button";

type NavLink = {
  label: string;
  href: string;
  children?: { label: string; href: string; badge?: string }[];
};

const NAV_LINKS: NavLink[] = [
  { label: "الرئيسية", href: "/" },
  { label: "المسارات", href: "/#paths" },
  {
    label: "حول الأكاديمية",
    href: "#",
    children: [
      { label: "قصتنا", href: "/#about", badge: "قريباً" },
      { label: "رؤيتنا ورسالتنا", href: "/#about", badge: "قريباً" },
      { label: "فريق العمل", href: "#", badge: "قريباً" },
      { label: "الشركاء", href: "/#partners", badge: "قريباً" },
    ],
  },
  {
    label: "الحلول",
    href: "#",
    children: [
      { label: "المستويات", href: "/#levels" },
      { label: "المعسكرات", href: "/#bootcamps", badge: "قريباً" },
      { label: "اللاب", href: "/lab", badge: "قريباً" },
      { label: "الشركات", href: "/companies", badge: "قريباً" },
      { label: "مدارس", href: "/schools", badge: "قريباً" },
    ],
  },
  { label: "الأسعار", href: "/#pricing" },
  { label: "تواصل معنا", href: "/#footer" },
];

type Variant = "overlay" | "solid";

const THEME: Record<
  Variant,
  {
    header: string;
    pill: string;
    text: string;
    hover: string;
    triggerOpen: string;
    divider: string;
    activeText: string;
    icon: string;
  }
> = {
  overlay: {
    header: "fixed inset-x-0 top-0 z-50 px-4 pt-4 transition-all",
    pill: "bg-[rgba(230,230,230,0.04)] backdrop-blur-md",
    text: "text-white",
    hover: "hover:bg-card/10",
    triggerOpen: "data-[state=open]:bg-card/10 bg-card/10",
    divider: "bg-card/30",
    activeText: "text-white",
    icon: "text-white",
  },
  solid: {
    header: "fixed inset-x-0 top-0 z-50 bg-background px-4 transition-all shadow-sm border-b",
    pill: "border border-border bg-card shadow-sm",
    text: "text-muted-foreground",
    hover: "hover:bg-secondary hover:text-foreground",
    triggerOpen: "data-[state=open]:bg-secondary bg-secondary text-foreground",
    divider: "bg-border",
    activeText: "text-primary",
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
  children,
  onNavigate,
}: {
  children: { label: string; href: string; badge?: string }[];
  onNavigate?: () => void;
}) {
  return (
    <ul className="grid gap-1 p-2 min-w-44">
      {children.map((child) => (
        <li key={child.label}>
          <Link
            href={child.href}
            onClick={onNavigate}
            className="flex items-center justify-between cursor-pointer px-3 py-2 text-sm text-muted-foreground outline-none transition-colors hover:bg-secondary hover:text-foreground"
          >
            <span>{child.label}</span>
            {child.badge && (
              <span className="inline-flex shrink-0 items-center rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary mr-2">
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
  t,
  isActive,
}: {
  links: NavLink[];
  t: any;
  isActive: (href: string) => boolean;
}) {
  const navRef = useRef<HTMLElement>(null);
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
    const observer = new ResizeObserver(() => {
      setNavWidth(nav.offsetWidth);
      setSizes(
        measures.current.map((m) => ({ w: m?.offsetWidth ?? 0, h: m?.offsetHeight ?? 0 }))
      );
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
    <nav
      ref={navRef}
      className="relative hidden lg:flex items-center justify-center flex-1"
      onPointerLeave={(e) => {
        if (e.pointerType === "touch") return;
        clearTimeout(openTimer.current);
        if (latest.current) {
          clearTimeout(closeTimer.current);
          closeTimer.current = setTimeout(() => close(), CLOSE_GRACE);
        }
      }}
    >
      <ul className="flex items-center gap-1">
        {links.map((link, index) => {
          const hasChildren = link.children && link.children.length > 0;
          const on = active?.index === index;

          if (!hasChildren) {
            return (
              <li key={link.label}>
                <Link
                  ref={(el) => {
                    triggers.current[index] = el;
                  }}
                  href={link.href}
                  className={cn(
                    "block whitespace-nowrap px-3 py-2 text-sm transition-colors",
                    t.text,
                    isActive(link.href)
                      ? cn("rounded bg-primary/10 font-medium", t.activeText)
                      : cn("rounded font-normal", t.hover),
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
                  {link.label}
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
                  "flex items-center gap-2 px-3 py-0 text-sm outline-none transition-colors cursor-pointer",
                  t.text,
                  isActive(link.href) && !on
                      ? cn("rounded bg-primary/10 font-medium", t.activeText)
                      : cn("rounded font-normal"),
                  on ? t.triggerOpen : t.hover,
                )}
              >
                <span className="whitespace-nowrap">{link.label}</span>
                <ChevronDown className={cn("size-4 transition-transform", on && "rotate-180")} />
              </button>
            </li>
          );
        })}
      </ul>

      <AnimatePresence>
        {active && size && (
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
              className="absolute -top-2 left-0 z-10 fill-card stroke-border"
              initial={{ x: caretX }}
              animate={{ x: caretX }}
              transition={MORPH}
            >
              <path d="M0 9 8 1l8 8" strokeWidth={1} />
            </motion.svg>
            <div
              ref={panelRef}
              id={panelId}
              className="relative size-full overflow-hidden rounded-2xl bg-card border border-border shadow-md"
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
                    children={links[active.index]?.children || []} 
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
              <SectionLinks children={link.children} />
            </div>
          );
        })}
      </div>
    </nav>
  );
}

function LanguageToggle({ className }: { className?: string }) {
  return (
    <button
      type="button"
      aria-label="تبديل اللغة"
      className={cn(
        "flex size-6 items-center justify-center transition-opacity hover:opacity-70",
        className,
      )}
    >
      <Languages className="size-5" />
    </button>
  );
}


function LoginPopup({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-full max-w-md flex-col gap-6 overflow-hidden bg-card p-6 sm:p-8 text-center shadow-xl border border-border"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 flex size-8 items-center justify-center rounded-full bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          aria-label="إغلاق"
        >
          <X className="size-5" />
        </button>
        <div className="flex flex-col items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="size-7" />
          </div>
          <h2 className="text-xl font-bold text-foreground">قريباً!</h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            لوحة التحكم الخاصة بالطفل ومتابعة الأداء ستكون متاحة قريباً.
          </p>
        </div>
        <Button onClick={onClose} className="w-full py-6 text-base font-semibold">
          حسناً، فهمت
        </Button>
      </motion.div>
    </motion.div>
  );
}

export default function Navbar({ variant = "overlay" }: { variant?: Variant }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginPopupOpen, setLoginPopupOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const t = THEME[variant];

  const isActive = (href: string) =>
    href !== "#" && (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className={t.header}>
      <nav
        className={cn(
          "mx-auto flex w-full max-w-[1240px] items-center justify-between rounded-2xl pr-5 pl-3 py-0",
          t.pill,
        )}
      >
        {/* الشعار — يمين */}
        <Link
          href="/"
          className="text-[32px] font-bold leading-[38px] tracking-[-0.2px] text-primary shrink-0"
        >
           <Image src="/logos/Logo White.png" alt="Logo" width={80} height={80} />
        </Link>

        {/* روابط القائمة — وسط (ديسكتوب) */}
        <DesktopNav links={NAV_LINKS} t={t} isActive={isActive} />

        {/* أزرار الإجراءات — يسار (ديسكتوب) */}
        <div className="hidden items-center gap-3 lg:flex shrink-0">
          <Button 
            variant="outline" 
            className="cursor-pointer rounded h-auto py-3 px-3 text-xs font-medium border-primary/20 bg-primary/10 text-primary hover:bg-primary/20"
            onClick={() => window.dispatchEvent(new CustomEvent("open-ai-agent"))}
          >
            <Sparkles className="size-4 ml-1" />
            إسأل سند بوت
          </Button>
          {/* <LanguageToggle className={t.icon} /> */}
          <span className={cn("h-[24px] w-px", t.divider)} aria-hidden />
          <Button
            variant="ghost"
            onClick={() => setLoginPopupOpen(true)}
            className={cn("cursor-pointer h-auto py-3 px-3 text-sm font-medium", t.text)}
          >
            تسجيل الدخول
          </Button>
          <JoinButton />
        </div>

        {/* تحكم الموبايل — يسار */}
        <div className="flex items-center gap-3 lg:hidden">
          {/* <LanguageToggle className={t.icon} /> */}
          <button
            type="button"
            aria-label={mobileOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className={cn(
              "flex size-8 items-center justify-center rounded transition-colors",
              t.text,
              t.hover,
            )}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* قائمة الموبايل */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="mx-auto mt-3 w-full max-w-[1240px] overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-md lg:hidden"
          >
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) =>
                link.children ? (
                  <li key={link.label}>
                    <button
                      type="button"
                      onClick={() => setOpenMobileDropdown(openMobileDropdown === link.label ? null : link.label)}
                      aria-expanded={openMobileDropdown === link.label}
                      className="flex w-full items-center justify-between rounded px-4 py-3 text-base text-foreground transition-colors hover:bg-secondary"
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={cn(
                          "size-4 transition-transform",
                          openMobileDropdown === link.label && "rotate-180",
                        )}
                      />
                    </button>
                    <AnimatePresence>
                      {openMobileDropdown === link.label && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                          className="overflow-hidden ps-4"
                        >
                          {link.children.map((child) => (
                            <li key={child.label}>
                              <a
                                href={child.href}
                                className="flex items-center justify-between px-4 py-2.5 text-[15px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                              >
                                <span>{child.label}</span>
                                {child.badge && (
                                  <span className="inline-flex shrink-0 items-center rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary mr-2">
                                    {child.badge}
                                  </span>
                                )}
                              </a>
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
                      className={cn(
                        "block rounded px-4 py-3 text-base transition-colors",
                        isActive(link.href)
                          ? "bg-primary/10 font-medium text-primary"
                          : "text-foreground hover:bg-secondary",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>

            <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
              <Button 
                variant="outline" 
                className="rounded h-auto py-3 text-base font-medium w-full border-primary/20 bg-primary/10 text-primary hover:bg-primary/20"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("open-ai-agent"));
                  setMobileOpen(false);
                }}
              >
                <Sparkles className="size-5 ml-2" />
                إسأل سند بوت
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setLoginPopupOpen(true);
                  setMobileOpen(false);
                }}
                className="h-auto py-3 text-base font-medium w-full"
              >
                تسجيل الدخول
              </Button>
              <JoinButton className="w-full" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {loginPopupOpen && <LoginPopup onClose={() => setLoginPopupOpen(false)} />}
      </AnimatePresence>
    </header>
  );
}
