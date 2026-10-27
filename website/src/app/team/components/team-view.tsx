"use client";

import Link from "next/link";
import Container from "@/components/container";
import { SectionHeader } from "@/components/ui/header";
import { GlowCard, GlowCardGrid } from "@/components/ui/glow-card-grid";
import PageBreadcrumb from "@/components/page-breadcrumb";

const TEAM_MEMBERS = [
  {
    name: "Ibrahim Farouk",
    handle: "@ibrahim-farouk",
    avatar: "/avatars/avatar_fego.webp",
    href: "https://www.linkedin.com/in/ibrahim-farouk-4a2672364?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  },
  {
    name: "Gamal Hassan",
    handle: "@gamal-hassan",
    avatar: "/avatars/evilrabbit_.webp",
    href: "https://www.linkedin.com/",
  },
  {
    name: "Rawan Selima",
    handle: "@rawan-selima",
    avatar: "/avatars/orcdev.webp",
    href: "https://www.linkedin.com/",
  },
];

export default function TeamView() {
  return (
    <div
      className="flex-1 flex flex-col w-full max-w-screen overflow-x-clip bg-background pt-14 selection:bg-primary/20"
      dir="rtl"
    >
      <Container className="flex-1 flex flex-col">
        <PageBreadcrumb
          items={[
            { label: "حول الأكاديمية" },
            { label: "فريق العمل" },
          ]}
        />

        <SectionHeader
          title="فريق العمل"
          description="نخبة من المعلمين والخبراء المتخصصين في تبسيط علوم الحاسوب والذكاء الاصطناعي للأجيال القادمة."
        />

        <div className="py-10 sm:py-14 px-4 sm:px-6 flex justify-center items-center w-full border-b border-line bg-background">
          <GlowCardGrid className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-4xl w-full">
            {TEAM_MEMBERS.map((member) => (
              <GlowCard
                key={member.name}
                name={member.name}
                handle={member.handle}
                avatar={member.avatar}
                href={member.href}
              />
            ))}
          </GlowCardGrid>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 bg-card/10 text-center border-b border-line">
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            يجمع فريق سَنَد بين الخبرة التقنية العالية والشغف التربوي لإلهام الطلاب وبناء قدراتهم البرمجية بثقة وابتكار.
          </p>
        </div>
      </Container>
    </div>
  );
}
