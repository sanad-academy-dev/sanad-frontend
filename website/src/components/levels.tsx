'use client';

import React, { useState } from 'react';
import Container from './container';
import { Compass, Brain, Code2, Layers, Sparkles, TrendingUp, Check, Target, ChevronLeft } from 'lucide-react';

const stages = [
  {
    id: "explorer",
    stageNumber: "01",
    title: "المستكشف",
    levelsRange: "01-04",
    age: "6-9 سنوات",
    quote: "نبني الأساس قبل كتابة الكود.",
    basicSkills: ["التفكير المنطقي", "ترتيب الخطوات", "حل المشكلات", "Creative Coding"],
    outcome: "يحول فكرة بسيطة إلى تجربة تفاعلية.",
    example: {
      level: "03",
      title: "الشروط",
      challenge: "اجعل الشخصية تتفاعل عندما تلمس الهدف.",
      newSkill: "ربط الحدث بالنتيجة داخل اللعبة.",
      whatToBuild: "قصة تفاعلية أو لعبة صغيرة",
    },
    icon: Compass,
  },
  {
    id: "thinker",
    stageNumber: "02",
    title: "المفكر",
    levelsRange: "05-09",
    age: "8-12 سنة",
    quote: "نحوّل المشكلة إلى خطوات قابلة للحل.",
    basicSkills: ["الخوارزميات", "الشروط", "المتغيرات", "اختبار الحل"],
    outcome: "يخطط للحل ويختبره ويصحح أخطاءه.",
    example: {
      level: "07",
      title: "المتغيرات",
      challenge: "اجعل اللعبة تتذكر نقاط اللاعب.",
      newSkill: "التعامل مع البيانات داخل البرنامج.",
      whatToBuild: "لعبة متقدمة أو Python Mini App",
    },
    icon: Brain,
  },
  {
    id: "coder",
    stageNumber: "03",
    title: "المبرمج",
    levelsRange: "10-14",
    age: "10-14 سنة",
    quote: "نكتب كودًا واضحًا يحل مشكلة حقيقية.",
    basicSkills: ["Python", "البيانات", "الدوال", "Problem Solving"],
    outcome: "يبني برنامجًا كاملًا ويشرح طريقة عمله.",
    example: {
      level: "12",
      title: "الدوال",
      challenge: "قسّم التطبيق إلى أجزاء يعاد استخدامها.",
      newSkill: "تنظيم الكود وبناء وظائف واضحة.",
      whatToBuild: "تطبيق Python أو مشروع ويب",
    },
    icon: Code2,
  },
  {
    id: "builder",
    stageNumber: "04",
    title: "الباني",
    levelsRange: "15-19",
    age: "13-16 سنة",
    quote: "نحوّل الكود إلى منتج يمكن استخدامه.",
    basicSkills: ["HTML & CSS", "JavaScript", "واجهات المستخدم", "بناء المنتجات"],
    outcome: "يصمم ويبني وينشر منتجًا رقميًا.",
    example: {
      level: "17",
      title: "التفاعل",
      challenge: "اجعل الواجهة تستجيب لاختيارات المستخدم.",
      newSkill: "بناء تجربة ويب تفاعلية.",
      whatToBuild: "تطبيق ويب حقيقي",
    },
    icon: Layers,
  },
  {
    id: "innovator",
    stageNumber: "05",
    title: "المبتكر",
    levelsRange: "20-23",
    age: "14-18 سنة",
    quote: "نستخدم التقنية لصناعة حل أذكى.",
    basicSkills: ["AI", "Automation", "APIs", "التفكير التصميمي"],
    outcome: "يوظف أدوات حديثة لحل مشكلة محددة.",
    example: {
      level: "22",
      title: "الأتمتة",
      challenge: "حوّل مهمة متكررة إلى تدفق يعمل تلقائيًا.",
      newSkill: "تصميم حلول توفر الوقت والجهد.",
      whatToBuild: "أداة ذكية أو تدفق عمل مؤتمت",
    },
    icon: Sparkles,
  },
  {
    id: "engineer",
    stageNumber: "06",
    title: "المهندس",
    levelsRange: "24-27",
    age: "15-18 سنة",
    quote: "نجمع المهارات في مشروع متكامل.",
    basicSkills: ["تخطيط المشروع", "هندسة الحل", "الاختبار", "Portfolio"],
    outcome: "يقدم مشروع تخرج من الفكرة إلى العرض.",
    example: {
      level: "27",
      title: "مشروع التخرج",
      challenge: "ابنِ واختبر وقدّم حلًا متكاملًا لمشكلة حقيقية.",
      newSkill: "إدارة مشروع تقني من الفكرة إلى الإطلاق.",
      whatToBuild: "مشروع متكامل يضاف لمعرض أعماله (Portfolio)",
    },
    icon: TrendingUp,
  },
];

export default function Levels() {
  const [activeStage, setActiveStage] = useState(stages[0]);

  return (
    <section className="w-full bg-background relative overflow-hidden">
      <Container className="py-24 relative z-10">
        <div className="relative z-10 w-full border-t border-border pt-24">
        
        {/* Header */}
        <div className="text-center mb-24 flex flex-col items-center">
          
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6 leading-tight">
            27 مستوى... مهارة تُبنى<br />خطوة بخطوة
          </h2>
          <p className="text-muted-foreground text-lg">
            كل مستوى يضيف مهارة جديدة، وكل مرحلة تقرّب طفلك من بناء مشاريع أكثر تقدماً.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative flex justify-start md:justify-between items-start w-full mb-16 overflow-x-auto pb-6 gap-6 md:gap-0 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {stages.map((stage, index) => {
            const isActive = activeStage.id === stage.id;
            const Icon = stage.icon;
            return (
              <React.Fragment key={stage.id}>
                <div 
                  className="relative z-10 flex flex-col items-center gap-3 cursor-pointer group w-24 shrink-0 snap-center" 
                  onClick={() => setActiveStage(stage)}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 border-[3px] bg-background ${isActive ? 'border-primary bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/20' : 'border-border text-muted-foreground group-hover:border-primary/50 group-hover:text-primary/80'}`}>
                    <Icon className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="text-center mt-2 flex flex-col items-center">
                    <div className={`text-[10px] uppercase tracking-widest mb-1 font-sans transition-colors ${isActive ? 'text-primary font-bold' : 'text-muted-foreground font-semibold'}`}>
                      المستويات {stage.levelsRange}
                    </div>
                    <div className={`text-base font-black transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                      {stage.title}
                    </div>
                  </div>
                </div>
                
                {/* Arrow Connector */}
                {index < stages.length - 1 && (
                  <div className="hidden md:flex flex-1 items-center justify-center mt-7 relative mx-2">
                    <div className="h-[2px] w-full bg-border transition-colors duration-300"></div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Details Card */}
        <div className="bg-muted/30 rounded-3xl p-4 md:p-6 border border-border shadow-sm relative overflow-hidden">
          
          <div 
            key={activeStage.id} 
            className="flex flex-col md:flex-row gap-4 md:gap-8 items-stretch animate-in fade-in zoom-in-95 duration-500 fill-mode-forwards"
          >
            {/* Right Content */}
            <div className="flex-1 flex flex-col justify-between py-2 md:py-4 px-2 md:px-4 order-2 md:order-1">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-primary font-bold text-sm md:text-base">المرحلة {activeStage.stageNumber}</div>
                </div>
                <h3 className="text-4xl md:text-5xl font-black text-foreground mb-4">{activeStage.title}</h3>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-background px-4 py-2 rounded-full text-sm font-bold text-foreground shadow-sm border border-border">
                    المستويات {activeStage.levelsRange}
                  </span>
                  <span className="bg-background px-4 py-2 rounded-full text-sm font-bold text-foreground shadow-sm border border-border">
                    {activeStage.age}
                  </span>
                </div>

                <div className="relative mb-8">
                  <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-primary rounded-r-full"></div>
                  <div className="bg-background pr-6 pl-4 py-3 rounded-r-none shadow-sm border border-l border-y border-border border-r-0 text-lg md:text-xl font-black text-foreground leading-snug">
                    "{activeStage.quote}"
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-bold text-muted-foreground mb-3">المهارات الأساسية</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeStage.basicSkills.map((skill, i) => (
                      <div key={i} className="bg-background border border-border rounded-full px-3 py-1.5 text-sm font-bold text-foreground flex items-center gap-2 shadow-sm transition-all hover:border-primary/50">
                        <Check className="w-4 h-4 text-primary" />
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-background p-4 shadow-sm border border-border mt-auto">
                <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-muted-foreground mb-1">نتيجة المرحلة</div>
                  <div className="font-black text-foreground text-sm md:text-base">{activeStage.outcome}</div>
                </div>
              </div>
            </div>

            {/* Left Content - Dark Card */}
            <div className="w-full md:w-[400px] shrink-0 rounded-3xl bg-card p-6 text-card-foreground flex flex-col relative overflow-hidden order-1 md:order-2 shadow-2xl border border-border">
              {/* <div className="absolute -left-10 -top-10 p-6 opacity-[0.03] rotate-12 pointer-events-none">
                <activeStage.icon className="w-64 h-64 text-foreground" />
              </div> */}
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                  <div className="text-primary text-xs font-black tracking-widest uppercase bg-primary/10 px-3 py-1.5 rounded-full">مستوى {activeStage.example.level}</div>
                  <div className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center bg-primary/10 text-primary">
                    <activeStage.icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-muted-foreground text-sm font-bold mb-2">مثال من داخل المرحلة</div>
                  <h4 className="text-2xl font-black text-foreground">{activeStage.example.title}</h4>
                </div>

                <div className="space-y-6 flex-1">
                  <div>
                    <div className="text-primary text-sm font-bold mb-2">التحدي العملي</div>
                    <p className="text-foreground/80 text-sm leading-relaxed font-semibold">{activeStage.example.challenge}</p>
                  </div>
                  
                  <div className="h-px w-full bg-border"></div>
                  
                  <div>
                    <div className="text-primary text-sm font-bold mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      مهارة جديدة
                    </div>
                    <p className="text-foreground/80 text-sm leading-relaxed font-semibold">{activeStage.example.newSkill}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 bg-muted/50 -mx-6 -mb-6 px-6 pb-6 border-t border-border">
                  <div className="text-muted-foreground text-xs font-bold mb-2">ما الذي سيبنيه طفلك؟</div>
                  <div className="text-foreground font-black text-base">{activeStage.example.whatToBuild}</div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
      </Container>
    </section>
  );
}

