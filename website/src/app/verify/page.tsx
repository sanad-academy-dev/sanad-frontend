import Container from "@/components/container";
import { Award, ShieldCheck } from "lucide-react";
import { VerifyForm } from "./components/verify-form";

export default function VerifyPage() {
  return (
    <main className="flex flex-col bg-background selection:bg-primary/20 flex-1">
      <section className="flex-1 flex flex-col items-center justify-center py-24 md:py-32 relative overflow-hidden">
        {/* Subtle background glow/effects to make it look premium */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <Container className="relative z-10 flex flex-col items-center text-center gap-4 max-w-4xl" dir="rtl">
          
          {/* Badge Icon */}
          <div className="flex flex-col items-center justify-center mb-4">
             <div className="relative size-28 md:size-36 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 rounded-full border-4 border-primary/20 shadow-xl shadow-primary/5 mb-6">
               <ShieldCheck className="size-14 md:size-20 text-primary drop-shadow-sm" />
               <div className="absolute -bottom-2 bg-background border border-border px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                 <Award className="size-3 text-primary" />
                 <span className="text-[10px] font-bold text-foreground">معتمد</span>
               </div>
             </div>
             <span className="text-sm font-extrabold text-muted-foreground tracking-widest uppercase">
               خدمة التوثيق
             </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-extrabold text-foreground tracking-tight leading-tight">
            توثيق شهادة سند
          </h1>
          <p className="text-lg md:text-xl font-medium text-muted-foreground mt-2 max-w-2xl leading-relaxed">
            امسح رمز الاستجابة السريعة (QR) الموجود على الشهادة، أو أدخل رقمها بالأسفل للتحقق من صحتها.
          </p>

          {/* Form Card */}
          <div className="w-full max-w-xl mt-12 flex flex-col items-center bg-card border border-border/60 rounded-3xl p-8 md:p-10 shadow-lg shadow-black/5">
            <h2 className="text-2xl font-extrabold text-foreground mb-2">أدخل رقم الشهادة</h2>
            <p className="text-[15px] font-medium text-muted-foreground mb-8">
              رقم الشهادة مطبوع أسفل كل شهادة صادرة من سند.
            </p>

            <VerifyForm />
          </div>
        </Container>
      </section>
    </main>
  );
}
