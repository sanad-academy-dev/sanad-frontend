/**
 * [RBAC P2] The resource registry — the single source of truth for what can be permitted.
 *
 * Every permission slug in the app is GENERATED from this file (`{resource}.{action}`),
 * never hand-written. That is the whole point: the old catalogue was a hand-maintained
 * `PERMISSIONS` object plus a *separately* hand-maintained section list in the roles
 * editor, and the two drifted — accounting appeared in the editor zero times, and four
 * sections shipped `comingSoon: true` with empty toggles while their slugs were already
 * being enforced server-side.
 *
 * This module is intentionally **pure** — string constants and derivations only, no DB,
 * session, or env imports — so the roles editor can import it into the client bundle
 * exactly as `accounting-permissions.ts` already is. Enforcement lives in
 * `src/server/rbac/rbac.guard.ts`.
 *
 * Tenant scoping is NOT a permission: `clinicId` decides *whose* data a user may touch and
 * is handled by the macro. Permissions decide *what* they may do; {@link PermissionScope}
 * decides *how much* of it (all of the clinic, their branch, or only their own records).
 */
/**
 * The action vocabulary. Deliberately small — a domain-specific verb belongs in a
 * resource's `extraActions`, not here, so the common four stay comparable across modules.
 */
export declare const RBAC_ACTIONS: readonly ["read", "create", "update", "delete", "export", "approve", "run"];
export type RbacAction = (typeof RBAC_ACTIONS)[number];
/**
 * What a resource *is*, which fixes the actions it can grant. Mirrors the accounting
 * registry's `kind` idea, generalised to the rest of the app.
 *
 * - `record`   — clinic data with a full CRUD lifecycle
 * - `master`   — reference/catalogue data (species, lab parameters, leave types)
 * - `report`   — derived read-only views; `export` is separate because leaving the
 *                building with a CSV is a different act from looking at a screen
 * - `settings` — configuration; no create/delete, only read + update
 * - `tool`     — a process that is *run* (imports, reconciliations, agent actions)
 */
export type RbacResourceKind = "record" | "master" | "report" | "settings" | "tool";
export declare const ACTIONS_BY_KIND: {
    readonly record: readonly ["read", "create", "update", "delete"];
    readonly master: readonly ["read", "create", "update", "delete"];
    readonly report: readonly ["read", "export"];
    readonly settings: readonly ["read", "update"];
    readonly tool: readonly ["read", "run"];
};
/**
 * How much of a resource a grant reaches. Replaces the old `view_limited` / `view_full`
 * slug pairs, whose "limited" had no shared meaning — it was branch membership in
 * clinic-documents, the acting groomer's own sessions in grooming, and nothing at all in
 * the other 76 controllers.
 *
 * - `ALL`    — every record in the clinic
 * - `BRANCH` — records belonging to the actor's branch (`BranchUser.branchId`)
 * - `OWN`    — records the actor is the subject of, or created (`Staff.id`)
 */
export declare const PERMISSION_SCOPES: readonly ["ALL", "BRANCH", "OWN"];
export type PermissionScope = (typeof PERMISSION_SCOPES)[number];
/** Ordered widest → narrowest, for "is this grant at least as wide as required?" checks. */
export declare const SCOPE_WIDTH: Record<PermissionScope, number>;
export declare const RBAC_GROUPS: readonly ["clinical", "finance", "accounting", "hr", "inventory", "operations", "admin"];
export type RbacGroup = (typeof RBAC_GROUPS)[number];
export declare const GROUP_LABELS: Record<RbacGroup, {
    ar: string;
    en: string;
}>;
export type RbacResource = {
    /** slug segment — `{key}.{action}`; matches the module folder name where one exists */
    key: string;
    kind: RbacResourceKind;
    group: RbacGroup;
    labelAr: string;
    labelEn: string;
    /**
     * Scopes this resource can meaningfully be granted at, narrower than ALL. Empty means
     * the resource is clinic-wide by nature (settings, catalogues) and every grant is ALL.
     * A scope listed here MUST have a real filter in the resource's DAO — an unenforced
     * scope is worse than none, because the editor promises a restriction that isn't there.
     */
    scopes: readonly PermissionScope[];
    /**
     * Domain verbs beyond the kind's defaults. Each needs a comment saying why it is not
     * simply inherited from `update` — the test in `rbac-registry.test.ts` checks that
     * every extra action is labelled.
     */
    extraActions?: readonly string[];
    /** controllers this resource gates, for the P7 coverage audit */
    controllers: readonly string[];
};
/**
 * Domain verbs → labels. An extra action with no entry here fails the registry test:
 * an unlabelled toggle in the roles editor is a checkbox nobody can reason about.
 */
export declare const EXTRA_ACTION_LABELS: Record<string, {
    ar: string;
    en: string;
}>;
export declare const RBAC_RESOURCES: readonly [{
    readonly key: "patients";
    readonly kind: "record";
    readonly group: "clinical";
    readonly labelAr: "الأطفال";
    readonly labelEn: "Patients";
    readonly scopes: readonly [];
    readonly extraActions: readonly ["view_medical_history", "transfer_ownership", "merge", "export"];
    readonly controllers: readonly ["patients"];
}, {
    /**
     * [D6] نشر نتائج التحاليل والأشعة لوليّ أمر الطفل.
     *
     * موردٌ مستقلّ لا فعلٌ داخل `patients`: قراءة نتيجة داخل الأكاديمية شيء، وإطلاقها
     * إلى وليّ أمرٍ يقرؤها بلا مدرّب بجانبه شيء آخر — والثاني قرارٌ سريري لا يُمنح لكل
     * من يرى النتيجة. فصلُه يجعل الأكاديمية قادرة على منحه للأطبّاء وحدهم.
     */
    readonly key: "results_release";
    readonly kind: "tool";
    readonly group: "clinical";
    readonly labelAr: "نشر النتائج للوليّ أمر";
    readonly labelEn: "Release results to owner";
    readonly scopes: readonly [];
    readonly extraActions: readonly [];
    readonly controllers: readonly ["results-release"];
}, {
    readonly key: "owners";
    readonly kind: "record";
    readonly group: "clinical";
    readonly labelAr: "أولياء الأمور";
    readonly labelEn: "Owners";
    readonly scopes: readonly [];
    readonly extraActions: readonly ["view_contact", "disable", "export"];
    readonly controllers: readonly ["owners"];
}, {
    readonly key: "appointments";
    readonly kind: "record";
    readonly group: "clinical";
    readonly labelAr: "الجلسات";
    readonly labelEn: "Appointments";
    readonly scopes: readonly ["BRANCH", "OWN"];
    readonly extraActions: readonly ["send_reminders", "reschedule", "cancel", "check_in", "complete", "view_internal_notes"];
    readonly controllers: readonly ["appointments", "clinical-exams", "invoices"];
}, {
    readonly key: "vital_signs";
    readonly kind: "record";
    readonly group: "clinical";
    readonly labelAr: "العلامات الحيوية";
    readonly labelEn: "Vital Signs";
    readonly scopes: readonly ["BRANCH"];
    readonly controllers: readonly ["vital-signs"];
}, {
    /**
     * [S2] السجل الطبي SOAP — الملاحظة السريرية وقوالبها.
     *
     * موردٌ مستقلّ لا فعلٌ داخل `appointments`: الملاحظة تعيش بلا زيارة أصلًا
     * (القرار §11-A)، ومن يجدول الجلسات ليس بالضرورة من يكتب في السجل الطبي.
     *
     * `scopes: []` لا `["BRANCH"]`: تعليق `RbacResource.scopes` صريح في أنّ كل
     * نطاق مُعلَن يلزمه مُرشِّح حقيقي في الـDAO، وأنّ نطاقًا غير مُنفَّذ أسوأ من
     * غيابه — لأنّه يَعِد المحرّر بقيدٍ لا وجود له. يُضاف حين يُضاف المُرشِّح.
     */
    readonly key: "clinical_notes";
    readonly kind: "record";
    readonly group: "clinical";
    readonly labelAr: "السجل الطبي (SOAP)";
    readonly labelEn: "Clinical notes (SOAP)";
    readonly scopes: readonly [];
    readonly extraActions: readonly ["finalize", "amend"];
    readonly controllers: readonly ["clinical-notes"];
}, {
    readonly key: "vaccinations";
    readonly kind: "record";
    readonly group: "clinical";
    readonly labelAr: "التطعيمات";
    readonly labelEn: "Vaccinations";
    readonly scopes: readonly ["BRANCH"];
    readonly extraActions: readonly ["administer", "issue_certificate"];
    readonly controllers: readonly ["vaccinations"];
}, {
    readonly key: "lab_tests";
    readonly kind: "record";
    readonly group: "clinical";
    readonly labelAr: "التحاليل المخبرية";
    readonly labelEn: "Lab Tests";
    readonly scopes: readonly ["BRANCH"];
    readonly extraActions: readonly ["order", "collect_sample", "enter_results", "verify_results"];
    readonly controllers: readonly ["lab-tests"];
}, {
    readonly key: "radiology";
    readonly kind: "record";
    readonly group: "clinical";
    readonly labelAr: "الأشعة";
    readonly labelEn: "Radiology";
    readonly scopes: readonly ["BRANCH"];
    readonly extraActions: readonly ["order", "perform", "report", "addendum"];
    readonly controllers: readonly ["radiology"];
}, {
    readonly key: "operations";
    readonly kind: "record";
    readonly group: "clinical";
    readonly labelAr: "العمليات";
    readonly labelEn: "Operations";
    readonly scopes: readonly ["BRANCH"];
    readonly extraActions: readonly ["schedule", "manage_team", "complete"];
    readonly controllers: readonly ["operations"];
}, {
    readonly key: "patient_consents";
    readonly kind: "record";
    readonly group: "clinical";
    readonly labelAr: "الموافقات";
    readonly labelEn: "Patient Consents";
    readonly scopes: readonly [];
    readonly extraActions: readonly ["witness", "revoke"];
    readonly controllers: readonly ["patient-consents"];
}, {
    readonly key: "nutrition";
    readonly kind: "record";
    readonly group: "clinical";
    readonly labelAr: "التغذية";
    readonly labelEn: "Nutrition";
    readonly scopes: readonly [];
    readonly controllers: readonly ["nutrition"];
}, {
    readonly key: "care_plans";
    readonly kind: "record";
    readonly group: "clinical";
    readonly labelAr: "خطط الرعاية";
    readonly labelEn: "Care Plans";
    readonly scopes: readonly [];
    readonly extraActions: readonly ["activate", "close"];
    readonly controllers: readonly ["care-plans"];
}, {
    readonly key: "grooming";
    readonly kind: "record";
    readonly group: "clinical";
    readonly labelAr: "التجميل";
    readonly labelEn: "Grooming";
    readonly scopes: readonly ["BRANCH", "OWN"];
    readonly extraActions: readonly ["check_in", "complete", "override_gate"];
    readonly controllers: readonly ["grooming"];
}, {
    /**
     * [IP0] التنويم — إقامة الطفل في العنبر.
     *
     * `BRANCH` وحده بلا `OWN`: العنبر يُدار بالورديّة لا بالمدرّب المعالج —
     * ممرّض المناوبة الليلية يُعطي جرعات أطفال كل الأطبّاء، وحصرُ رؤيته في
     * «مرضاه» يترك نصف العنبر بلا من يتابعه. والفرع قيدٌ حقيقيّ منفَّذ في
     * الـDAO (`branchWhere`).
     */
    readonly key: "inpatients";
    readonly kind: "record";
    readonly group: "clinical";
    readonly labelAr: "التنويم";
    readonly labelEn: "Inpatients";
    readonly scopes: readonly ["BRANCH"];
    readonly extraActions: readonly ["admit", "discharge", "administer"];
    readonly controllers: readonly ["inpatients"];
}, {
    /**
     * [E0] الطوارئ والفرز — الوصول إلى الباب، وتصنيف اللون.
     *
     * `BRANCH` وحده: الطوارئ حدثٌ في مكان، لا في عهدة مدرّب. ومن يقف على باب
     * فرعٍ يحتاج أن يرى كل من في صالته، لا «مرضاه» — الفرزُ نفسه هو ما يقرّر
     * لاحقًا من يعالجه، فحصرُ الرؤية بـ`OWN` قبل ذلك حصرٌ قبل أن يوجد وليّ أمر.
     *
     * `triage` فعلٌ مستقلّ لا `update`، وهذا الفصل هو بيت القصيد: موظّف
     * الاستقبال يجب أن يفتح سجلّ وصول (`create`) في الثانية التي يدخل فيها
     * طفلٌ ينزف — ويجب ألّا يملك أن يقول إنّه «أخضر». تصنيفُ اللون حكمٌ
     * سريريّ بيد من فحص الطفل، ودمجُه في `update` يمنح كل من يعدّل حقلًا
     * سلطةَ ترتيب من يعيش أوّلًا.
     */
    readonly key: "emergency";
    readonly kind: "record";
    readonly group: "clinical";
    readonly labelAr: "الطوارئ والفرز";
    readonly labelEn: "Emergency & Triage";
    readonly scopes: readonly ["BRANCH"];
    /**
     * `triage` حكمُ ممرّض عند الباب؛ `dispose` قرارُ مدرّب في نهاية الحلقة (خروج،
     * إدخال، جراحة، نفوق). فعلان لشخصين، ودمجُهما في `update` كان سيسمح لمن يرتّب
     * الطابور أن يقرّر مآل الطفل.
     */
    readonly extraActions: readonly ["triage", "dispose"];
    readonly controllers: readonly ["emergency"];
}, {
    readonly key: "mobile_clinics";
    readonly kind: "record";
    readonly group: "clinical";
    readonly labelAr: "الأكاديميات المتنقلة";
    readonly labelEn: "Mobile Clinics";
    readonly scopes: readonly ["BRANCH"];
    readonly extraActions: readonly ["dispatch", "manage_devices", "track", "close_visit"];
    readonly controllers: readonly ["mobile-app", "mobile-fleet", "mobile-reports", "mobile-requests", "mobile-services", "mobile-tracking", "mobile-units", "mobile-visits"];
}, {
    readonly key: "video_calls";
    readonly kind: "record";
    readonly group: "clinical";
    readonly labelAr: "الزيارات المرئية";
    readonly labelEn: "Video Calls";
    readonly scopes: readonly ["OWN"];
    readonly extraActions: readonly ["join", "admit_guest"];
    readonly controllers: readonly ["video-calls"];
}, {
    readonly key: "animal_types";
    readonly kind: "master";
    readonly group: "clinical";
    readonly labelAr: "أنواع الأطفال والسلالات";
    readonly labelEn: "Animal Types & Strains";
    readonly scopes: readonly [];
    readonly controllers: readonly ["animal-types", "animal-strains"];
}, {
    readonly key: "drug_catalog";
    readonly kind: "master";
    readonly group: "clinical";
    readonly labelAr: "دليل الأدوية";
    readonly labelEn: "Drug Catalog";
    readonly scopes: readonly [];
    readonly extraActions: readonly ["manage_controlled"];
    readonly controllers: readonly ["drug-catalog"];
}, {
    readonly key: "protocols";
    readonly kind: "master";
    readonly group: "clinical";
    readonly labelAr: "البروتوكولات";
    readonly labelEn: "Protocols";
    readonly scopes: readonly [];
    readonly controllers: readonly ["protocols"];
}, {
    readonly key: "lab_test_parameters";
    readonly kind: "master";
    readonly group: "clinical";
    readonly labelAr: "معايير التحاليل";
    readonly labelEn: "Lab Test Parameters";
    readonly scopes: readonly [];
    readonly controllers: readonly ["lab-test-parameters"];
}, {
    readonly key: "radiology_exams";
    readonly kind: "master";
    readonly group: "clinical";
    readonly labelAr: "أنواع فحوص الأشعة";
    readonly labelEn: "Radiology Exam Types";
    readonly scopes: readonly [];
    readonly controllers: readonly ["radiology-exams"];
}, {
    readonly key: "operation_procedures";
    readonly kind: "master";
    readonly group: "clinical";
    readonly labelAr: "إجراءات العمليات";
    readonly labelEn: "Operation Procedures";
    readonly scopes: readonly [];
    readonly controllers: readonly ["operation-procedures"];
}, {
    readonly key: "grooming_definitions";
    readonly kind: "master";
    readonly group: "clinical";
    readonly labelAr: "تعريفات التجميل";
    readonly labelEn: "Grooming Definitions";
    readonly scopes: readonly [];
    readonly controllers: readonly ["grooming-definitions"];
}, {
    readonly key: "invoices";
    readonly kind: "record";
    readonly group: "finance";
    readonly labelAr: "الفواتير";
    readonly labelEn: "Invoices";
    readonly scopes: readonly [];
    readonly extraActions: readonly ["refund", "issue", "void", "apply_discount", "collect_payment", "export"];
    readonly controllers: readonly ["invoices-finance"];
}, {
    readonly key: "expenses";
    readonly kind: "record";
    readonly group: "finance";
    readonly labelAr: "المصروفات";
    readonly labelEn: "Expenses";
    readonly scopes: readonly ["BRANCH", "OWN"];
    readonly extraActions: readonly ["approve", "export"];
    readonly controllers: readonly ["expenses"];
}, {
    readonly key: "discounts";
    readonly kind: "record";
    readonly group: "finance";
    readonly labelAr: "الخصومات";
    readonly labelEn: "Discounts";
    readonly scopes: readonly [];
    readonly extraActions: readonly ["approve"];
    readonly controllers: readonly ["discounts"];
}, {
    readonly key: "purchasing";
    readonly kind: "record";
    readonly group: "finance";
    readonly labelAr: "المشتريات";
    readonly labelEn: "Purchasing";
    readonly scopes: readonly [];
    readonly extraActions: readonly ["approve", "receive", "export"];
    readonly controllers: readonly ["purchasing"];
}, {
    readonly key: "suppliers";
    readonly kind: "master";
    readonly group: "finance";
    readonly labelAr: "المورّدون";
    readonly labelEn: "Suppliers";
    readonly scopes: readonly [];
    readonly controllers: readonly ["suppliers"];
}, {
    readonly key: "pos_sales";
    readonly kind: "record";
    readonly group: "finance";
    readonly labelAr: "نقاط البيع";
    readonly labelEn: "Point of Sale";
    readonly scopes: readonly ["OWN"];
    readonly extraActions: readonly ["refund", "open_shift", "close_shift", "void", "apply_discount"];
    readonly controllers: readonly ["sales"];
}, {
    readonly key: "reports";
    readonly kind: "report";
    readonly group: "finance";
    readonly labelAr: "التقارير";
    readonly labelEn: "Reports";
    readonly scopes: readonly [];
    readonly controllers: readonly ["reports"];
}, {
    readonly key: "inventory";
    readonly kind: "record";
    readonly group: "inventory";
    readonly labelAr: "المخزون";
    readonly labelEn: "Inventory";
    readonly scopes: readonly [];
    readonly extraActions: readonly ["view_cost", "export"];
    readonly controllers: readonly ["inventory"];
}, {
    readonly key: "stock";
    readonly kind: "record";
    readonly group: "inventory";
    readonly labelAr: "حركات المخزون";
    readonly labelEn: "Stock Movements";
    readonly scopes: readonly [];
    readonly extraActions: readonly ["adjust", "transfer", "count", "receive", "issue_out", "write_off"];
    readonly controllers: readonly ["stock"];
}, {
    readonly key: "product_comments";
    readonly kind: "record";
    readonly group: "inventory";
    readonly labelAr: "ملاحظات الأصناف";
    readonly labelEn: "Product Comments";
    readonly scopes: readonly ["OWN"];
    readonly controllers: readonly ["product-comments"];
}, {
    readonly key: "staff";
    readonly kind: "record";
    readonly group: "hr";
    readonly labelAr: "الموظفون";
    readonly labelEn: "Staff";
    readonly scopes: readonly ["BRANCH", "OWN"];
    readonly extraActions: readonly ["invite", "view_contact", "view_documents", "terminate", "export"];
    readonly controllers: readonly ["staff", "staff-documents", "staff-services", "staff-consultation-types", "staff-scheduling"];
}, {
    readonly key: "staff_compensation";
    readonly kind: "record";
    readonly group: "hr";
    readonly labelAr: "أجور الموظفين";
    readonly labelEn: "Staff Compensation";
    readonly scopes: readonly ["OWN"];
    readonly extraActions: readonly ["approve", "export"];
    readonly controllers: readonly ["staff-compensation"];
}, {
    readonly key: "payroll";
    readonly kind: "record";
    readonly group: "hr";
    readonly labelAr: "الرواتب";
    readonly labelEn: "Payroll";
    readonly scopes: readonly [];
    readonly extraActions: readonly ["approve", "run", "disburse", "export"];
    readonly controllers: readonly ["payroll"];
}, {
    readonly key: "attendance";
    readonly kind: "record";
    readonly group: "hr";
    readonly labelAr: "الحضور والانصراف";
    readonly labelEn: "Attendance";
    readonly scopes: readonly ["OWN"];
    readonly extraActions: readonly ["manual_entry", "export"];
    readonly controllers: readonly ["attendance"];
}, {
    readonly key: "leave_requests";
    readonly kind: "record";
    readonly group: "hr";
    readonly labelAr: "طلبات الإجازات";
    readonly labelEn: "Leave Requests";
    readonly scopes: readonly ["OWN"];
    readonly extraActions: readonly ["approve", "cancel"];
    readonly controllers: readonly ["leave-requests"];
}, {
    readonly key: "compensatory";
    readonly kind: "record";
    readonly group: "hr";
    readonly labelAr: "البدلات التعويضية";
    readonly labelEn: "Compensatory Entries";
    readonly scopes: readonly ["OWN"];
    readonly extraActions: readonly ["approve"];
    readonly controllers: readonly ["compensatory"];
}, {
    readonly key: "end_of_service";
    readonly kind: "record";
    readonly group: "hr";
    readonly labelAr: "نهاية الدورة";
    readonly labelEn: "End of Service";
    readonly scopes: readonly [];
    readonly extraActions: readonly ["approve", "calculate", "disburse"];
    readonly controllers: readonly ["end-of-service"];
}, {
    readonly key: "shifts";
    readonly kind: "record";
    readonly group: "hr";
    readonly labelAr: "الورديات";
    readonly labelEn: "Shifts";
    readonly scopes: readonly [];
    readonly extraActions: readonly ["publish", "assign"];
    readonly controllers: readonly ["shifts", "scheduling"];
}, {
    readonly key: "leave_types";
    readonly kind: "master";
    readonly group: "hr";
    readonly labelAr: "أنواع الإجازات";
    readonly labelEn: "Leave Types";
    readonly scopes: readonly [];
    readonly controllers: readonly ["leave-types"];
}, {
    readonly key: "specializations";
    readonly kind: "master";
    readonly group: "hr";
    readonly labelAr: "التخصصات";
    readonly labelEn: "Specializations";
    readonly scopes: readonly [];
    readonly controllers: readonly ["specializations", "specialization-categories", "specialization-subcategories"];
}, {
    readonly key: "training";
    readonly kind: "record";
    readonly group: "hr";
    readonly labelAr: "التدريب والدورات";
    readonly labelEn: "Training & Courses";
    readonly scopes: readonly ["OWN"];
    readonly extraActions: readonly ["assign", "publish", "issue_certificate"];
    readonly controllers: readonly ["training", "course-assignments"];
}, {
    readonly key: "quizzes";
    readonly kind: "record";
    readonly group: "hr";
    readonly labelAr: "الاختبارات";
    readonly labelEn: "Quizzes";
    readonly scopes: readonly ["OWN"];
    readonly extraActions: readonly ["assign", "grade", "publish", "view_results"];
    readonly controllers: readonly ["quizzes", "quiz-assignments", "quiz-attempts"];
}, {
    readonly key: "sops";
    readonly kind: "record";
    readonly group: "hr";
    readonly labelAr: "إجراءات التشغيل القياسية";
    readonly labelEn: "SOPs";
    readonly scopes: readonly [];
    readonly extraActions: readonly ["publish", "acknowledge"];
    readonly controllers: readonly ["sops"];
}, {
    readonly key: "tasks";
    readonly kind: "record";
    readonly group: "operations";
    readonly labelAr: "المهام";
    readonly labelEn: "Tasks";
    readonly scopes: readonly ["OWN"];
    readonly extraActions: readonly ["assign", "complete", "comment"];
    readonly controllers: readonly ["tasks"];
}, {
    readonly key: "chat";
    readonly kind: "record";
    readonly group: "operations";
    readonly labelAr: "المحادثات";
    readonly labelEn: "Chat";
    readonly scopes: readonly ["OWN"];
    readonly controllers: readonly ["chat"];
}, {
    readonly key: "inbox";
    readonly kind: "record";
    readonly group: "operations";
    readonly labelAr: "الوارد";
    readonly labelEn: "Inbox";
    readonly scopes: readonly ["OWN"];
    readonly controllers: readonly ["inbox", "inbox-settings"];
}, {
    readonly key: "notifications";
    readonly kind: "record";
    readonly group: "operations";
    readonly labelAr: "الإشعارات";
    readonly labelEn: "Notifications";
    readonly scopes: readonly ["OWN"];
    readonly extraActions: readonly ["broadcast"];
    readonly controllers: readonly ["notifications"];
}, {
    /**
     * [RC0] التذكيرات والاستدعاء — قواعد التذكير، الصندوق الصادر، طاولة
     * الاستدعاء، والمُجدوِل.
     *
     * `scopes: []` — الاستدعاء عمل **أكاديمية** لا فرع: وليّ الأمر يتعامل مع الأكاديمية،
     * وقائمةٌ مقصورة على فرعٍ تعني وليّ أمرًا يُكلَّم مرّتين لأن كلبه الأوّل زار
     * فرعًا وكلبه الثاني فرعًا آخر. وهذا نقضٌ لسبب وجود الشاشة أصلًا.
     *
     * وفعلان إضافيّان لا واحد، والفصل بينهما هو بيت القصيد في هذه الوحدة:
     *
     *  - `send_reminders` — تحرير القالب شيء، وإطلاقُ دفعة رسائل إلى أولياء أمور
     *    حقيقيّين شيء آخر. الأوّل يُراجَع ويُصحَّح، والثاني **لا يُسترجَع**:
     *    رسالةٌ خرجت لا تُستعاد. ولذلك لا يرثه `update`.
     *    (المفتاح نفسه مستعمل في `appointments` منذ ما قبل هذه الوحدة، وهو
     *    الاصطلاح القائم لـ«أرسِل إلى وليّ أمر».)
     *
     *  - `run` — تشغيل المُجدوِل نفسه (`/scheduler/run-now`, `requeue`). فعلُ
     *    تشغيلٍ لبنيةٍ تحتية، أقرب إلى «شغّل الترحيل» منه إلى «أرسِل رسالة»،
     *    ويناسب مسؤول النظام لا موظّف الاستقبال. وهو يأتي من `kind: "tool"`
     *    ضمنًا لو كانت الوحدة أداةً خالصة — لكنها ليست كذلك: لها قواعد تُنشأ
     *    وتُحرَّر وتُحذف، فهي `record` بفعلٍ إضافيّ.
     */
    readonly key: "reminders";
    readonly kind: "record";
    readonly group: "operations";
    readonly labelAr: "التذكيرات والاستدعاء";
    readonly labelEn: "Reminders & Recall";
    readonly scopes: readonly [];
    readonly extraActions: readonly ["send_reminders", "run"];
    readonly controllers: readonly ["reminders", "scheduler"];
}, {
    readonly key: "documents";
    readonly kind: "record";
    readonly group: "operations";
    readonly labelAr: "مستندات الأكاديمية";
    readonly labelEn: "Clinic Documents";
    readonly scopes: readonly ["BRANCH"];
    readonly controllers: readonly ["clinic-documents"];
}, {
    readonly key: "dashboard";
    readonly kind: "report";
    readonly group: "operations";
    readonly labelAr: "لوحة المعلومات";
    readonly labelEn: "Dashboard";
    readonly scopes: readonly [];
    readonly controllers: readonly ["dashboard"];
}, {
    readonly key: "uploads";
    readonly kind: "tool";
    readonly group: "operations";
    readonly labelAr: "رفع الملفات";
    readonly labelEn: "Uploads";
    readonly scopes: readonly [];
    readonly controllers: readonly ["uploads"];
}, {
    readonly key: "kiosk";
    readonly kind: "tool";
    readonly group: "operations";
    readonly labelAr: "شاشة الاستقبال";
    readonly labelEn: "Kiosk";
    readonly scopes: readonly [];
    readonly controllers: readonly ["kiosk"];
}, {
    readonly key: "public_bookings";
    readonly kind: "record";
    readonly group: "operations";
    readonly labelAr: "الحجوزات العامّة";
    readonly labelEn: "Public Bookings";
    readonly scopes: readonly [];
    readonly extraActions: readonly ["approve", "reject"];
    readonly controllers: readonly ["public-bookings", "public"];
}, {
    readonly key: "services";
    readonly kind: "master";
    readonly group: "operations";
    readonly labelAr: "الدورات";
    readonly labelEn: "Services";
    readonly scopes: readonly [];
    readonly extraActions: readonly ["manage_pricing"];
    readonly controllers: readonly ["services", "categories", "subcategories"];
}, {
    readonly key: "consultation_types";
    readonly kind: "master";
    readonly group: "operations";
    readonly labelAr: "أنواع الاستشارات";
    readonly labelEn: "Consultation Types";
    readonly scopes: readonly [];
    readonly controllers: readonly ["consultation-types"];
}, {
    readonly key: "branches";
    readonly kind: "master";
    readonly group: "operations";
    readonly labelAr: "الفروع والقاعات";
    readonly labelEn: "Branches & Rooms";
    readonly scopes: readonly [];
    readonly extraActions: readonly ["manage_rooms"];
    readonly controllers: readonly ["branches", "rooms"];
}, {
    readonly key: "rbac";
    readonly kind: "record";
    readonly group: "admin";
    readonly labelAr: "الأدوار والصلاحيات";
    readonly labelEn: "Roles & Permissions";
    readonly scopes: readonly [];
    readonly extraActions: readonly ["assign", "view_audit"];
    readonly controllers: readonly ["staff-roles"];
}, {
    readonly key: "settings";
    readonly kind: "settings";
    readonly group: "admin";
    readonly labelAr: "إعدادات الأكاديمية";
    readonly labelEn: "Clinic Settings";
    readonly scopes: readonly [];
    readonly extraActions: readonly ["manage_integrations", "manage_billing"];
    readonly controllers: readonly ["settings"];
}, {
    readonly key: "users";
    readonly kind: "record";
    readonly group: "admin";
    readonly labelAr: "المستخدمون";
    readonly labelEn: "Users";
    readonly scopes: readonly [];
    readonly extraActions: readonly ["impersonate"];
    readonly controllers: readonly ["users"];
}, {
    readonly key: "invites";
    readonly kind: "record";
    readonly group: "admin";
    readonly labelAr: "الدعوات";
    readonly labelEn: "Invites";
    readonly scopes: readonly [];
    readonly extraActions: readonly ["revoke"];
    readonly controllers: readonly ["invites"];
}, {
    readonly key: "onboarding";
    readonly kind: "tool";
    readonly group: "admin";
    readonly labelAr: "التهيئة الأولى";
    readonly labelEn: "Onboarding";
    readonly scopes: readonly [];
    readonly controllers: readonly ["onboarding"];
}, {
    readonly key: "agent";
    readonly kind: "tool";
    readonly group: "admin";
    readonly labelAr: "المساعد الذكي";
    readonly labelEn: "AI Agent";
    readonly scopes: readonly [];
    readonly extraActions: readonly ["configure"];
    readonly controllers: readonly ["agent"];
}, {
    readonly key: "audit_log";
    readonly kind: "report";
    readonly group: "admin";
    readonly labelAr: "سجلّ التدقيق";
    readonly labelEn: "Audit Log";
    readonly scopes: readonly [];
    readonly controllers: readonly [];
}];
export type RbacResourceKey = (typeof RBAC_RESOURCES)[number]["key"];
export declare function findResource(key: string): RbacResource | undefined;
/** `{resource}.{action}` — the ONLY place a permission slug is constructed. */
export declare function permissionKey(resource: string, action: string): string;
/** Every action a resource grants: its kind's defaults plus its declared domain verbs. */
export declare function actionsFor(resource: RbacResource): readonly string[];
/**
 * Whether a resource supports an action at all. Checked BEFORE a permission lookup, but
 * always AFTER the super-admin bypass — registering a runnable tool under a kind that has
 * no `run` is what made both P12A marquee endpoints 403 for *everyone*, admins included.
 */
export declare function resourceSupportsAction(resourceKey: string, action: string): boolean;
/** Whether a grant on this resource may be narrowed to the given scope. */
export declare function resourceSupportsScope(resourceKey: string, scope: PermissionScope): boolean;
/** The full generated catalogue — what the `permission` table is synced from. */
export type RbacPermissionEntry = {
    key: string;
    resource: string;
    action: string;
    group: RbacGroup;
    labelAr: string;
    labelEn: string;
    scopes: readonly PermissionScope[];
};
export declare const ACTION_LABELS: Record<RbacAction, {
    ar: string;
    en: string;
}>;
export declare const ALL_RBAC_PERMISSIONS: RbacPermissionEntry[];
export declare const ALL_RBAC_PERMISSION_KEYS: string[];
