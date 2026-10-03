import { AppointmentStatus, ArrivalStatus, DispositionKind, EmergencyStability } from "@/generated/prisma/enums";
/**
 * [E0] آلة حالات الوصول — المصدر الوحيد للانتقالات المسموحة.
 *
 * الخطة الحاكمة: `docs/emergency-workflow-plan.md` §3
 *
 * ── لماذا آلة ثانية أصلًا، والمبدأ يقول «طبقة لا آلة» ──────────────────────
 *
 * لأن هذه ليست آلة للزيارة بل للفترة **التي تسبقها**. آلة الزيارات تشترط مدرّبًا
 * ووقتًا ومدّة، وثلاثتها مجهولة قبل الفرز. فالوصول يعيش في آلته الصغيرة حتى يسدّ
 * الفرز الفجوة، ثم **يسلّم** إلى آلة الزيارات ولا يعود يتكلّم. هذا بالضبط شكل
 * `mobile-visit.workflow.ts`: طبقة لها مراحلها، وعقدٌ مثبَّت باختبار يربط مرحلتها
 * بحالة الزيارة.
 *
 * ملفّ بيانات/دوالّ نقية فقط (بلا db) — يُستورد من الخادم والواجهة معًا.
 */
export declare const ARRIVAL_STATUS_LABELS: Record<ArrivalStatus, string>;
export declare const ALLOWED_ARRIVAL_TRANSITIONS: Record<ArrivalStatus, readonly ArrivalStatus[]>;
/**
 * الحالات التي لا تقبل انتقالًا من مسار الوصول. `TRIAGED` **ليست** منها منذ [E5]:
 * هي نهاية مسار الوصول وبداية الحلقة، والقرار هو ما يُقفلها.
 */
export declare const TERMINAL_ARRIVAL_STATUSES: readonly ["DISPOSED", "LEFT_WITHOUT_TRIAGE", "CANCELLED"];
/** الحالات التي تظهر على اللوحة — المنتهية تُقرأ من تبويب السجلّ لا من اللوحة */
export declare const ACTIVE_ARRIVAL_STATUSES: readonly ["EN_ROUTE", "ARRIVED"];
export declare const isTerminalArrivalStatus: (status: ArrivalStatus) => boolean;
export declare const isActiveArrivalStatus: (status: ArrivalStatus) => boolean;
export declare const canArrivalTransition: (from: ArrivalStatus, to: ArrivalStatus) => boolean;
export declare const invalidArrivalTransitionMessage: (from: ArrivalStatus, to: ArrivalStatus) => string;
/**
 * عقد التسليم إلى آلة الزيارات — يُثبَّت باختبار (§3.1).
 *
 * وصولٌ حالته `TRIAGED` **يجب** أن يحمل زيارة، وحالة تلك الزيارة يجب أن تكون
 * واحدة من الثلاث التي يمكن أن يكون عليها طفلٌ حاضر في الأكاديمية الآن. أي حالة
 * أخرى تعني أن الوصول والزيارة افترقا، وهو ما لا يجوز أن يمرّ صامتًا.
 */
export declare const ARRIVAL_HANDOFF_APPOINTMENT_STATUSES: readonly ["WAITING", "CHECK_IN", "IN_SERVICE"];
export declare const isValidArrivalHandoff: (arrivalStatus: ArrivalStatus, appointmentId: string | null, appointmentStatus: AppointmentStatus | null) => boolean;
/**
 * المشي السريع للأحمر (القرار D5).
 *
 * الأحمر لا ينتظر في الطابور: يمشي `WAITING → CHECK_IN → IN_SERVICE` لحظة الفرز.
 * لكنّه **يمشي المسار ولا يقفز فوقه** — كل خطوة انتقالٌ مشروع في
 * `ALLOWED_TRANSITIONS` ويكتب صفّ `STATUS_CHANGED` بسببه. المصفوفة لا تُمسّ، والسجلّ
 * يقول لاحقًا لماذا قطع هذا الطفل الطابور في ثانية واحدة.
 */
export declare const RED_FAST_WALK_PATH: readonly ["CHECK_IN", "IN_SERVICE"];
export declare const RED_FAST_WALK_REASON = "RED_FAST_WALK";
export declare const VET_UNRESOLVED_MESSAGE: string;
export declare const TRIAGE_REQUIRED_MESSAGE = "\u0644\u0627 \u064A\u0645\u0643\u0646 \u0628\u062F\u0621 \u0627\u0644\u062F\u0648\u0631\u0629 \u0642\u0628\u0644 \u0641\u0631\u0632 \u0627\u0644\u062D\u0627\u0644\u0629";
/**
 * [E5.4] وليّ أمر «طفل بلا وليّ أمر» — القرار D2.
 *
 * `Appointment.ownerId` غير قابل للفراغ: الزيارة تُفوتَر على جهة، وطفلُ الشارع لا
 * جهة له. فلكلّ أكاديمية وليّ أمرٌ واحد بهذا الاسم تُنسَب إليه هذه الحالات، ويظهر في قوائم
 * أولياء الأمور كأيّ وليّ أمر — لا سجلّ خفيّ.
 *
 * **يُنشأ عند أوّل حاجة لا في البذرة**: البذور تُقصَر على قاعدة مأهولة
 * (`ensureGlobalDefaults` تتوقّف مبكرًا)، فأكاديميةٌ أُنشئت بعد البذر كانت ستبقى بلا
 * وليّ أمرٍ للشوارد وتسقط عند أوّل فرز.
 *
 * والهاتف علامةٌ غير قابلة للاتّصال عمدًا: مفتاح التفرّد هو `(clinicId, phone)`،
 * ورقمٌ حقيقيّ المظهر هنا كان سيُرسَل إليه تذكيرٌ أو رسالة يومًا ما.
 */
export declare const STRAY_OWNER_NAME = "\u0637\u0641\u0644 \u0628\u0644\u0627 \u0648\u0644\u064A\u0651 \u0623\u0645\u0631 (\u0637\u0648\u0627\u0631\u0626)";
export declare const STRAY_OWNER_PHONE = "\u2014";
export declare const PATIENT_REQUIRED_MESSAGE = "\u0633\u062C\u0651\u0644 \u0627\u0644\u0637\u0641\u0644 \u0642\u0628\u0644 \u0627\u0644\u0641\u0631\u0632 \u2014 \u0627\u0644\u0632\u064A\u0627\u0631\u0629 \u0644\u0627 \u062A\u064F\u0641\u062A\u062D \u0644\u0637\u0641\u0644 \u063A\u064A\u0631 \u0645\u0633\u062C\u064E\u0651\u0644";
export declare const ARRIVAL_LEFT_REASON_REQUIRED = "\u0633\u0628\u0628 \u0627\u0644\u0645\u063A\u0627\u062F\u0631\u0629 \u0623\u0648 \u0627\u0644\u0625\u0644\u063A\u0627\u0621 \u0645\u0637\u0644\u0648\u0628";
export declare const OVERRIDE_REASON_REQUIRED = "\u062A\u063A\u064A\u064A\u0631 \u0627\u0644\u0644\u0648\u0646 \u0627\u0644\u0645\u0642\u062A\u0631\u062D \u064A\u062A\u0637\u0644\u0651\u0628 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0633\u0628\u0628 \u2014 \u0627\u0644\u0641\u0627\u0631\u0642 \u0628\u064A\u0646 \u0627\u0644\u0645\u0642\u062A\u0631\u062D \u0648\u0627\u0644\u0645\u0639\u062A\u0645\u062F \u0647\u0648 \u0645\u0627 \u064A\u064F\u0642\u0627\u0633";
export declare const NO_DISCRIMINATORS_MESSAGE = "\u0627\u062E\u062A\u0631 \u0645\u064F\u0645\u064A\u0650\u0651\u0632\u064B\u0627 \u0648\u0627\u062D\u062F\u064B\u0627 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644\u0651 \u2014 \u0627\u0644\u0644\u0648\u0646 \u064A\u064F\u0634\u062A\u0642\u0651 \u0645\u0646 \u0627\u0644\u0641\u062D\u0635 \u0644\u0627 \u0645\u0646 \u0627\u0644\u062D\u062F\u0633";
export declare const EMERGENCY_STAGES: readonly ["EN_ROUTE", "UNTRIAGED", "TRIAGED_WAITING", "IN_TREATMENT", "DISPOSED"];
export type EmergencyStage = (typeof EMERGENCY_STAGES)[number];
export declare const EMERGENCY_STAGE_LABELS: Record<EmergencyStage, string>;
/**
 * مرحلة الحلقة من حالتَي الوصول والزيارة معًا.
 *
 * لا عمود للمرحلة عمدًا: المرحلة **قراءةٌ** لحالتين تملكهما آلتان مختلفتان، وتخزينها
 * ثالثةً يعني أن تفترق عنهما ذات يوم بلا أن يلاحظ أحد. الاشتقاق هو ما يجعل اللوحة
 * والزيارة يقولان الشيء نفسه دائمًا.
 */
export declare const emergencyStageOf: (input: {
    arrivalStatus: ArrivalStatus | null;
    appointmentStatus: AppointmentStatus | null;
    dispositionKind: DispositionKind | null;
}) => EmergencyStage;
export declare const DISPOSITION_KIND_LABELS: Record<DispositionKind, string>;
export declare const DISPOSITION_KIND_ORDER: readonly ["DISCHARGED", "ADMITTED", "TO_SURGERY", "TRANSFERRED", "LEFT_AGAINST_ADVICE", "DIED", "EUTHANIZED"];
export declare const STABILITY_LABELS: Record<EmergencyStability, string>;
/**
 * القرار ١: النفوق والقتل الرحيم يتجاوزان بوابة اكتمال الفحص — نفس
 * `DISCHARGE_KINDS_BYPASSING_CLOSURE_GATES` في التنويم. الفحص يُختَم بالمآل، والفاتورة
 * تبقى قائمة وتُحصَّل بمسارها؛ حبسُ تسجيل النفوق على إكمال فحصٍ قسوةٌ وخطأ بيانات
 * معًا (التأخير يجعل وقت الوفاة كذبًا).
 */
export declare const DISPOSITION_KINDS_BYPASSING_EXAM_GATE: readonly ["DIED", "EUTHANIZED"];
export declare const dispositionBypassesExamGate: (kind: DispositionKind) => boolean;
/**
 * المآلات التي تُقفل الزيارة إلى «بانتظار الدفع»: ما قُدِّم يُفوتَر. الإدخال والجراحة
 * لا يُقفلان الزيارة — الوحدة المستقبِلة تكمل مسارها منها.
 */
export declare const DISPOSITION_KINDS_CLOSING_VISIT: readonly ["DISCHARGED", "TRANSFERRED", "LEFT_AGAINST_ADVICE", "DIED", "EUTHANIZED"];
export declare const dispositionClosesVisit: (kind: DispositionKind) => boolean;
/**
 * المآلات التي تُقبل والزيارة لم تبدأ خدمتها (ما زالت في الطابور):
 * - المغادرة على مسؤولية وليّ الأمر: تُلغى الزيارة بسبب مسجَّل — لم يُقدَّم شيء.
 * - النفوق والقتل الرحيم: تُمشى الزيارة إلى «جاري الدورة» أوّلًا — نفق في قاعة
 *   الانتظار لا يعني أن الزيارة لم تحدث.
 * الباقي يشترط `IN_SERVICE`: قرارُ خروجٍ أو إدخالٍ لطفل لم يره المدرّب ليس قرارًا.
 */
export declare const DISPOSITION_KINDS_ALLOWED_BEFORE_SERVICE: readonly ["LEFT_AGAINST_ADVICE", "DIED", "EUTHANIZED"];
export declare const dispositionAllowedBeforeService: (kind: DispositionKind) => boolean;
export declare const EMERGENCY_DISPOSITION_REASON = "EMERGENCY_DISPOSITION";
/** [E5.5] سبب المشي إلى «جاري الدورة» من لوحة الطوارئ */
export declare const EMERGENCY_START_TREATMENT_REASON = "EMERGENCY_START_TREATMENT";
export declare const DISPOSITION_REQUIRES_SERVICE_MESSAGE = "\u0627\u0628\u062F\u0623 \u0627\u0644\u062F\u0648\u0631\u0629 \u0642\u0628\u0644 \u0627\u0644\u0642\u0631\u0627\u0631 \u2014 \u0642\u0631\u0627\u0631\u064F \u062E\u0631\u0648\u062C \u0623\u0648 \u0625\u062F\u062E\u0627\u0644 \u0644\u0637\u0641\u0644 \u0644\u0645 \u064A\u0631\u0647 \u0627\u0644\u0645\u062F\u0631\u0651\u0628 \u0644\u064A\u0633 \u0642\u0631\u0627\u0631\u064B\u0627";
export declare const TRANSFER_DESTINATION_REQUIRED_MESSAGE = "\u0627\u0630\u0643\u0631 \u0627\u0644\u0645\u0646\u0634\u0623\u0629 \u0627\u0644\u0645\u064F\u062D\u0648\u064E\u0651\u0644 \u0625\u0644\u064A\u0647\u0627";
export declare const SURGERY_DETAILS_REQUIRED_MESSAGE = "\u0627\u062E\u062A\u0631 \u0627\u0644\u0625\u062C\u0631\u0627\u0621 \u0627\u0644\u062C\u0631\u0627\u062D\u064A \u0648\u0627\u0644\u062C\u0631\u0651\u0627\u062D \u2014 \u062D\u0627\u0644\u0629 \u0627\u0644\u0639\u0645\u0644\u064A\u0629 \u0644\u0627 \u062A\u064F\u0641\u062A\u062D \u0628\u0644\u0627 \u0625\u062C\u0631\u0627\u0621";
export declare const ALREADY_DISPOSED_MESSAGE = "\u0635\u062F\u0631 \u0642\u0631\u0627\u0631 \u0647\u0630\u0647 \u0627\u0644\u062D\u0627\u0644\u0629 \u0645\u0646 \u0642\u0628\u0644 \u0648\u0644\u0627 \u064A\u064F\u0639\u0627\u062F";
export declare const EPISODE_NOT_FOUND_MESSAGE = "\u0644\u0627 \u062D\u0644\u0642\u0629 \u0637\u0648\u0627\u0631\u0626 \u0644\u0647\u0630\u0647 \u0627\u0644\u0632\u064A\u0627\u0631\u0629 \u2014 \u0627\u0641\u0631\u0632 \u0627\u0644\u062D\u0627\u0644\u0629 \u0623\u0648\u0651\u0644\u064B\u0627 \u062B\u0645 \u0642\u0631\u0651\u0631 \u0645\u0622\u0644\u0647\u0627";
/** رسالة الرفض إن كان القرار ناقصًا — `null` يعني مقبول */
export declare const dispositionRequirementError: (input: {
    kind: DispositionKind;
    appointmentStatus: AppointmentStatus;
    transferDestination?: string | null;
    surgery?: {
        procedureServiceId?: string | null;
        surgeonStaffId?: string | null;
    } | null;
}) => string | null;
