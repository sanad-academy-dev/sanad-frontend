"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Branches,
  Hub,
  Laptop,
  Query,
  Terminal,
  type HairlineProps,
} from "@lucasmarkes/hairline/react";
import Container from "./container";
import { SectionHeader } from "@/components/ui/header";
import {
  Compass,
  Brain,
  Code2,
  Award,
  Sparkles,
  CheckCircle2,
  ArrowUpLeft,
  BookOpen,
} from "lucide-react";
import { openTrialAssessmentModal } from "@/components/trial-modal";
import { cn } from "@/lib/utils";

const stages = [
  {
    id: "foundation",
    title: "المُرتاد",
    planName: "التأسيس",
    levels: "المستويات 01–07",
    age: "6–8 سنوات",
    prerequisite: "بدون أي شروط مسبقة",
    courses: [
      "التفكير المنطقي وحل المشكلات (Unplugged)",
      "بكتو بلوكس (برمجة من الصفر)",
      "الألعاب والقصص التفاعلية الأولى",
    ],
    example: {
      title: "التسلسل والأحداث التفاعلية",
      challenge: "برمج حركة الشخصية وتفاعلها الصوتي والحركي عندما تلمس الهدف.",
      newSkill: "بناء المنطق البرمجي وربط الأحداث بالنتائج داخل بيئة مرئية ممتعة.",
      whatToBuild: "أول لعبة تفاعلية وقصة رقمية متحركة بنظام المكعبات البرمجية",
    },
    icon: Compass,
  },
  {
    id: "building",
    title: "المُشيِّد",
    planName: "البناء",
    levels: "المستويات 08–14",
    age: "9–11 سنة",
    prerequisite: "إتمام التأسيس أو اجتياز تقييم المستوى",
    courses: [
      "بكتو بلوكس AI والذكاء الاصطناعي المرئي",
      "أساسيات تطوير الألعاب (Game Dev)",
      "مدخل إلى الذكاء الاصطناعي وخوارزميات التعرف",
    ],
    example: {
      title: "المتغيرات وتتبع النقاط والمستويات",
      challenge: "برمج نظام نقاط ذكي وعقبات تصاعدية تزداد صعوبتها تدريجياً مع تقدم اللاعب.",
      newSkill: "إدارة البيانات والمتغيرات البرمجية وهيكلة منطق اللعبة المتقدم.",
      whatToBuild: "لعبة إلكترونية كاملة بنظام نقاط، مستويات، ومؤثرات تفاعلية",
    },
    icon: Brain,
  },
  {
    id: "evolution",
    title: "المُستنبِط",
    planName: "التطور ★",
    levels: "المستويات 15–21",
    age: "12–14 سنة",
    prerequisite: "إتمام البناء أو اجتياز تقييم المستوى",
    courses: [
      "بايثون للأطفال (كتابة الكود النصي الحقيقي)",
      "MIT App Inventor (برمجة تطبيقات الهاتف)",
      "تصميم الألعاب بمحرك Godot ولغة GDScript",
    ],
    example: {
      title: "البرمجة النصية بلغة بايثون ومعالجة المشكلات",
      challenge: "صمم أداة بايثون ذكية تحلل مدخلات المستخدم وتؤتمت حساب أو حل مسألة واقعية.",
      newSkill: "كتابة دوال نقية وتطوير برمجيات حقيقية بالاعتماد على خوارزميات نظيفة.",
      whatToBuild: "أدوات برمجية وتطبيقات بايثون تعالج مسائل عملية وتخدم المستخدمين",
    },
    icon: Code2,
  },
  {
    id: "mastery",
    title: "السَّنَد",
    planName: "الإحتراف",
    levels: "المستويات 22–28",
    age: "15–17 سنة",
    prerequisite: "إتمام التطور أو اجتياز تقييم المستوى",
    courses: [
      "البايثون المتقدم وأتمتة النظم والبيانات",
      "تطوير وتصميم مواقع الويب (HTML و CSS)",
      "لغة جافا والبرمجة كائنية التوجه (Java OOP)",
      "مشروع التخرج النهائي ونشره (Capstone)",
    ],
    example: {
      title: "قيادة مشروع برمجي متكامل وإطلاقه",
      challenge: "قد فريقاً برمجياً مصغراً لتصميم وبناء واختبار ونشر تطبيق رقمي حقيقي على الإنترنت.",
      newSkill: "إدارة المشروعات التقنية، العمل الجماعي، هندسة البرمجيات، والقيادة.",
      whatToBuild: "مشروع تقني متكامل ومنشور يضاف لمعرض أعمال الطالب الاحترافي (Portfolio)",
    },
    icon: Award,
  },
  {
    id: "custom",
    title: "خاص 1:1",
    planName: "مسار مخصص",
    levels: "أي مستوى (01–28)",
    age: "6–17 سنة",
    prerequisite: "تقييم فردي معمّق وخطة شخصية",
    courses: [
      "خطة فردية مخصصة ومفصلة بالكامل حسب الهدف",
      "اختيار أي تخصص (ذكاء اصطناعي، ويب، ألعاب، روبوتات)",
      "تدريب فردي مكثف 1:1 مع مدرب متخصص مفرغ",
    ],
    example: {
      title: "توجيه مكثف ومسار خاص بالكامل",
      challenge: "التركيز على بناء مشروع فريد في المجال المفضل لطفلك (ألعاب، ويب، ذكاء اصطناعي، مسابقات).",
      newSkill: "تحقيق أقصى استيعاب وتطبيق عملي من خلال مدرب خاص مفرغ لطفلك طوال الجلسة.",
      whatToBuild: "مشاريع فريدة ومخصصة بنسبة 100% تحقق تطلعات الأسرة وشغف الطالب الخاص",
    },
    icon: Sparkles,
  },
] as const;

const stageAnimations = {
  foundation: Branches,
  building: Query,
  evolution: Terminal,
  mastery: Laptop,
  custom: Hub,
} satisfies Record<(typeof stages)[number]["id"], React.ComponentType<HairlineProps>>;

type Stage = (typeof stages)[number];

export default function Levels() {
  const [activeStage, setActiveStage] = useState<Stage>(stages[0]);
  const ActiveIcon = activeStage.icon;
  const ActiveAnimation = stageAnimations[activeStage.id];

  return (
    <section
      className="w-full bg-background relative overflow-hidden scroll-mt-16"
      id="levels"
      dir="rtl"
    >
      <Container className="relative z-10">
        <SectionHeader
          title="مستويات مسارات التعلم"
          description="خمس محطات رئيسية ترتقي بطفلك من التفكير المنطقي الأول وصناعة الألعاب حتى قيادة مشاريع البرمجة الحقيقية."
        />

        <div className="py-6 sm:py-8 px-4 sm:px-6 max-w-5xl mx-auto w-full">
          {/* Level Tabs */}
          <div className="flex items-center gap-3 sm:gap-4 pb-3 sm:pb-3.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="size-8 sm:size-8.5 rounded-full border border-line bg-secondary/80 flex items-center justify-center text-primary shrink-0 transition-all duration-200">
              <ActiveIcon className="size-4 text-primary" />
            </div>

            <div className="flex items-center gap-2 sm:gap-4 md:gap-6 shrink-0">
              {stages.map((stage) => {
                const isActive = activeStage.id === stage.id;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => setActiveStage(stage)}
                    className={cn(
                      "relative pb-2 pt-1 font-sans text-xs sm:text-sm transition-colors duration-150 cursor-pointer select-none outline-none whitespace-nowrap",
                      isActive
                        ? "text-foreground font-bold"
                        : "text-muted-foreground font-medium hover:text-foreground"
                    )}
                  >
                    <span>{stage.title}</span>
                    <span className="font-sans text-[11px] sm:text-xs font-normal opacity-75 ms-1.5">
                      ({stage.planName})
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="active-stage-underline"
                        className="absolute bottom-0 inset-x-0 h-[1.25px] bg-foreground rounded-full"
                        transition={{
                          type: "spring",
                          bounce: 0.15,
                          duration: 0.3,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Level Card */}
          <div className="rounded-xl border border-line bg-background/70 backdrop-blur-xs p-4 sm:p-6 md:p-7 shadow-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch"
              >
                {/* Details side */}
                <div className="w-full lg:w-1/2 rounded-xl bg-secondary/25 backdrop-blur-xs p-4 sm:p-6 border border-line flex flex-col justify-between gap-4">
                  <div className="flex flex-col gap-3.5">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-2.5 border-b border-line/60">
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-xs sm:text-sm font-bold text-foreground">
                          مسار {activeStage.title}
                        </span>
                        <span className="font-sans text-xs text-muted-foreground/85 font-medium">
                          • {activeStage.levels}
                        </span>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-primary/10 border border-primary/20 font-sans text-xs font-bold text-primary select-none">
                        {activeStage.age}
                      </span>
                    </div>

                    {/* Courses in this level */}
                    <div className="flex flex-col gap-2 pt-0.5">
                      <span className="font-sans text-xs font-semibold text-muted-foreground/90 select-none flex items-center gap-1.5">
                        <BookOpen className="size-3.5 text-primary shrink-0" />
                        الدورات المقررة في هذا المستوى:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeStage.courses.map((course, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/70 border border-line font-sans text-xs font-medium text-foreground/90 leading-tight select-none transition-colors hover:bg-secondary"
                          >
                            <span className="size-1.5 rounded-full bg-primary shrink-0" />
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Practical Challenge */}
                    <div className="flex flex-col gap-1.5 pt-1">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-sans text-[11px] font-semibold text-primary select-none">
                          التحدي البرمجي العملي
                        </span>
                        <h3 className="font-heading text-sm sm:text-base font-bold text-foreground tracking-normal">
                          {activeStage.example.title}
                        </h3>
                      </div>
                      <p className="font-sans text-xs sm:text-[13px] text-foreground/80 leading-relaxed font-normal">
                        {activeStage.example.challenge}
                      </p>
                    </div>

                    <div className="h-0 w-full border-t border-dashed border-line my-0.5" />

                    {/* Acquired Skill */}
                    <div className="flex flex-col gap-1.5">
                      <span className="font-sans text-xs font-semibold text-primary flex items-center gap-1.5 select-none">
                        <Sparkles className="size-3.5" />
                        المهارة المكتسبة
                      </span>
                      <p className="font-sans text-xs sm:text-[13px] text-foreground/80 leading-relaxed font-normal">
                        {activeStage.example.newSkill}
                      </p>
                    </div>

                    {/* Prerequisite */}
                    <div className="flex items-center gap-2 pt-1 font-sans text-xs text-muted-foreground/90 font-medium">
                      <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                      <span>شرط الدخول: <strong className="font-semibold text-foreground/90">{activeStage.prerequisite}</strong></span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-3.5 border-t border-line/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-sans text-xs font-semibold text-muted-foreground/80 select-none">
                        ما الذي سيبنيه طفلك؟
                      </span>
                      <span className="font-sans text-xs sm:text-sm font-bold text-foreground">
                        {activeStage.example.whatToBuild}
                      </span>
                    </div>

                    <button
                      suppressHydrationWarning
                      type="button"
                      onClick={() => openTrialAssessmentModal()}
                      className="group flex h-9 items-center justify-center gap-1.5 rounded-lg bg-primary px-3.5 font-sans text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all active:scale-[0.98] cursor-pointer shadow-none shrink-0"
                    >
                      <span>قيّم طفلك</span>
                      <ArrowUpLeft className="size-3.5 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>
                  </div>
                </div>

                {/* Animation side */}
                <div className="flex min-h-[240px] sm:min-h-[280px] w-full items-center justify-center lg:min-h-0 lg:w-1/2 p-4">
                  <ActiveAnimation
                    className="w-full max-w-[380px] sm:max-w-[420px]"
                    intensity={0.35}
                    label={`أنيميشن مستوى ${activeStage.title}`}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  );
}
