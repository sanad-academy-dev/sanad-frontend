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

// ── actions ────────────────────────────────────────────────────────────────────────────

/**
 * The action vocabulary. Deliberately small — a domain-specific verb belongs in a
 * resource's `extraActions`, not here, so the common four stay comparable across modules.
 */
export const RBAC_ACTIONS = [
	"read",
	"create",
	"update",
	"delete",
	"export",
	"approve",
	"run",
] as const;

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

export const ACTIONS_BY_KIND = {
	record: ["read", "create", "update", "delete"],
	master: ["read", "create", "update", "delete"],
	report: ["read", "export"],
	settings: ["read", "update"],
	tool: ["read", "run"],
} as const satisfies Record<RbacResourceKind, readonly RbacAction[]>;

// ── scopes ─────────────────────────────────────────────────────────────────────────────

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
export const PERMISSION_SCOPES = ["ALL", "BRANCH", "OWN"] as const;
export type PermissionScope = (typeof PERMISSION_SCOPES)[number];

/** Ordered widest → narrowest, for "is this grant at least as wide as required?" checks. */
export const SCOPE_WIDTH: Record<PermissionScope, number> = { ALL: 3, BRANCH: 2, OWN: 1 };

// ── groups (the roles editor's sections) ───────────────────────────────────────────────

export const RBAC_GROUPS = [
	"clinical",
	"finance",
	"accounting",
	"hr",
	"inventory",
	"operations",
	"admin",
] as const;

export type RbacGroup = (typeof RBAC_GROUPS)[number];

export const GROUP_LABELS: Record<RbacGroup, { ar: string; en: string }> = {
	clinical: { ar: "الرعاية الطبية", en: "Clinical" },
	finance: { ar: "المالية", en: "Finance" },
	accounting: { ar: "المحاسبة", en: "Accounting" },
	hr: { ar: "الموارد البشرية", en: "Human Resources" },
	inventory: { ar: "المخزون", en: "Inventory" },
	operations: { ar: "التشغيل", en: "Operations" },
	admin: { ar: "إدارة النظام", en: "Administration" },
};

// ── the registry ───────────────────────────────────────────────────────────────────────

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
export const EXTRA_ACTION_LABELS: Record<string, { ar: string; en: string }> = {
	// ── عامّة ────────────────────────────────────────────────────────────────────────
	assign: { ar: "إسناد", en: "Assign" },
	invite: { ar: "دعوة", en: "Invite" },
	cancel: { ar: "إلغاء", en: "Cancel" },
	reschedule: { ar: "إعادة جدولة", en: "Reschedule" },
	publish: { ar: "نشر", en: "Publish" },
	revoke: { ar: "إبطال", en: "Revoke" },
	disable: { ar: "تعطيل", en: "Disable" },
	complete: { ar: "إنهاء", en: "Complete" },
	check_in: { ar: "تسجيل وصول", en: "Check in" },
	comment: { ar: "التعليق على", en: "Comment on" },
	merge: { ar: "دمج", en: "Merge" },
	schedule: { ar: "جدولة", en: "Schedule" },
	activate: { ar: "تفعيل", en: "Activate" },
	close: { ar: "إقفال", en: "Close" },
	reject: { ar: "رفض", en: "Reject" },
	acknowledge: { ar: "الإقرار باطّلاع على", en: "Acknowledge" },

	// ── سريرية ───────────────────────────────────────────────────────────────────────
	// السجلّ الطبي يُقرأ بإذنٍ مستقلّ عن قراءة ملفّ الطفل: موظّف الاستقبال يحتاج الاسم
	// والهاتف، ولا شأن له بالتاريخ المرضي.
	view_medical_history: { ar: "عرض السجل الطبي لـ", en: "View medical history of" },
	transfer_ownership: { ar: "نقل ملكية", en: "Transfer ownership of" },
	view_contact: { ar: "عرض بيانات التواصل لـ", en: "View contact details of" },
	view_internal_notes: { ar: "عرض الملاحظات الداخلية لـ", en: "View internal notes of" },
	administer: { ar: "إعطاء", en: "Administer" },
	issue_certificate: { ar: "إصدار شهادة", en: "Issue certificate for" },
	order: { ar: "طلب", en: "Order" },
	collect_sample: { ar: "سحب عيّنة", en: "Collect sample for" },
	// إدخال النتيجة غير اعتمادها: الفنّي يُدخل، والمدرّب المخوّل يعتمد فتصير رسمية.
	enter_results: { ar: "إدخال نتائج", en: "Enter results for" },
	verify_results: { ar: "اعتماد نتائج", en: "Verify results for" },
	perform: { ar: "تنفيذ", en: "Perform" },
	report: { ar: "كتابة تقرير", en: "Report on" },
	addendum: { ar: "إضافة ملحق لتقرير", en: "Add addendum to" },
	// [S2] التوثيق ليس حفظًا: يُجمّد النصّ ويُغلق باب التعديل، فهو فعلٌ مستقلّ
	// عن `update` لا حالةٌ منه — ولذلك يملكه المدرّب وحده (القرار §11-E).
	finalize: { ar: "توثيق وإقفال", en: "Finalize" },
	// والتصحيح بعد الإقفال يُلحَق ولا يُكتب فوقه، فهو أيضًا ليس `update`.
	amend: { ar: "تصحيح بمُلحَق", en: "Amend" },
	manage_team: { ar: "إدارة فريق", en: "Manage team of" },
	witness: { ar: "الشهادة على", en: "Witness" },
	// [التجميل] تجاوز بوابة أمان مسجَّلة — فعل استثنائي يُمنح بحساب، وثلاث بوابات
	// لا تُتجاوز به أصلًا (G5 التجفيف، G6 أمر المدرّب، G10 الحادثة المفتوحة).
	override_gate: { ar: "تجاوز بوابات أمان", en: "Override safety gate for" },
	manage_controlled: { ar: "إدارة المواد المُراقَبة في", en: "Manage controlled substances in" },
	// [التنويم] الإدخال والإخراج والإعطاء أفعالٌ ثلاثة لا فعلٌ واحد:
	// من يُدخل طفلًا العنبر (استقبال/مدرّب) غير من يُقرّر خروجه (مدرّب)، وغير من
	// يُعطي الجرعة على القفص (ممرّض). دمجُها في `update` يعني أنّ كل من يعدّل درجة
	// حرجية يستطيع إخراج طفل وإعطاء دواء.
	admit: { ar: "إدخال إلى التنويم", en: "Admit to inpatients" },
	discharge: { ar: "إخراج من التنويم", en: "Discharge from inpatients" },
	// [الطوارئ] تصنيف لون الفرز — حكمٌ سريريّ لا تعديل حقل. موظّف الاستقبال يفتح
	// سجلّ الوصول (`create`) ولا يملك أن يقول إنّ الحالة «خضراء»؛ فمن يرتّب من يُرى
	// أوّلًا هو من فحص الطفل. ولهذا هو فعلٌ مستقلّ لا يرثه `update`.
	triage: { ar: "فرز حالات", en: "Triage" },
	dispose: { ar: "قرار مآل الحالة", en: "Dispose" },
	join: { ar: "الانضمام إلى", en: "Join" },
	admit_guest: { ar: "قبول ضيف في", en: "Admit guest to" },
	track: { ar: "تتبّع", en: "Track" },
	close_visit: { ar: "إقفال زيارة", en: "Close visit of" },
	dispatch: { ar: "توجيه", en: "Dispatch" },
	// إصدار رمز مركبة أو إبطاله فعلٌ أمني يعادل تسليم مفتاح.
	manage_devices: { ar: "إدارة أجهزة", en: "Manage devices of" },
	send_reminders: { ar: "إرسال تذكيرات", en: "Send reminders for" },

	// ── مالية ────────────────────────────────────────────────────────────────────────
	// الردّ والإلغاء يعكسان قيدًا مُرحَّلًا في دفتر الأستاذ — لا يرثهما من يرى الفواتير.
	refund: { ar: "استرجاع", en: "Refund" },
	issue: { ar: "إصدار", en: "Issue" },
	void: { ar: "إبطال", en: "Void" },
	// تجاوز حدّ الخصم بابُ تسريبٍ للإيراد، فيُفصل عن التعديل عمدًا.
	apply_discount: { ar: "منح خصم على", en: "Apply discount on" },
	collect_payment: { ar: "تحصيل دفعة على", en: "Collect payment on" },
	receive: { ar: "استلام", en: "Receive" },
	open_shift: { ar: "فتح وردية", en: "Open shift for" },
	close_shift: { ar: "إقفال وردية", en: "Close shift for" },

	// ── مخزون ────────────────────────────────────────────────────────────────────────
	// سعر التكلفة رقمٌ تفاوضيّ مع المورّد؛ من يصرف الأصناف لا يحتاج رؤيته.
	view_cost: { ar: "عرض التكلفة في", en: "View cost price in" },
	// التسوية والإتلاف يغيّران الكمية بلا مستند بيع أو شراء — بابُ إخفاء عجز.
	adjust: { ar: "تسوية", en: "Adjust" },
	transfer: { ar: "تحويل", en: "Transfer" },
	count: { ar: "جرد", en: "Stocktake" },
	issue_out: { ar: "صرف", en: "Issue out" },
	write_off: { ar: "إتلاف", en: "Write off" },

	// ── موارد بشرية ──────────────────────────────────────────────────────────────────
	view_documents: { ar: "عرض مستندات", en: "View documents of" },
	terminate: { ar: "إنهاء دورة", en: "Terminate" },
	manual_entry: { ar: "التسجيل اليدوي في", en: "Manual entry in" },
	calculate: { ar: "احتساب", en: "Calculate" },
	// الاعتماد قرار، والصرف تنفيذ — فصلهما هو ضبط الازدواج في الرواتب.
	disburse: { ar: "صرف", en: "Disburse" },
	grade: { ar: "تصحيح", en: "Grade" },
	view_results: { ar: "عرض نتائج", en: "View results of" },

	// ── إدارة ────────────────────────────────────────────────────────────────────────
	broadcast: { ar: "بثّ", en: "Broadcast" },
	manage_pricing: { ar: "إدارة أسعار", en: "Manage pricing of" },
	manage_rooms: { ar: "إدارة غرف", en: "Manage rooms of" },
	view_audit: { ar: "عرض سجلّ تدقيق", en: "View audit log of" },
	manage_integrations: { ar: "إدارة تكاملات", en: "Manage integrations in" },
	manage_billing: { ar: "إدارة اشتراك", en: "Manage billing in" },
	configure: { ar: "ضبط", en: "Configure" },
	// انتحال هوية مستخدم أقوى من أي صلاحية أخرى: يمنح حاملَه كلَّ ما يملكه الضحية.
	impersonate: { ar: "انتحال هوية", en: "Impersonate" },
};

export const RBAC_RESOURCES = [
	// ── clinical ───────────────────────────────────────────────────────────────────────
	{
		key: "patients",
		kind: "record",
		group: "clinical",
		labelAr: "الأطفال",
		labelEn: "Patients",
		scopes: [],
		extraActions: ["view_medical_history", "transfer_ownership", "merge", "export"],
		controllers: ["patients"],
	},
	{
		/**
		 * [D6] نشر نتائج التحاليل والأشعة لوليّ أمر الطفل.
		 *
		 * موردٌ مستقلّ لا فعلٌ داخل `patients`: قراءة نتيجة داخل الأكاديمية شيء، وإطلاقها
		 * إلى وليّ أمرٍ يقرؤها بلا مدرّب بجانبه شيء آخر — والثاني قرارٌ سريري لا يُمنح لكل
		 * من يرى النتيجة. فصلُه يجعل الأكاديمية قادرة على منحه للأطبّاء وحدهم.
		 */
		key: "results_release",
		kind: "tool",
		group: "clinical",
		labelAr: "نشر النتائج للوليّ أمر",
		labelEn: "Release results to owner",
		scopes: [],
		extraActions: [],
		controllers: ["results-release"],
	},
	{
		key: "owners",
		kind: "record",
		group: "clinical",
		labelAr: "أولياء الأمور",
		labelEn: "Owners",
		scopes: [],
		extraActions: ["view_contact", "disable", "export"],
		controllers: ["owners"],
	},
	{
		key: "appointments",
		kind: "record",
		group: "clinical",
		labelAr: "الجلسات",
		labelEn: "Appointments",
		scopes: ["BRANCH", "OWN"],
		// إرسال التذكيرات يصل وليّ الأمر خارج النظام — فعل تواصل لا تعديل سجلّ،
		// وإعادة الجدولة والإلغاء يمسّان موعد مدرّب آخر.
		extraActions: [
			"send_reminders",
			"reschedule",
			"cancel",
			"check_in",
			"complete",
			"view_internal_notes",
		],
		controllers: ["appointments", "clinical-exams", "invoices"],
	},
	{
		key: "vital_signs",
		kind: "record",
		group: "clinical",
		labelAr: "العلامات الحيوية",
		labelEn: "Vital Signs",
		scopes: ["BRANCH"],
		controllers: ["vital-signs"],
	},
	{
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
		key: "clinical_notes",
		kind: "record",
		group: "clinical",
		labelAr: "السجل الطبي (SOAP)",
		labelEn: "Clinical notes (SOAP)",
		scopes: [],
		extraActions: ["finalize", "amend"],
		controllers: ["clinical-notes"],
	},
	{
		key: "vaccinations",
		kind: "record",
		group: "clinical",
		labelAr: "التطعيمات",
		labelEn: "Vaccinations",
		scopes: ["BRANCH"],
		extraActions: ["administer", "issue_certificate"],
		controllers: ["vaccinations"],
	},
	{
		key: "lab_tests",
		kind: "record",
		group: "clinical",
		labelAr: "التحاليل المخبرية",
		labelEn: "Lab Tests",
		scopes: ["BRANCH"],
		extraActions: ["order", "collect_sample", "enter_results", "verify_results"],
		controllers: ["lab-tests"],
	},
	{
		key: "radiology",
		kind: "record",
		group: "clinical",
		labelAr: "الأشعة",
		labelEn: "Radiology",
		scopes: ["BRANCH"],
		extraActions: ["order", "perform", "report", "addendum"],
		controllers: ["radiology"],
	},
	{
		key: "operations",
		kind: "record",
		group: "clinical",
		labelAr: "العمليات",
		labelEn: "Operations",
		scopes: ["BRANCH"],
		extraActions: ["schedule", "manage_team", "complete"],
		controllers: ["operations"],
	},
	{
		key: "patient_consents",
		kind: "record",
		group: "clinical",
		labelAr: "الموافقات",
		labelEn: "Patient Consents",
		scopes: [],
		extraActions: ["witness", "revoke"],
		controllers: ["patient-consents"],
	},
	{
		key: "nutrition",
		kind: "record",
		group: "clinical",
		labelAr: "التغذية",
		labelEn: "Nutrition",
		scopes: [],
		controllers: ["nutrition"],
	},
	{
		key: "care_plans",
		kind: "record",
		group: "clinical",
		labelAr: "خطط الرعاية",
		labelEn: "Care Plans",
		scopes: [],
		extraActions: ["activate", "close"],
		controllers: ["care-plans"],
	},
	{
		key: "grooming",
		kind: "record",
		group: "clinical",
		labelAr: "التجميل",
		labelEn: "Grooming",
		scopes: ["BRANCH", "OWN"],
		extraActions: ["check_in", "complete", "override_gate"],
		controllers: ["grooming"],
	},
	{
		/**
		 * [IP0] التنويم — إقامة الطفل في العنبر.
		 *
		 * `BRANCH` وحده بلا `OWN`: العنبر يُدار بالورديّة لا بالمدرّب المعالج —
		 * ممرّض المناوبة الليلية يُعطي جرعات أطفال كل الأطبّاء، وحصرُ رؤيته في
		 * «مرضاه» يترك نصف العنبر بلا من يتابعه. والفرع قيدٌ حقيقيّ منفَّذ في
		 * الـDAO (`branchWhere`).
		 */
		key: "inpatients",
		kind: "record",
		group: "clinical",
		labelAr: "التنويم",
		labelEn: "Inpatients",
		scopes: ["BRANCH"],
		extraActions: ["admit", "discharge", "administer"],
		controllers: ["inpatients"],
	},
	{
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
		key: "emergency",
		kind: "record",
		group: "clinical",
		labelAr: "الطوارئ والفرز",
		labelEn: "Emergency & Triage",
		scopes: ["BRANCH"],
		/**
		 * `triage` حكمُ ممرّض عند الباب؛ `dispose` قرارُ مدرّب في نهاية الحلقة (خروج،
		 * إدخال، جراحة، نفوق). فعلان لشخصين، ودمجُهما في `update` كان سيسمح لمن يرتّب
		 * الطابور أن يقرّر مآل الطفل.
		 */
		extraActions: ["triage", "dispose"],
		controllers: ["emergency"],
	},
	{
		key: "mobile_clinics",
		kind: "record",
		group: "clinical",
		labelAr: "الأكاديميات المتنقلة",
		labelEn: "Mobile Clinics",
		scopes: ["BRANCH"],
		// [MC0.3] الإسناد عملٌ يوميّ لمنسّق الحركة، أمّا إصدار رمز مركبة أو إبطاله ففعل
		// أمني يعادل تسليم مفتاح — لا يصحّ أن يحملهما مفتاح واحد.
		extraActions: ["dispatch", "manage_devices", "track", "close_visit"],
		controllers: [
			"mobile-app",
			"mobile-fleet",
			"mobile-reports",
			"mobile-requests",
			"mobile-services",
			"mobile-tracking",
			"mobile-units",
			"mobile-visits",
		],
	},
	{
		key: "video_calls",
		kind: "record",
		group: "clinical",
		labelAr: "الزيارات المرئية",
		labelEn: "Video Calls",
		scopes: ["OWN"],
		extraActions: ["join", "admit_guest"],
		controllers: ["video-calls"],
	},

	// ── clinical master data ───────────────────────────────────────────────────────────
	{
		key: "animal_types",
		kind: "master",
		group: "clinical",
		labelAr: "أنواع الأطفال والسلالات",
		labelEn: "Animal Types & Strains",
		scopes: [],
		controllers: ["animal-types", "animal-strains"],
	},
	{
		key: "drug_catalog",
		kind: "master",
		group: "clinical",
		labelAr: "دليل الأدوية",
		labelEn: "Drug Catalog",
		scopes: [],
		extraActions: ["manage_controlled"],
		controllers: ["drug-catalog"],
	},
	{
		key: "protocols",
		kind: "master",
		group: "clinical",
		labelAr: "البروتوكولات",
		labelEn: "Protocols",
		scopes: [],
		controllers: ["protocols"],
	},
	{
		key: "lab_test_parameters",
		kind: "master",
		group: "clinical",
		labelAr: "معايير التحاليل",
		labelEn: "Lab Test Parameters",
		scopes: [],
		controllers: ["lab-test-parameters"],
	},
	{
		key: "radiology_exams",
		kind: "master",
		group: "clinical",
		labelAr: "أنواع فحوص الأشعة",
		labelEn: "Radiology Exam Types",
		scopes: [],
		controllers: ["radiology-exams"],
	},
	{
		key: "operation_procedures",
		kind: "master",
		group: "clinical",
		labelAr: "إجراءات العمليات",
		labelEn: "Operation Procedures",
		scopes: [],
		controllers: ["operation-procedures"],
	},
	{
		key: "grooming_definitions",
		kind: "master",
		group: "clinical",
		labelAr: "تعريفات التجميل",
		labelEn: "Grooming Definitions",
		scopes: [],
		controllers: ["grooming-definitions"],
	},

	// ── finance ────────────────────────────────────────────────────────────────────────
	{
		key: "invoices",
		kind: "record",
		group: "finance",
		labelAr: "الفواتير",
		labelEn: "Invoices",
		scopes: [],
		// [P12B.1] الردّ يعكس قيدًا مُرحَّلًا في دفتر الأستاذ عبر محول فواتير الأكاديمية،
		// فلا يصحّ أن يرثه كل من يرى الفواتير.
		extraActions: ["refund", "issue", "void", "apply_discount", "collect_payment", "export"],
		controllers: ["invoices-finance"],
	},
	{
		key: "expenses",
		kind: "record",
		group: "finance",
		labelAr: "المصروفات",
		labelEn: "Expenses",
		scopes: ["BRANCH", "OWN"],
		extraActions: ["approve", "export"],
		controllers: ["expenses"],
	},
	{
		key: "discounts",
		kind: "record",
		group: "finance",
		labelAr: "الخصومات",
		labelEn: "Discounts",
		scopes: [],
		extraActions: ["approve"],
		controllers: ["discounts"],
	},
	{
		key: "purchasing",
		kind: "record",
		group: "finance",
		labelAr: "المشتريات",
		labelEn: "Purchasing",
		scopes: [],
		extraActions: ["approve", "receive", "export"],
		controllers: ["purchasing"],
	},
	{
		key: "suppliers",
		kind: "master",
		group: "finance",
		labelAr: "المورّدون",
		labelEn: "Suppliers",
		scopes: [],
		controllers: ["suppliers"],
	},
	{
		key: "pos_sales",
		kind: "record",
		group: "finance",
		labelAr: "نقاط البيع",
		labelEn: "Point of Sale",
		scopes: ["OWN"],
		// [P12B.2] الإرجاع يعيد الأصناف للمخزون ويجعل البيع قابلًا للعكس محاسبيًا.
		extraActions: ["refund", "open_shift", "close_shift", "void", "apply_discount"],
		controllers: ["sales"],
	},
	{
		key: "reports",
		kind: "report",
		group: "finance",
		labelAr: "التقارير",
		labelEn: "Reports",
		scopes: [],
		controllers: ["reports"],
	},

	// ── inventory ──────────────────────────────────────────────────────────────────────
	{
		key: "inventory",
		kind: "record",
		group: "inventory",
		labelAr: "المخزون",
		labelEn: "Inventory",
		scopes: [],
		extraActions: ["view_cost", "export"],
		controllers: ["inventory"],
	},
	{
		key: "stock",
		kind: "record",
		group: "inventory",
		labelAr: "حركات المخزون",
		labelEn: "Stock Movements",
		scopes: [],
		// التسوية تغيّر الكميّة بلا مستند شراء أو بيع، والتحويل ينقلها بين الفروع —
		// كلاهما بابٌ لإخفاء عجز، فيُمنحان صراحةً لا ضمن «تعديل».
		extraActions: ["adjust", "transfer", "count", "receive", "issue_out", "write_off"],
		controllers: ["stock"],
	},
	{
		key: "product_comments",
		kind: "record",
		group: "inventory",
		labelAr: "ملاحظات الأصناف",
		labelEn: "Product Comments",
		scopes: ["OWN"],
		controllers: ["product-comments"],
	},

	// ── HR ─────────────────────────────────────────────────────────────────────────────
	{
		key: "staff",
		kind: "record",
		group: "hr",
		labelAr: "الموظفون",
		labelEn: "Staff",
		scopes: ["BRANCH", "OWN"],
		extraActions: ["invite", "view_contact", "view_documents", "terminate", "export"],
		controllers: [
			"staff",
			"staff-documents",
			"staff-services",
			"staff-consultation-types",
			"staff-scheduling",
		],
	},
	{
		key: "staff_compensation",
		kind: "record",
		group: "hr",
		labelAr: "أجور الموظفين",
		labelEn: "Staff Compensation",
		// مورد منفصل عن «الموظفون» عمدًا: الراتب يُرى بإذنٍ خاص، ومن يحرّر ملفّ موظف
		// لا يرى أجره تلقائيًا.
		scopes: ["OWN"],
		extraActions: ["approve", "export"],
		controllers: ["staff-compensation"],
	},
	{
		key: "payroll",
		kind: "record",
		group: "hr",
		labelAr: "الرواتب",
		labelEn: "Payroll",
		scopes: [],
		extraActions: ["approve", "run", "disburse", "export"],
		controllers: ["payroll"],
	},
	{
		key: "attendance",
		kind: "record",
		group: "hr",
		labelAr: "الحضور والانصراف",
		labelEn: "Attendance",
		scopes: ["OWN"],
		extraActions: ["manual_entry", "export"],
		controllers: ["attendance"],
	},
	{
		key: "leave_requests",
		kind: "record",
		group: "hr",
		labelAr: "طلبات الإجازات",
		labelEn: "Leave Requests",
		scopes: ["OWN"],
		extraActions: ["approve", "cancel"],
		controllers: ["leave-requests"],
	},
	{
		key: "compensatory",
		kind: "record",
		group: "hr",
		labelAr: "البدلات التعويضية",
		labelEn: "Compensatory Entries",
		scopes: ["OWN"],
		extraActions: ["approve"],
		controllers: ["compensatory"],
	},
	{
		key: "end_of_service",
		kind: "record",
		group: "hr",
		labelAr: "نهاية الدورة",
		labelEn: "End of Service",
		scopes: [],
		extraActions: ["approve", "calculate", "disburse"],
		controllers: ["end-of-service"],
	},
	{
		key: "shifts",
		kind: "record",
		group: "hr",
		labelAr: "الورديات",
		labelEn: "Shifts",
		scopes: [],
		extraActions: ["publish", "assign"],
		controllers: ["shifts", "scheduling"],
	},
	{
		key: "leave_types",
		kind: "master",
		group: "hr",
		labelAr: "أنواع الإجازات",
		labelEn: "Leave Types",
		scopes: [],
		controllers: ["leave-types"],
	},
	{
		key: "specializations",
		kind: "master",
		group: "hr",
		labelAr: "التخصصات",
		labelEn: "Specializations",
		scopes: [],
		controllers: [
			"specializations",
			"specialization-categories",
			"specialization-subcategories",
		],
	},
	{
		key: "training",
		kind: "record",
		group: "hr",
		labelAr: "التدريب والدورات",
		labelEn: "Training & Courses",
		scopes: ["OWN"],
		extraActions: ["assign", "publish", "issue_certificate"],
		controllers: ["training", "course-assignments"],
	},
	{
		key: "quizzes",
		kind: "record",
		group: "hr",
		labelAr: "الاختبارات",
		labelEn: "Quizzes",
		scopes: ["OWN"],
		// التصحيح يغيّر نتيجة موظف آخر؛ ليس تعديلًا على الاختبار نفسه.
		extraActions: ["assign", "grade", "publish", "view_results"],
		controllers: ["quizzes", "quiz-assignments", "quiz-attempts"],
	},
	{
		key: "sops",
		kind: "record",
		group: "hr",
		labelAr: "إجراءات التشغيل القياسية",
		labelEn: "SOPs",
		scopes: [],
		extraActions: ["publish", "acknowledge"],
		controllers: ["sops"],
	},

	// ── operations ─────────────────────────────────────────────────────────────────────
	{
		key: "tasks",
		kind: "record",
		group: "operations",
		labelAr: "المهام",
		labelEn: "Tasks",
		scopes: ["OWN"],
		extraActions: ["assign", "complete", "comment"],
		controllers: ["tasks"],
	},
	{
		key: "chat",
		kind: "record",
		group: "operations",
		labelAr: "المحادثات",
		labelEn: "Chat",
		scopes: ["OWN"],
		controllers: ["chat"],
	},
	{
		key: "inbox",
		kind: "record",
		group: "operations",
		labelAr: "الوارد",
		labelEn: "Inbox",
		scopes: ["OWN"],
		controllers: ["inbox", "inbox-settings"],
	},
	{
		key: "notifications",
		kind: "record",
		group: "operations",
		labelAr: "الإشعارات",
		labelEn: "Notifications",
		scopes: ["OWN"],
		extraActions: ["broadcast"],
		controllers: ["notifications"],
	},
	{
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
		key: "reminders",
		kind: "record",
		group: "operations",
		labelAr: "التذكيرات والاستدعاء",
		labelEn: "Reminders & Recall",
		scopes: [],
		extraActions: ["send_reminders", "run"],
		controllers: ["reminders", "scheduler"],
	},
	{
		key: "documents",
		kind: "record",
		group: "operations",
		labelAr: "مستندات الأكاديمية",
		labelEn: "Clinic Documents",
		scopes: ["BRANCH"],
		controllers: ["clinic-documents"],
	},
	{
		key: "dashboard",
		kind: "report",
		group: "operations",
		labelAr: "لوحة المعلومات",
		labelEn: "Dashboard",
		scopes: [],
		controllers: ["dashboard"],
	},
	{
		key: "uploads",
		kind: "tool",
		group: "operations",
		labelAr: "رفع الملفات",
		labelEn: "Uploads",
		scopes: [],
		controllers: ["uploads"],
	},
	{
		key: "kiosk",
		kind: "tool",
		group: "operations",
		labelAr: "شاشة الاستقبال",
		labelEn: "Kiosk",
		scopes: [],
		controllers: ["kiosk"],
	},
	{
		key: "public_bookings",
		kind: "record",
		group: "operations",
		labelAr: "الحجوزات العامّة",
		labelEn: "Public Bookings",
		scopes: [],
		extraActions: ["approve", "reject"],
		controllers: ["public-bookings", "public"],
	},

	// ── services & catalogue ───────────────────────────────────────────────────────────
	{
		key: "services",
		kind: "master",
		group: "operations",
		labelAr: "الدورات",
		labelEn: "Services",
		scopes: [],
		extraActions: ["manage_pricing"],
		controllers: ["services", "categories", "subcategories"],
	},
	{
		key: "consultation_types",
		kind: "master",
		group: "operations",
		labelAr: "أنواع الاستشارات",
		labelEn: "Consultation Types",
		scopes: [],
		controllers: ["consultation-types"],
	},
	{
		key: "branches",
		kind: "master",
		group: "operations",
		labelAr: "الفروع والقاعات",
		labelEn: "Branches & Rooms",
		scopes: [],
		extraActions: ["manage_rooms"],
		controllers: ["branches", "rooms"],
	},

	// ── administration ─────────────────────────────────────────────────────────────────
	{
		key: "rbac",
		kind: "record",
		group: "admin",
		labelAr: "الأدوار والصلاحيات",
		labelEn: "Roles & Permissions",
		scopes: [],
		// إسناد دور لموظف فعلٌ مختلف عن تحرير الدور نفسه: الأوّل يوزّع سلطة قائمة،
		// والثاني يصنعها. من يملك الاثنين يستطيع ترقية نفسه.
		extraActions: ["assign", "view_audit"],
		controllers: ["staff-roles"],
	},
	{
		key: "settings",
		kind: "settings",
		group: "admin",
		labelAr: "إعدادات الأكاديمية",
		labelEn: "Clinic Settings",
		scopes: [],
		extraActions: ["manage_integrations", "manage_billing"],
		controllers: ["settings"],
	},
	{
		key: "users",
		kind: "record",
		group: "admin",
		labelAr: "المستخدمون",
		labelEn: "Users",
		scopes: [],
		extraActions: ["impersonate"],
		controllers: ["users"],
	},
	{
		key: "invites",
		kind: "record",
		group: "admin",
		labelAr: "الدعوات",
		labelEn: "Invites",
		scopes: [],
		extraActions: ["revoke"],
		controllers: ["invites"],
	},
	{
		key: "onboarding",
		kind: "tool",
		group: "admin",
		labelAr: "التهيئة الأولى",
		labelEn: "Onboarding",
		scopes: [],
		controllers: ["onboarding"],
	},
	{
		key: "agent",
		kind: "tool",
		group: "admin",
		labelAr: "المساعد الذكي",
		labelEn: "AI Agent",
		scopes: [],
		extraActions: ["configure"],
		controllers: ["agent"],
	},
	{
		key: "audit_log",
		kind: "report",
		group: "admin",
		labelAr: "سجلّ التدقيق",
		labelEn: "Audit Log",
		scopes: [],
		controllers: [],
	},
] as const satisfies readonly RbacResource[];

export type RbacResourceKey = (typeof RBAC_RESOURCES)[number]["key"];

// ── derivations ────────────────────────────────────────────────────────────────────────

const RESOURCE_BY_KEY = new Map<string, RbacResource>(
	RBAC_RESOURCES.map((resource) => [resource.key, resource]),
);

export function findResource(key: string): RbacResource | undefined {
	return RESOURCE_BY_KEY.get(key);
}

/** `{resource}.{action}` — the ONLY place a permission slug is constructed. */
export function permissionKey(resource: string, action: string): string {
	return `${resource}.${action}`;
}

/** Every action a resource grants: its kind's defaults plus its declared domain verbs. */
export function actionsFor(resource: RbacResource): readonly string[] {
	return [...ACTIONS_BY_KIND[resource.kind], ...(resource.extraActions ?? [])];
}

/**
 * Whether a resource supports an action at all. Checked BEFORE a permission lookup, but
 * always AFTER the super-admin bypass — registering a runnable tool under a kind that has
 * no `run` is what made both P12A marquee endpoints 403 for *everyone*, admins included.
 */
export function resourceSupportsAction(resourceKey: string, action: string): boolean {
	const resource = findResource(resourceKey);
	if (!resource) return false;
	return actionsFor(resource).includes(action);
}

/** Whether a grant on this resource may be narrowed to the given scope. */
export function resourceSupportsScope(resourceKey: string, scope: PermissionScope): boolean {
	if (scope === "ALL") return true;
	const resource = findResource(resourceKey);
	if (!resource) return false;
	return (resource.scopes as readonly PermissionScope[]).includes(scope);
}

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

export const ACTION_LABELS: Record<RbacAction, { ar: string; en: string }> = {
	read: { ar: "عرض", en: "View" },
	create: { ar: "إضافة", en: "Create" },
	update: { ar: "تعديل", en: "Edit" },
	delete: { ar: "حذف", en: "Delete" },
	export: { ar: "تصدير", en: "Export" },
	approve: { ar: "اعتماد", en: "Approve" },
	run: { ar: "تشغيل", en: "Run" },
};

function actionLabel(action: string): { ar: string; en: string } {
	return (
		ACTION_LABELS[action as RbacAction] ??
		EXTRA_ACTION_LABELS[action] ?? { ar: action, en: action }
	);
}

export const ALL_RBAC_PERMISSIONS: RbacPermissionEntry[] = RBAC_RESOURCES.flatMap((resource) =>
	actionsFor(resource).map((action) => {
		const label = actionLabel(action);
		return {
			key: permissionKey(resource.key, action),
			resource: resource.key,
			action,
			group: resource.group,
			labelAr: `${label.ar} ${resource.labelAr}`,
			labelEn: `${label.en} ${resource.labelEn}`,
			scopes: resource.scopes,
		};
	}),
);

export const ALL_RBAC_PERMISSION_KEYS: string[] = ALL_RBAC_PERMISSIONS.map((p) => p.key);
