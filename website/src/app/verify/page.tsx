import Container from "@/components/container";
import { SectionHeader } from "@/components/ui/header";
import PageBreadcrumb from "@/components/page-breadcrumb";
import { VerifyForm } from "./components/verify-form";

export default function VerifyPage() {
  return (
    <div
      className="flex-1 flex flex-col w-full max-w-screen overflow-x-clip bg-background pt-14 selection:bg-primary/20"
      dir="rtl"
    >
      <Container className="relative flex-1 flex flex-col">
        {/* Unified Breadcrumb Navigation */}
        <PageBreadcrumb
          items={[
            { label: "حول الأكاديمية" },
            { label: "التوثيق" },
          ]}
        />

        <SectionHeader
          title="توثيق شهادة سند"
          description="امسح رمز الاستجابة السريعة (QR) الموجود على الشهادة، أو أدخل رقمها بالأسفل للتحقق من صحتها."
        />

        <div className="flex-1 flex flex-col items-center justify-center py-10 sm:py-14 md:py-16 px-4">
          <div className="w-full max-w-md flex flex-col items-center bg-card border border-line rounded-xl p-4 sm:p-6 md:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-foreground mb-1.5">
              أدخل رقم الشهادة
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mb-6 text-center">
              رقم الشهادة مطبوع أسفل كل شهادة صادرة من سند.
            </p>

            <VerifyForm />
          </div>
        </div>
      </Container>
    </div>
  );
}
