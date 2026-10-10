import { ALL_ACCOUNTING_PERMISSIONS } from "@sanad/contracts/accounting/permissions";

export const PERMISSIONS = {
	PATIENTS_OWNERS_VIEW_LIMITED: "patients_owners.view_limited",
	PATIENTS_OWNERS_VIEW_FULL: "patients_owners.view_full",
	PATIENTS_OWNERS_CREATE: "patients_owners.create",
	PATIENTS_OWNERS_EDIT: "patients_owners.edit",
	PATIENTS_OWNERS_DELETE: "patients_owners.delete",

	APPOINTMENTS_VIEW_LIMITED: "appointments.view_limited",
	APPOINTMENTS_VIEW_FULL: "appointments.view_full",
	APPOINTMENTS_CREATE: "appointments.create",
	APPOINTMENTS_EDIT: "appointments.edit",
	APPOINTMENTS_DELETE: "appointments.delete",
	APPOINTMENTS_SEND_REMINDERS: "appointments.send_reminders",

	TASKS_VIEW_LIMITED: "tasks.view_limited",
	TASKS_VIEW_FULL: "tasks.view_full",
	TASKS_CREATE: "tasks.create",
	TASKS_EDIT: "tasks.edit",
	TASKS_DELETE: "tasks.delete",
	TASKS_ASSIGN: "tasks.assign",

	STAFF_VIEW_LIMITED: "staff.view_limited",
	STAFF_VIEW_FULL: "staff.view_full",
	STAFF_CREATE: "staff.create",
	STAFF_EDIT: "staff.edit",
	STAFF_DELETE: "staff.delete",
	STAFF_INVITE: "staff.invite",

	INVENTORY_VIEW_LIMITED: "inventory.view_limited",
	INVENTORY_VIEW_FULL: "inventory.view_full",
	INVENTORY_CREATE: "inventory.create",
	INVENTORY_EDIT: "inventory.edit",
	INVENTORY_DELETE: "inventory.delete",
	// [P12B.2] إرجاع بيع نقطة بيع: يعيد الأصناف للمخزون ويجعل البيع قابلًا للعكس محاسبيًا.
	// مثل أختها أعلاه: صلاحية فعل، لا تُمنح تلقائيًا لمن يرى المخزون.
	INVENTORY_SALES_REFUND: "inventory.sales_refund",

	// The operational-billing half of the «المالية» area. One resource per destination —
	// the repo models a resource as `{resource}.{action}` with a view level, so per-tab
	// visibility means per-tab RESOURCES (`finance_invoices`), never a third slug segment.
	// Mostly read-level: these gate nav + tab visibility. The one action permission is
	// `finance_invoices.refund` ([P12B.1]) — see the note on it.
	FINANCE_INVOICES_VIEW_LIMITED: "finance_invoices.view_limited",
	FINANCE_INVOICES_VIEW_FULL: "finance_invoices.view_full",
	// [P12B.1] أوّل صلاحية فعل (لا عرض) على هذا المورد. الردّ يعكس قيدًا مُرحَّلًا في دفتر
	// الأستاذ عبر محول فواتير الأكاديمية، فلا يصحّ أن يرثه كل من يرى الفواتير — ولذلك هي
	// خارج FINANCE_DEFAULT_GRANT عمدًا (نفس منطق documents.delete).
	FINANCE_INVOICES_REFUND: "finance_invoices.refund",

	FINANCE_DISCOUNTS_VIEW_LIMITED: "finance_discounts.view_limited",
	FINANCE_DISCOUNTS_VIEW_FULL: "finance_discounts.view_full",

	FINANCE_CARE_PLANS_VIEW_LIMITED: "finance_care_plans.view_limited",
	FINANCE_CARE_PLANS_VIEW_FULL: "finance_care_plans.view_full",

	FINANCE_EXPENSES_VIEW_LIMITED: "finance_expenses.view_limited",
	FINANCE_EXPENSES_VIEW_FULL: "finance_expenses.view_full",

	// خزانة مستندات الأكاديمية (/management/documents). «المحدود» له معنى فعلي هنا:
	// مستندات فرع المستخدم + المستندات العامّة، مقابل «الكامل» = كل مستندات الأكاديمية.
	DOCUMENTS_VIEW_LIMITED: "documents.view_limited",
	DOCUMENTS_VIEW_FULL: "documents.view_full",
	DOCUMENTS_CREATE: "documents.create",
	DOCUMENTS_EDIT: "documents.edit",
	DOCUMENTS_DELETE: "documents.delete",

	// وحدة التجميل (docs/grooming-module-plan.md). «المحدود» له معنى فعلي هنا:
	// جلسات المُجمِّل نفسه مقابل «الكامل» = كل جلسات الأكاديمية. `edit` هي الصلاحية
	// التي تسمح بتجاوز بوابة أمان بسبب مسجَّل — وثلاث بوابات لا تُتجاوز بها ولا
	// بغيرها (G5 التجفيف، G6 أمر المدرّب، G10 الحادثة المفتوحة).
	GROOMING_VIEW_LIMITED: "grooming.view_limited",
	GROOMING_VIEW_FULL: "grooming.view_full",
	GROOMING_CREATE: "grooming.create",
	GROOMING_EDIT: "grooming.edit",
	GROOMING_DELETE: "grooming.delete",

	// [MC0.3] الأكاديميات المتنقلة (/care/mobile-clinic). «المحدود» له معنى فعلي هنا:
	// وحدات فرع المستخدم فقط، مقابل «الكامل» = كل وحدات الأكاديمية.
	//
	// `dispatch` و `manage_devices` صلاحيتان منفصلتان عن `edit` عن قصد: إسناد الزيارات
	// عملٌ يومي يقوم به منسّق الحركة، بينما إصدار رمز مركبة أو إبطاله فعلٌ أمني يعادل
	// تسليم مفتاح — الأول يُمنح بسخاء والثاني بحساب، فلا يصحّ أن يحملهما مفتاح واحد.
	MOBILE_CLINICS_VIEW_LIMITED: "mobile_clinics.view_limited",
	MOBILE_CLINICS_VIEW_FULL: "mobile_clinics.view_full",
	MOBILE_CLINICS_CREATE: "mobile_clinics.create",
	MOBILE_CLINICS_EDIT: "mobile_clinics.edit",
	MOBILE_CLINICS_DELETE: "mobile_clinics.delete",
	MOBILE_CLINICS_DISPATCH: "mobile_clinics.dispatch",
	MOBILE_CLINICS_MANAGE_DEVICES: "mobile_clinics.manage_devices",

	// [CRM-P0] وحدة إدارة العملاء (BRD_CRM_Module.md §13). المجموعة `crm_settings` تحكم
	// مسارات البيانات المرجعية للوحدة: حالات العملاء المحتملين والصفقات ومصادرهم وأسباب
	// الفقد والقطاعات، ومفاتيح إعدادات الوحدة نفسها.
	//
	// لماذا الإدارة (`crm_settings`) بمنطق الواجهة الأمامية لا بمنطق أنواع المستندات
	// المحاسبية: الـ CRM سابق للبيع بالكامل ولا يكتب قيدًا في الأستاذ ولا يمسّ مَفصل تسعير
	// (§0.4)، فربطه بمصفوفة المحاسبة كان سيجعل مديرَ استقبال يحتاج صلاحية محاسبية ليدير
	// بيانات استقباله (قرار وليّ الأمر Q2، §17.2 صف ٤).
	//
	// لا يوجد `view_limited`: البيانات المرجعية على مستوى الأكاديمية بلا بُعد فرعٍ أو ملكية،
	// فـ«المحدود» لا معنى له هنا — بخلاف المستندات والتجميل والأكاديميات المتنقلة أعلاه حيث
	// له معنى فعلي. ولا يوجد `delete`: BR-C2.1.1 يمنع الحذف الصلب نهائيًا، والتعطيل تعديل.
	//
	// المراحل التالية تسجّل صلاحياتها مع جداولها (§13): `crm_leads.*` و `crm_deals.*` مرساتهما
	// `patients_owners.*`، و`crm_tasks.*` مرساته `tasks.*` — مقابَلةً فعلًا بفعل، وهي مصادَق
	// عليها من وليّ الأمر مسبقًا فلا تُعاد مناقشتها في CRM-P1/P2.
	CRM_SETTINGS_VIEW_FULL: "crm_settings.view_full",
	CRM_SETTINGS_CREATE: "crm_settings.create",
	CRM_SETTINGS_EDIT: "crm_settings.edit",

	// [CRM-P1] العملاء المحتملون والمهام (§3، §8.2، §13). المرساة مسجَّلة في §17.2:
	// `crm_leads.*` ← `patients_owners.*` و`crm_tasks.*` ← `tasks.*`، فعلًا بفعل.
	//
	// «المحدود» له معنى فعلي هنا — بخلاف بيانات §2 المرجعية: العميل المحتمل يحمل موظفًا
	// مسؤولًا (`ownerUserId`)، فـ«عملائي» مقابل «كل العملاء» تمييزٌ حقيقي، وكذلك المهام.
	//
	// `crm_leads.assign` هي الصلاحية الوحيدة بلا نظير حرفي: `patients_owners` لا تملك
	// `assign` أصلًا، فمرساتها `patients_owners.edit` — الإسناد كتابةٌ على العميل المحتمل —
	// وهي الأضيق بين المرشَّحَين (الآخر `tasks.assign`، وهو عائلة كيانٍ أخرى).
	CRM_LEADS_VIEW_LIMITED: "crm_leads.view_limited",
	CRM_LEADS_VIEW_FULL: "crm_leads.view_full",
	CRM_LEADS_CREATE: "crm_leads.create",
	CRM_LEADS_EDIT: "crm_leads.edit",
	CRM_LEADS_DELETE: "crm_leads.delete",
	CRM_LEADS_ASSIGN: "crm_leads.assign",

	// [CRM-P2] الصفقات (BRD §4، §13). نفس مرساة العملاء المحتملين: `patients_owners.*`
	// فعلًا بفعل — الصفقة سلطةُ سجلِّ شخصٍ في المكتب الأمامي كالعميل المحتمل تمامًا.
	// [LY-P0] وحدة الولاء (docs/BRD_Loyalty_Module.md §12). صيغةُ **المكتب الأمامي** لا
	// سجلّ أنواع المستندات المحاسبي — نفس حسم CRM §17.2 صفّ ٤: وحدةٌ أماميّة يجب ألّا
	// تحتاج صلاحيةً محاسبية لتُفعَّل أو تُدار.
	//
	// المرساة: `patients_owners.edit` — السلطة التي تُنظّم بيانات الأشخاص في المكتب
	// الأمامي اليوم، وهي المقابَلة التي صادق عليها وليّ الأمر في CRM-P0 لبيانات §2 المرجعية
	// وتنطبق هنا بحرفها: برنامج الولاء ومستوياته بياناتٌ مرجعية على مستوى الأكاديمية.
	//
	// لا `view_limited`: البرنامج والمستويات على مستوى الأكاديمية بلا بُعد فرعٍ أو ملكية.
	// ولا `delete`: BR-L3.3 يمنع الحذف الصلب ما دام هناك مرجع، والتعطيل تعديل.
	LOYALTY_SETTINGS_VIEW_FULL: "loyalty_settings.view_full",
	LOYALTY_SETTINGS_CREATE: "loyalty_settings.create",
	LOYALTY_SETTINGS_EDIT: "loyalty_settings.edit",

	// §12 — كشوف النقاط وتقاريرها. قراءةٌ فقط في v1: الكتابة على الدفتر تقع من مسارات
	// الكسب والاستبدال (LY-P1/P2)، والتسوية اليدوية (BR-L9.2) محكومة بـ`loyalty_settings.edit`
	// لا بصلاحية قراءةٍ موسَّعة.
	//
	// **والاستبدال نفسه بلا صلاحية جديدة عمدًا** (§12): من يملك قبض الدفع يملك تطبيق
	// النقاط — صلاحيةٌ منفصلة كانت ستجعل الأداة عديمة الفائدة عند الكاونتر.
	LOYALTY_LEDGER_VIEW_FULL: "loyalty_ledger.view_full",

	CRM_DEALS_VIEW_LIMITED: "crm_deals.view_limited",
	CRM_DEALS_VIEW_FULL: "crm_deals.view_full",
	CRM_DEALS_CREATE: "crm_deals.create",
	CRM_DEALS_EDIT: "crm_deals.edit",
	CRM_DEALS_DELETE: "crm_deals.delete",
	CRM_DEALS_ASSIGN: "crm_deals.assign",

	CRM_TASKS_VIEW_LIMITED: "crm_tasks.view_limited",
	CRM_TASKS_VIEW_FULL: "crm_tasks.view_full",
	CRM_TASKS_CREATE: "crm_tasks.create",
	CRM_TASKS_EDIT: "crm_tasks.edit",
	CRM_TASKS_DELETE: "crm_tasks.delete",
	CRM_TASKS_ASSIGN: "crm_tasks.assign",

	// [MK0.1] وحدة التسويق (docs/planning/marketing-module-plan.md). «المحدود» له معنى
	// فعلي هنا: حملات فرع المستخدم فقط، مقابل «الكامل» = كل حملات الأكاديمية.
	//
	// `launch` منفصلة عن `edit` عن قصد: التعديل يمسّ مسوّدة داخلية، أمّا الإطلاق فيُخرج
	// نصًّا وصورةً وُلّدا آليًّا إلى العلن باسم الأكاديمية — وهذا فعلٌ لا يُورَّث لكل من
	// يحرّر. لا توجد صلاحية فوترة: القرار D1 (draft-and-export) يعني أن النظام لا يحتفظ
	// ببطاقة ولا يشتري وسائط، فصلاحية لا تحرس شيئًا هي كذبة في مصفوفة الأدوار.
	MARKETING_VIEW_LIMITED: "marketing.view_limited",
	MARKETING_VIEW_FULL: "marketing.view_full",
	MARKETING_CREATE: "marketing.create",
	MARKETING_EDIT: "marketing.edit",
	MARKETING_DELETE: "marketing.delete",
	MARKETING_LAUNCH: "marketing.launch",

	// [PH0.1] الصيدلية والصرف. ستّ صلاحيات لا خمس: الوصف والصرف فعلان مختلفان يؤدّيهما
	// شخصان مختلفان (المدرّب يصف، الصيدلي يصرف)، وتأليف النشرات الدوائية سلطة سريرية
	// ثالثة لا علاقة لها بأيّهما. أمّا سجل المواد المراقبة فصلاحيتان منفصلتان عن الصرف
	// عمدًا (BRD §8.4): من يصرف الدواء ليس بالضرورة من يُقرّ إتلافه أو يسوّي رصيده.
	PHARMACY_VIEW: "pharmacy.view",
	PHARMACY_PRESCRIBE: "pharmacy.prescribe",
	PHARMACY_DISPENSE: "pharmacy.dispense",
	PHARMACY_FORMULARY_EDIT: "pharmacy.formulary_edit",
	PHARMACY_CONTROLLED_VIEW: "pharmacy.controlled_view",
	PHARMACY_CONTROLLED_RECORD: "pharmacy.controlled_record",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/**
 * Resource ids of the legacy operational-billing destinations, for `canView(resource)`.
 * The unified finance nav gates its legacy items with these; accounting items gate on
 * `accounting.{doctype}.read` instead (see `finance-nav.ts`).
 */
export const FINANCE_RESOURCES = {
	invoices: "finance_invoices",
	discounts: "finance_discounts",
	carePlans: "finance_care_plans",
	expenses: "finance_expenses",
} as const;

export type FinanceResource = (typeof FINANCE_RESOURCES)[keyof typeof FINANCE_RESOURCES];

/**
 * Granted to every pre-existing role by the [P1-NAV] backfill migration: these permissions
 * did not exist before, so every role implicitly had access to the finance tabs. Gating is
 * an opt-in restriction — nobody loses access on migration day.
 */
export const FINANCE_DEFAULT_GRANT: string[] = Object.values(FINANCE_RESOURCES).map(
	(resource) => `${resource}.view_full`,
);

/**
 * نفس منطق `FINANCE_DEFAULT_GRANT` لوحدة المستندات: هذه الصلاحيات لم تكن موجودة قبل
 * الوحدة، فكل دور قائم كان يملك الوصول ضمنًا. ترحيل التعبئة الرجعية يمنح القراءة
 * الكاملة للأدوار القائمة — التقييد قرار لاحق يتخذه وليّ الأمر، لا أثر جانبي للترحيل.
 */
export const DOCUMENTS_DEFAULT_GRANT: string[] = [PERMISSIONS.DOCUMENTS_VIEW_FULL];

/**
 * نفس المنطق لوحدة التجميل: الوجهة `/care/grooming` معلنة في الشريط الجانبي منذ
 * ما قبل الوحدة، فبوابة صلاحية جديدة بلا تعبئة رجعية تُغلق شاشةً كان الجميع
 * يراها. القراءة الكاملة تُمنح لكل دور قائم؛ الإنشاء والتعديل والحذف تبدأ فارغة
 * وتُمنح صراحةً — التعديل تحديدًا يحمل حقّ تجاوز البوابات.
 */
export const GROOMING_DEFAULT_GRANT: string[] = [PERMISSIONS.GROOMING_VIEW_FULL];

/**
 * [MC0.3] نفس منطق `DOCUMENTS_DEFAULT_GRANT`: عنصر «الأكاديمية المتنقلة» موجود في الشريط
 * الجانبي منذ ما قبل الوحدة، فحارسٌ جديد بلا تعبئة رجعيّة يقفل شاشةً يراها المستخدم
 * معروضة أمامه. تُمنح القراءة الكاملة فقط — أمّا `dispatch` و `manage_devices` و
 * إنشاء/تعديل/حذف المركبات فتبدأ فارغة للجميع وتُمنح صراحةً.
 */
export const MOBILE_CLINICS_DEFAULT_GRANT: string[] = [PERMISSIONS.MOBILE_CLINICS_VIEW_FULL];

/**
 * [MK0.1] نفس منطق `MOBILE_CLINICS_DEFAULT_GRANT`: عنصر «التسويق» معلن في الشريط الجانبي
 * منذ ما قبل الوحدة (`app-sidebar.tsx`) — الرابط يشير اليوم إلى مسار غير موجود. بوابة
 * صلاحية جديدة بلا تعبئة رجعيّة تُحوّل الرابط المكسور إلى رابط ممنوع، وهذا أسوأ. تُمنح
 * القراءة الكاملة لكل دور قائم؛ أمّا الإنشاء والتعديل والحذف والإطلاق فتبدأ فارغة
 * للجميع وتُمنح صراحةً.
 */
export const MARKETING_DEFAULT_GRANT: string[] = [PERMISSIONS.MARKETING_VIEW_FULL];

/**
 * [PH0.1] **الصيدلية بلا تعبئة رجعيّة — وهذا مقصود، وليس سهوًا.**
 *
 * كل تعبئة رجعيّة أعلاه لها سبب واحد: الوجهة كانت **مرئيّة** في الشريط الجانبي قبل
 * الوحدة، فبوابة جديدة بلا منح رجعيّ تُحوّل شاشةً كان الجميع يراها إلى «ممنوع». أمّا
 * الصيدلية فلا عنصر لها في `app-sidebar.tsx` اليوم ولا مسار — لا أحد يفقد شيئًا، فلا
 * شيء يُعوَّض.
 *
 * والفرق هنا ليس شكليًّا: `pharmacy.prescribe` يكتب جرعة دواء، و`pharmacy.dispense`
 * يُخرج مادةً من المخزون إلى طفل حيّ، و`pharmacy.controlled_record` يُقرّ إتلاف مادة
 * مراقبة. منحُ أيٍّ من هذه لكل دور قائم «حفاظًا على الوصول» يمنح صلاحية سريرية لموظف
 * استقبال. تبدأ الستّ **فارغة للجميع** وتُمنح صراحةً لكل دور.
 *
 * لذلك لا يوجد `PHARMACY_DEFAULT_GRANT`، ولا ترحيل تعبئة رجعيّة في [PH0]. إن أضيف
 * عنصر «الصيدلية» إلى الشريط الجانبي لاحقًا فهو يظهر لمن مُنح `pharmacy.view` فقط —
 * وهو السلوك الصحيح لوحدة جديدة خلف راية مطفأة (BRD §0.3).
 */

/**
 * The grantable permission catalogue. `staff-roles.type.ts` validates against this list, so
 * a slug missing here can never be saved on a `StaffRole` — which is why the accounting
 * matrix ([P0.3], BRD NFR-5) is merged in rather than kept in a parallel registry. The
 * accounting module owns its own slugs (`@/server/accounting/permissions/`); that module is
 * pure string constants, safe to pull into client bundles alongside this file.
 */
export const ALL_PERMISSIONS: string[] = [
	...(Object.values(PERMISSIONS) as Permission[]),
	...ALL_ACCOUNTING_PERMISSIONS,
];
