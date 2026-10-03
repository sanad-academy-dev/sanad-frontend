import type { PetOwnerScope } from "@/server/pet-portal/pet-auth.macro";
/**
 * [PP6] تقرير السجلّ الواحد — «ماذا جرى في هذه الزيارة بالضبط؟».
 *
 * ── لماذا نقطة واحدة لخمسة أنواع ─────────────────────────────────────────
 *
 * السجلّ في تطبيق وليّ الأمر خمسة أنواع (زيارة، تطعيم، قياسات، خطة رعاية، تجميل)، وكلّها
 * تُقرأ بالسؤال نفسه: افتح الصفّ فأخبرني بكل ما فيه. خمس نقاط بخمسة أشكال كانت ستعني
 * خمس شاشات في التطبيق تتفرّع على النوع، وسادسًا حين يُضاف نوع.
 *
 * ولذلك الشكل **موحَّد ومسطَّح**: أقسامٌ فيها أسطر `{label, value}`. الخادم يقرّر ما
 * يُعرض وبأي ترتيب وبأي صياغة عربية، والتطبيق يرسم ما وصله بلا معرفةٍ بالأنواع. إضافة
 * حقلٍ غدًا لا تلمس التطبيق أصلًا.
 *
 * ── ما لا يُعرض، وهو الأهمّ ──────────────────────────────────────────────
 *
 * `internalNotes` مستثناة باسمها: حقلٌ سمّاه النظام «داخليًّا» لا يُرسَل إلى وليّ أمر.
 *
 * و`clinicalNotes` و`clinicalExam` مستثناتان بالقرار نفسه الذي يحجب التحاليل والأشعة
 * ([D6]): تشخيصٌ يصل وليّ الأمر قبل أن يشرحه مدرّب يُقرأ حكمًا لا فرضية — و«اشتباه ورم»
 * في سطرٍ بلا سياق أذًى لا إفادة. تُعرض بدلها **كلمات وليّ الأمر نفسه** (سبب الزيارة
 * والأعراض) وما جرى فعلًا: دوراتٌ أُدّيت، وأصنافٌ صُرفت، وقياساتٌ أُخذت.
 */
export type RecordSection = {
    title: string;
    rows: {
        label: string;
        value: string;
    }[];
};
export type RecordDetail = {
    kind: string;
    id: string;
    title: string;
    occurredAt: string;
    clinicName: string;
    sections: RecordSection[];
};
/** تقرير الزيارة — ما طُلب، وما أُدّي، وما صُرف، وما قيس، وما حُوسب عليه. */
declare function appointmentReport(scope: PetOwnerScope, id: string): Promise<RecordDetail | null>;
declare function vaccinationReport(scope: PetOwnerScope, id: string): Promise<RecordDetail | null>;
declare function vitalsReport(scope: PetOwnerScope, id: string): Promise<RecordDetail | null>;
declare function carePlanReport(scope: PetOwnerScope, id: string): Promise<RecordDetail | null>;
declare function groomingReport(scope: PetOwnerScope, id: string): Promise<RecordDetail | null>;
declare const BUILDERS: {
    readonly APPOINTMENT: typeof appointmentReport;
    readonly VACCINATION: typeof vaccinationReport;
    readonly VITALS: typeof vitalsReport;
    readonly CARE_PLAN: typeof carePlanReport;
    readonly GROOMING: typeof groomingReport;
};
export type RecordKind = keyof typeof BUILDERS;
export declare const RECORD_KINDS: RecordKind[];
export declare const recordReport: (scope: PetOwnerScope, kind: RecordKind, id: string) => Promise<RecordDetail | null>;
export {};
